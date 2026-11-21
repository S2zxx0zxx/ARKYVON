/** Small seeded generator for reproducible gameplay fixtures, NOT cryptographic security. */
export class SeededRandom {
  private state = 0;
  constructor(seed: number) { this.restore(seed); }
  restore(seed: number): void {
    if (!Number.isSafeInteger(seed)) throw new RangeError('Seed must be a safe integer');
    this.state = (seed >>> 0) || 0x6d2b79f5;
  }
  snapshot(): number { return this.state >>> 0; }
  uint32(): number {
    let x = this.state;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  }
  float(): number { return this.uint32() / 0x1_0000_0000; }
  int(min: number, maxExclusive: number): number {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(maxExclusive) || maxExclusive <= min ||
        maxExclusive - min > 0x1_0000_0000) throw new RangeError('Invalid random bounds');
    const range = maxExclusive - min;
    const limit = Math.floor(0x1_0000_0000 / range) * range;
    let value: number;
    do { value = this.uint32(); } while (value >= limit);
    return min + value % range;
  }
}
