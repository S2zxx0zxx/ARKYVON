import { SeededRandom } from '../core/seeded-random.js';
export type BubbleColor = 0 | 1 | 2 | 3;
export interface SwapOutcome { readonly accepted: boolean; readonly removed: number; readonly score: number; }
/** Small fully testable MATCH-3 reference model; not a full commercial Bubble game. */
export class MatchGrid {
  readonly width: number;
  readonly height: number;
  readonly cells: BubbleColor[];
  score = 0;
  constructor(width: number, height: number, private readonly rng: SeededRandom, cells?: readonly BubbleColor[]) {
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 3 || height < 3 || width * height > 4096) throw new RangeError('Invalid grid size');
    this.width = width; this.height = height;
    if (cells && (cells.length !== width * height || cells.some(c => !Number.isInteger(c) || c < 0 || c > 3))) throw new Error('Invalid grid cells');
    this.cells = cells ? [...cells] : Array.from({ length: width * height }, () => this.rng.int(0, 4) as BubbleColor);
  }
  swap(a: number, b: number): SwapOutcome {
    const legal = (n: number) => Number.isSafeInteger(n) && n >= 0 && n < this.cells.length;
    if (!legal(a) || !legal(b) || a === b ||
        Math.abs(Math.floor(a / this.width) - Math.floor(b / this.width)) + Math.abs(a % this.width - b % this.width) !== 1)
      return { accepted: false, removed: 0, score: this.score };
    this.exchange(a, b);
    let matches = this.findMatches();
    if (!matches.size) { this.exchange(a, b); return { accepted: false, removed: 0, score: this.score }; }
    let total = 0; let cascades = 0;
    while (matches.size && cascades++ < 64) {
      total += matches.size;
      this.score += matches.size * cascades * 10;
      for (let col = 0; col < this.width; col++) {
        const keep: BubbleColor[] = [];
        for (let row = this.height - 1; row >= 0; row--) {
          const pos = row * this.width + col;
          if (!matches.has(pos)) keep.push(this.cells[pos]!);
        }
        while (keep.length < this.height) keep.push(this.rng.int(0, 4) as BubbleColor);
        for (let row = this.height - 1; row >= 0; row--) this.cells[row * this.width + col] = keep[this.height - 1 - row]!;
      }
      matches = this.findMatches();
    }
    return { accepted: true, removed: total, score: this.score };
  }
  private exchange(a: number, b: number): void { const x = this.cells[a]!; this.cells[a] = this.cells[b]!; this.cells[b] = x; }
  private findMatches(): Set<number> {
    const found = new Set<number>();
    const scan = (offset: number, length: number, increment: number) => {
      for (let i = 0; i < length;) {
        let j = i + 1;
        while (j < length && this.cells[offset + j * increment] === this.cells[offset + i * increment]) j++;
        if (j - i >= 3) for (let k = i; k < j; k++) found.add(offset + k * increment);
        i = j;
      }
    };
    for (let row = 0; row < this.height; row++) scan(row * this.width, this.width, 1);
    for (let col = 0; col < this.width; col++) scan(col, this.height, this.width);
    return found;
  }
}
