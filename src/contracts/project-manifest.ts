export type TargetPlatform = 'web' | 'android';
export type GameDimension = '2d' | '3d';
export interface GameProjectManifest {
  schemaVersion: 1;
  id: string;
  displayName: string;
  dimension: GameDimension;
  targets: TargetPlatform[];
  plugins: string[];
  contentVersion: number;
}
export function parseProjectManifest(input: unknown): GameProjectManifest {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Manifest must be an object');
  const obj = input as Record<string, unknown>;
  if (obj.schemaVersion !== 1) throw new Error('Unsupported manifest schema');
  if (typeof obj.id !== 'string' || !/^[a-z][a-z0-9-]{1,62}$/.test(obj.id)) throw new Error('Invalid game ID');
  if (typeof obj.displayName !== 'string' || !obj.displayName.trim() || obj.displayName.length > 96) throw new Error('Invalid display name');
  if (obj.dimension !== '2d' && obj.dimension !== '3d') throw new Error('Unsupported game dimension');
  if (!Array.isArray(obj.targets) || obj.targets.length < 1 || obj.targets.length > 2 ||
      new Set(obj.targets).size !== obj.targets.length || obj.targets.some(x => x !== 'web' && x !== 'android')) throw new Error('Invalid target platforms');
  if (!Array.isArray(obj.plugins) || obj.plugins.length > 64 || new Set(obj.plugins).size !== obj.plugins.length ||
      obj.plugins.some(x => typeof x !== 'string' || !/^[a-z][a-z0-9-]*$/.test(x))) throw new Error('Invalid plugin IDs');
  if (!Number.isSafeInteger(obj.contentVersion) || (obj.contentVersion as number) < 1) throw new Error('Invalid content version');
  return {
    schemaVersion: 1, id: obj.id, displayName: obj.displayName, dimension: obj.dimension,
    targets: [...obj.targets] as TargetPlatform[], plugins: [...obj.plugins] as string[], contentVersion: obj.contentVersion as number,
  };
}
