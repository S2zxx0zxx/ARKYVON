export interface Scene {
  enter(): void;
  exit(): void;
  update(deltaSeconds: number): void;
}
/** Synchronous scene transitions. On failed entry, the previous scene is restored. */
export class SceneController {
  private active: { name: string; instance: Scene } | null = null;
  private transitioning = false;
  constructor(private readonly factories: Readonly<Record<string, () => Scene>>) {}
  get current(): string | null { return this.active?.name ?? null; }
  switchTo(name: string): void {
    if (this.transitioning) throw new Error('Reentrant scene transition');
    const factory = Object.hasOwn(this.factories, name) ? this.factories[name] : undefined;
    if (!factory) throw new Error(`Unknown scene: ${name}`);
    if (this.active?.name === name) return;
    this.transitioning = true;
    const previous = this.active;
    try {
      const next = factory(); // create before tearing down current scene
      previous?.instance.exit();
      this.active = null;
      try { next.enter(); this.active = { name, instance: next }; }
      catch (e) {
        try { next.exit(); } catch { /* best-effort cleanup */ }
        if (previous) {
          try { previous.instance.enter(); this.active = previous; }
          catch { this.active = null; }
        }
        throw e;
      }
    } finally { this.transitioning = false; }
  }
  update(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) throw new RangeError('Invalid delta');
    this.active?.instance.update(deltaSeconds);
  }
  stop(): void { const prior = this.active; this.active = null; prior?.instance.exit(); }
}
