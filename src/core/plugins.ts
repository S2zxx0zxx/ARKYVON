export interface EngineServices { readonly [service: string]: unknown; }
export interface EnginePlugin {
  readonly id: string;
  readonly requires?: readonly string[];
  setup(services: EngineServices): void | (() => void);
}
/** Dependency-ordered plugins, with rollback for partial installation. */
export class PluginHost {
  private readonly installed = new Map<string, () => void>();
  constructor(private readonly services: EngineServices = {}) {}
  installAll(plugins: readonly EnginePlugin[]): void {
    if (this.installed.size) throw new Error('Host must be empty before installing');
    const byId = new Map<string, EnginePlugin>();
    for (const plugin of plugins) {
      if (!/^[a-z][a-z0-9-]*$/.test(plugin.id) || byId.has(plugin.id)) throw new Error(`Invalid or duplicate plugin: ${plugin.id}`);
      byId.set(plugin.id, plugin);
    }
    const resolved: EnginePlugin[] = [];
    const state = new Map<string, 'visiting' | 'done'>();
    const visit = (id: string): void => {
      const plugin = byId.get(id);
      if (!plugin) throw new Error(`Missing plugin dependency: ${id}`);
      if (state.get(id) === 'visiting') throw new Error(`Plugin dependency cycle at ${id}`);
      if (state.get(id) === 'done') return;
      state.set(id, 'visiting');
      for (const dependency of plugin.requires ?? []) visit(dependency);
      state.set(id, 'done');
      resolved.push(plugin);
    };
    for (const id of byId.keys()) visit(id);
    try {
      for (const plugin of resolved) this.installed.set(plugin.id, plugin.setup(this.services) ?? (() => {}));
    } catch (error) {
      try { this.dispose(); } catch { /* original install failure is higher priority */ }
      throw error;
    }
  }
  get ids(): readonly string[] { return [...this.installed.keys()]; }
  dispose(): void {
    const failures: unknown[] = [];
    for (const [id, stop] of [...this.installed].reverse()) {
      try { stop(); } catch (error) { failures.push(error); }
      this.installed.delete(id);
    }
    if (failures.length) throw new AggregateError(failures, 'Plugin cleanup failed');
  }
}
