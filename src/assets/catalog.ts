export interface AssetDescriptor { readonly id: string; readonly path: string; readonly sha256: string; readonly requires?: readonly string[]; }
export class AssetCatalog {
  private readonly records = new Map<string, AssetDescriptor>();
  add(asset: AssetDescriptor): void {
    if (!/^[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*$/.test(asset.id)) throw new Error('Invalid asset ID');
    if (!/^[a-f0-9]{64}$/.test(asset.sha256)) throw new Error('Invalid SHA-256 digest');
    if (!asset.path || asset.path.startsWith('/') || asset.path.includes('\\') ||
        asset.path.split('/').some(part => !part || part === '.' || part === '..') ||
        /^[a-z]+:/i.test(asset.path)) throw new Error('Unsafe asset path');
    if (this.records.has(asset.id)) throw new Error(`Duplicate asset: ${asset.id}`);
    this.records.set(asset.id, { ...asset, requires: [...(asset.requires ?? [])] });
  }
  get(id: string): AssetDescriptor | undefined {
    const value = this.records.get(id);
    return value ? { ...value, requires: [...(value.requires ?? [])] } : undefined;
  }
  ordered(): AssetDescriptor[] {
    const result: AssetDescriptor[] = [];
    const seen = new Set<string>(); const visiting = new Set<string>();
    const visit = (id: string): void => {
      if (visiting.has(id)) throw new Error(`Asset dependency cycle: ${id}`);
      if (seen.has(id)) return;
      const asset = this.records.get(id);
      if (!asset) throw new Error(`Missing asset dependency: ${id}`);
      visiting.add(id);
      for (const dep of asset.requires ?? []) visit(dep);
      visiting.delete(id); seen.add(id); result.push({ ...asset });
    };
    for (const id of this.records.keys()) visit(id);
    return result;
  }
}
