export interface SaveBackend { read(key: string): string | null; write(key: string, json: string): void; remove(key: string): void; }
export class MemorySaveBackend implements SaveBackend {
  private readonly data = new Map<string, string>();
  read(key: string): string | null { return this.data.get(key) ?? null; }
  write(key: string, value: string): void { this.data.set(key, value); }
  remove(key: string): void { this.data.delete(key); }
}
export interface SaveEnvelope<T> { readonly version: number; readonly payload: T; }
export class VersionedSaveStore<T> {
  constructor(
    private readonly backend: SaveBackend, private readonly namespace: string,
    readonly version: number, private readonly validate: (value: unknown) => value is T,
    private readonly migrate?: (oldVersion: number, payload: unknown) => T,
  ) {
    if (!/^[a-z][a-z0-9-]{1,62}$/.test(namespace) || !Number.isSafeInteger(version) || version < 1) throw new Error('Invalid save schema');
  }
  save(slot: string, payload: T): void {
    if (!this.validate(payload)) throw new TypeError('Invalid save payload');
    this.backend.write(this.key(slot), JSON.stringify({ version: this.version, payload } satisfies SaveEnvelope<T>));
  }
  load(slot: string): T | null {
    const raw = this.backend.read(this.key(slot));
    if (raw === null) return null;
    const json: unknown = JSON.parse(raw);
    if (!json || typeof json !== 'object') throw new Error('Corrupt save envelope');
    const record = json as Record<string, unknown>;
    if (!Number.isSafeInteger(record.version) || (record.version as number) < 1) throw new Error('Corrupt save version');
    if ((record.version as number) > this.version) throw new Error('Save was created with a newer game version');
    let payload: unknown = record.payload;
    if (record.version !== this.version) {
      if (!this.migrate) throw new Error('Save migration is required');
      payload = this.migrate(record.version as number, payload);
    }
    if (!this.validate(payload)) throw new Error('Save payload failed validation');
    return payload;
  }
  remove(slot: string): void { this.backend.remove(this.key(slot)); }
  private key(slot: string): string {
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(slot)) throw new Error('Invalid save slot');
    return `${this.namespace}:${slot}`;
  }
}
