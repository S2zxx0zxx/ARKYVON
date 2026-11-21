/** Immutable command snapshots; no device- or renderer-dependent state. */
export interface StepCommand<T> { readonly step: number; readonly command: T; }
export class CommandLog<T> {
  private readonly entries: StepCommand<T>[] = [];
  append(step: number, command: T): void {
    if (!Number.isSafeInteger(step) || step < 0 || step < (this.entries.at(-1)?.step ?? 0))
      throw new RangeError('Commands must have nondecreasing nonnegative steps');
    this.entries.push({ step, command: structuredClone(command) });
  }
  snapshot(): readonly StepCommand<T>[] { return structuredClone(this.entries); }
  replay(apply: (item: StepCommand<T>) => void): void { for (const item of this.snapshot()) apply(item); }
  clear(): void { this.entries.length = 0; }
}
