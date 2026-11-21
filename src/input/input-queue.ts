export interface InputAction { readonly step: number; readonly action: string; readonly value?: number | boolean | string; }
export class InputQueue {
  private readonly buffer: InputAction[] = [];
  enqueue(input: InputAction): void {
    if (!Number.isSafeInteger(input.step) || input.step < 0 ||
        !/^[a-z][a-z0-9._-]*$/.test(input.action) ||
        (typeof input.value === 'number' && !Number.isFinite(input.value))) throw new Error('Invalid input action');
    this.buffer.push({ ...input });
  }
  drainThrough(step: number): InputAction[] {
    if (!Number.isSafeInteger(step) || step < 0) throw new RangeError('Invalid step');
    const ready: InputAction[] = []; const remaining: InputAction[] = [];
    for (const input of this.buffer) (input.step <= step ? ready : remaining).push(input);
    this.buffer.length = 0; this.buffer.push(...remaining);
    return ready;
  }
  clear(): void { this.buffer.length = 0; }
}
