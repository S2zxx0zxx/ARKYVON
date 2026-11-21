/** First-stage asset cooker: reproducible copy+hash+provenance, no compression claims. */
import { readFile, realpath, mkdir, writeFile, rename, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, extname, join, sep } from 'node:path';

const MAGIC = {
  '.png': b => b.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
  '.jpg': b => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  '.jpeg': b => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  '.webp': b => b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WEBP',
  '.glb': b => b.toString('ascii',0,4) === 'glTF',
  '.ogg': b => b.toString('ascii',0,4) === 'OggS',
  '.wav': b => b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WAVE',
  '.ktx2': b => b.subarray(0, 12).equals(Buffer.from('ab4b5458203230bb0d0a1a0a','hex')),
};
const MAX_FILE_BYTES=32*1024*1024;
const MAX_TOTAL_BYTES=256*1024*1024;
function verifyPath(name){
  if(typeof name!=='string' || !name || name.startsWith('/') || name.includes('\\') ||
    name.split('/').some(x=>!x || x==='.' || x==='..') || /^[a-z][\w+.-]*:/i.test(name)){
    throw new Error('Unsafe asset source path');
  }
}
function assertBelow(root, target) {
  const rel=relative(root,target);
  if(!rel || rel==='..' || rel.startsWith('..'+sep) || rel.startsWith('/') || resolve(root,rel)!==target)
    throw new Error('Asset must be below the source root');
}
export async function cookAssets({sourceRoot,outputRoot,manifest}) {
  const source=await realpath(sourceRoot);
  if(!manifest || manifest.schemaVersion!==1 || !Array.isArray(manifest.assets) || manifest.assets.length>20000)
    throw new Error('Unsupported asset manifest');
  const ids=new Set();const cooked=[];
  let total=0;
  // Validate the complete input list before publishing any outputs.
  const records=[];
  for(const a of manifest.assets){
    if(!a || typeof a!=='object' || typeof a.id!=='string' || !/^[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*$/.test(a.id) || ids.has(a.id))
      throw new Error('Invalid or duplicate asset ID');
    ids.add(a.id);
    verifyPath(a.source);
    if(typeof a.license!=='string' || !/^[a-z0-9.+-]{2,80}$/i.test(a.license)) throw new Error('Missing or invalid SPDX license identifier');
    const full=await realpath(resolve(source,a.source));
    assertBelow(source,full); // also denies symlinks escaping the root
    const ext=extname(a.source).toLowerCase();
    if(!Object.hasOwn(MAGIC,ext)) throw new Error(`Unsupported asset format: ${ext}`);
    const bytes=await readFile(full);
    total+=bytes.length;
    if(bytes.length===0 || bytes.length>MAX_FILE_BYTES || total>MAX_TOTAL_BYTES) throw new Error('Asset size budget exceeded');
    if(!MAGIC[ext](bytes)) throw new Error(`Format signature mismatch for ${a.id}`);
    const sha256=createHash('sha256').update(bytes).digest('hex');
    records.push({id:a.id,source:a.source,license:a.license,sha256,bytes,ext});
  }
  const out=resolve(outputRoot);
  await mkdir(join(out,'assets'),{recursive:true});
  for(const a of records.sort((a,b)=>a.id.localeCompare(b.id,'en'))){
    const output=`assets/${a.sha256}${a.ext}`;
    const destination=join(out,output);
    try{await writeFile(destination,a.bytes,{flag:'wx'});}
    catch(error){
      if(error.code!=='EEXIST')throw error;
      const existing=await readFile(destination);
      if(createHash('sha256').update(existing).digest('hex')!==a.sha256)
        throw new Error(`Cooked cache corruption: ${output}`);
    }
    cooked.push({id:a.id,source:a.source,output,sha256:a.sha256,bytes:a.bytes.length,license:a.license});
  }
  const index=JSON.stringify({schemaVersion:1,transform:'copy-v1',assets:cooked},null,2)+'\n';
  const temporary=join(out,`asset-index.${process.pid}.${Date.now()}.tmp`);
  try{await writeFile(temporary,index,{flag:'wx'});await rename(temporary,join(out,'asset-index.json'));}
  catch(error){try{await unlink(temporary);}catch{}throw error;}
  return {count:cooked.length,totalBytes:total,index};
}

if(process.argv[1] && resolve(process.argv[1])===resolve(new URL(import.meta.url).pathname)) {
  const [sourceRoot,outputRoot,manifestPath]=process.argv.slice(2);
  if(!sourceRoot || !outputRoot || !manifestPath){console.error('Usage: node tools/asset-cooker.mjs <source-root> <output-root> <asset-manifest.json>');process.exitCode=2;}
  else {
    try{const manifest=JSON.parse(await readFile(manifestPath,'utf8'));const r=await cookAssets({sourceRoot,outputRoot,manifest});console.log(`Cooked ${r.count} assets (${r.totalBytes} bytes)`);}
    catch(e){console.error(e.message);process.exitCode=1;}
  }
}
