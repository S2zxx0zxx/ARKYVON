import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, mkdir, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { cookAssets } from '../tools/asset-cooker.mjs';
const png=Buffer.from('89504e470d0a1a0a00000000','hex');

test('asset cooker emits byte-stable content-addressed file and deterministic manifest',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ark-asset-'));
 try{
  await mkdir(join(root,'source'));await writeFile(join(root,'source','icon.png'),png);
  const manifest={schemaVersion:1,assets:[{id:'ui/icon',source:'icon.png',license:'CC0-1.0'}]};
  const out=join(root,'out');
  const a=await cookAssets({sourceRoot:join(root,'source'),outputRoot:out,manifest});
  const b=await cookAssets({sourceRoot:join(root,'source'),outputRoot:out,manifest});
  assert.equal(a.index,b.index);assert.equal(a.count,1);
  const index=JSON.parse(await readFile(join(out,'asset-index.json'),'utf8'));
  assert.match(index.assets[0].sha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(await readFile(join(out,index.assets[0].output)),png);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('asset cooker rejects path traversal, unknown licenses and unsupported formats',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ark-asset-'));
 try{
  await mkdir(join(root,'source'));await writeFile(join(root,'source','icon.png'),png);
  const base={id:'icon',source:'icon.png',license:'CC0-1.0'};
  const cook=a=>cookAssets({sourceRoot:join(root,'source'),outputRoot:join(root,'out'),manifest:{schemaVersion:1,assets:[a]}});
  await assert.rejects(cook({...base,source:'../icon.png'}),/Unsafe/);
  await assert.rejects(cook({...base,license:''}),/license/);
  await writeFile(join(root,'source','bad.png'),'not an image');
  await assert.rejects(cook({...base,source:'bad.png'}),/signature/);
  await writeFile(join(root,'source','script.svg'),'<svg></svg>');
  await assert.rejects(cook({...base,source:'script.svg'}),/Unsupported/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('asset cooker rejects symlink escaping source root',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ark-asset-'));
 try{
  await mkdir(join(root,'source'));await writeFile(join(root,'other.png'),png);
  await symlink(join(root,'other.png'),join(root,'source','link.png'));
  await assert.rejects(cookAssets({sourceRoot:join(root,'source'),outputRoot:join(root,'out'),manifest:{schemaVersion:1,assets:[{id:'external',source:'link.png',license:'CC0-1.0'}]}}),/below the source root/);
 }finally{await rm(root,{recursive:true,force:true});}
});
