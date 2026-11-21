/** Pure simulation scheduling: never owns a renderer or browser timer. */
export interface LoopCallbacks {
  update(deltaSeconds: number, step: number): void;
  render(alpha: number): void;
}
export interface LoopOptions {
  stepMs?: number;
  maxFrameMs?: number;
  maxUpdatesPerFrame?: number;
}
export interface LoopStats {
  readonly updates: number;
  readonly droppedMs: number;
  readonly alpha: number;
}
export class FixedStepLoop {
  readonly stepMs: number;
  readonly maxFrameMs: number;
  readonly maxUpdatesPerFrame: number;
  private previousMs: number | null = null;
  private accumulatorMs = 0;
  private currentStep = 0;
  private paused = true;
  private busy = false;
  constructor(private readonly callbacks: LoopCallbacks, options: LoopOptions = {}) {
    this.stepMs = options.stepMs ?? 1000 / 60;
    this.maxFrameMs = options.maxFrameMs ?? 250;
    this.maxUpdatesPerFrame = options.maxUpdatesPerFrame ?? 8;
    if (![this.stepMs, this.maxFrameMs].every(v => Number.isFinite(v) && v > 0) ||
        !Number.isSafeInteger(this.maxUpdatesPerFrame) || this.maxUpdatesPerFrame < 1 ||
        this.maxFrameMs < this.stepMs) {
      throw new RangeError('Invalid fixed-step loop options');
    }
  }
  start(nowMs: number): void {
    this.requireTime(nowMs);
    this.currentStep = 0;
    this.accumulatorMs = 0;
    this.previousMs = nowMs;
    this.paused = false;
  }
  pause(): void { this.paused = true; this.previousMs = null; }
  resume(nowMs: number): void {
    this.requireTime(nowMs);
    if (!this.paused) return;
    this.paused = false;
    this.previousMs = nowMs; // do not simulate time spent in background
  }
  stop(): void { this.pause(); this.accumulatorMs = 0; }
  get step(): number { return this.currentStep; }
  get isPaused(): boolean { return this.paused; }
  advance(nowMs: number): LoopStats {
    this.requireTime(nowMs);
    if (this.paused) return { updates: 0, droppedMs: 0, alpha: this.accumulatorMs / this.stepMs };
    if (this.busy) throw new Error('Reentrant simulation frame');
    if (this.previousMs === null) { this.previousMs = nowMs; return { updates: 0, droppedMs: 0, alpha: 0 }; }
    if (nowMs < this.previousMs) throw new RangeError('Non-monotonic simulation clock');
    const elapsedMs = nowMs - this.previousMs;
    this.previousMs = nowMs;
    const admitted = Math.min(elapsedMs, this.maxFrameMs);
    let droppedMs = elapsedMs - admitted;
    this.accumulatorMs += admitted;
    let updates = 0;
    this.busy = true;
    try {
      while (this.accumulatorMs + 1e-8 >= this.stepMs && updates < this.maxUpdatesPerFrame) {
        this.callbacks.update(this.stepMs / 1000, ++this.currentStep);
        this.accumulatorMs -= this.stepMs;
        updates++;
      }
      if (updates === this.maxUpdatesPerFrame && this.accumulatorMs >= this.stepMs) {
        const excess = Math.floor(this.accumulatorMs / this.stepMs) * this.stepMs;
        this.accumulatorMs -= excess;
        droppedMs += excess;
      }
      const alpha = Math.min(1, Math.max(0, this.accumulatorMs / this.stepMs));
      this.callbacks.render(alpha);
      return { updates, droppedMs, alpha };
    } finally { this.busy = false; }
  }
  private requireTime(now: number): void {
    if (!Number.isFinite(now) || now < 0) throw new RangeError('Clock must be a finite nonnegative monotonic timestamp');
  }
}
