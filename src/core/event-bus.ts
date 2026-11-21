export type Unsubscribe = () => void;
/** Typed, synchronous dispatch with copy-on-emit listener semantics. */
export class EventBus<Events extends object> {
  private readonly handlers = new Map<keyof Events, Set<(payload: never) => void>>();
  on<K extends keyof Events>(name: K, handler: (payload: Events[K]) => void): Unsubscribe {
    let set = this.handlers.get(name);
    if (!set) { set = new Set(); this.handlers.set(name, set); }
    const stored = handler as (payload: never) => void;
    set.add(stored);
    return () => { set?.delete(stored); if (set?.size === 0) this.handlers.delete(name); };
  }
  emit<K extends keyof Events>(name: K, payload: Events[K]): void {
    for (const fn of [...(this.handlers.get(name) ?? [])]) fn(payload as never);
  }
  clear(): void { this.handlers.clear(); }
}
