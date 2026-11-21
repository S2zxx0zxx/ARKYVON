#!/usr/bin/env node
import { mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const slug = process.argv[2];
const dimension = process.argv[3] ?? '2d';
if (typeof slug !== 'string' || !/^[a-z][a-z0-9-]{1,62}$/.test(slug) || !['2d', '3d'].includes(dimension)) {
  console.error('Usage: node tools/create-game.mjs <safe-game-slug> [2d|3d]');
  process.exitCode = 2;
} else {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const directory = join(root, 'games', slug);
  try { await access(directory); throw new Error('Game already exists: ' + slug); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(join(root, 'games'), { recursive: true });
  await mkdir(directory, { recursive: false }); // no overwrite of existing games
  await writeFile(join(directory, 'game.json'), JSON.stringify({ schemaVersion: 1, id: slug, displayName: slug, dimension, targets: ['web'], plugins: [], contentVersion: 1 }, null, 2) + '\n', { flag: 'wx' });
  await writeFile(join(directory, 'README.md'), `# ${slug}\n\nGenerated ARKYVON project scaffold. Implement gameplay independently.\n`, { flag: 'wx' });
  console.log('Created', directory);
}
