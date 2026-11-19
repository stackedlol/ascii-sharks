/**
 * Conway's Game of Life on the renderer's cell grid: B3/S23 with dead
 * borders, so gliders leave the frame and are gone. Cells remember their
 * age, so still lifes can be drawn as ash while movers stay bright.
 *
 * Two bridges to the rest of the sim: cells under a shark die, and when
 * `sowing` is on, cells are born where the wake field runs hot. The
 * continuous automaton feeds the discrete one.
 */
export type Pattern = string[];

/** The glider, travelling down and to the right. */
export const GLIDER: Pattern = [".O.", "..O", "OOO"];
/** Lightweight spaceship, travelling left. */
export const LWSS: Pattern = [".O..O", "O....", "O...O", "OOOO."];

export const flipH = (p: Pattern): Pattern => p.map((row) => [...row].reverse().join(""));
export const flipV = (p: Pattern): Pattern => [...p].reverse();

export class Life {
  cols = 0;
  rows = 0;
  cells = new Uint8Array(0);
  /** Generations alive, capped at 255. */
  age = new Uint8Array(0);
  private next = new Uint8Array(0);
  /** Generations per second. */
  rate = 12;
  /** Birth cells where the wake field is above `sowAbove`. */
  sowing = false;
  sowAbove = 0.6;
  sowChance = 0.05;
  generation = 0;
  private acc = 0;

  private seed: (life: Life) => void;

  constructor(seed: (life: Life) => void = () => {}) {
    this.seed = seed;
  }

  resize(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Uint8Array(cols * rows);
    this.age = new Uint8Array(cols * rows);
    this.next = new Uint8Array(cols * rows);
    this.reset();
  }

  reset() {
    this.cells.fill(0);
    this.age.fill(0);
    this.generation = 0;
    this.acc = 0;
    this.seed(this);
  }

  set(c: number, r: number) {
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return;
    this.cells[r * this.cols + c] = 1;
    this.age[r * this.cols + c] = 0;
  }

  put(pattern: Pattern, col: number, row: number) {
    for (let r = 0; r < pattern.length; r++) {
      for (let c = 0; c < pattern[r].length; c++) {
        if (pattern[r][c] === "O") this.set(col + c, row + r);
      }
    }
  }

  /** Random cells in a box; `density` is the fraction alive. */
  soup(c0: number, r0: number, c1: number, r1: number, density: number) {
    for (let r = Math.floor(r0); r < r1; r++) {
      for (let c = Math.floor(c0); c < c1; c++) {
        if (Math.random() < density) this.set(c, r);
      }
    }
  }

  population() {
    let n = 0;
    for (let i = 0; i < this.cells.length; i++) n += this.cells[i];
    return n;
  }

  /** Advance by wall time. `occupied` marks cells under sharks; `field` is the wake. */
  step(dt: number, occupied: Uint8Array | null, field: Float32Array | null) {
    this.acc += dt;
    const period = 1 / this.rate;
    if (this.acc < period) return;
    this.acc = Math.min(this.acc - period, period);

    const { cols, rows, cells, next, age } = this;
    for (let r = 0; r < rows; r++) {
      const up = r > 0;
      const down = r < rows - 1;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const left = c > 0;
        const right = c < cols - 1;
        let n = 0;
        if (up) {
          n += cells[i - cols];
          if (left) n += cells[i - cols - 1];
          if (right) n += cells[i - cols + 1];
        }
        if (left) n += cells[i - 1];
        if (right) n += cells[i + 1];
        if (down) {
          n += cells[i + cols];
          if (left) n += cells[i + cols - 1];
          if (right) n += cells[i + cols + 1];
        }
        next[i] = n === 3 || (n === 2 && cells[i] === 1) ? 1 : 0;
      }
    }
    if (occupied) {
      for (let i = 0; i < next.length; i++) if (occupied[i]) next[i] = 0;
    }
    if (this.sowing && field) {
      for (let i = 0; i < next.length; i++) {
        if (!next[i] && field[i] > this.sowAbove && !(occupied && occupied[i]) && Math.random() < this.sowChance) {
          next[i] = 1;
          cells[i] = 0; // counts as a birth
        }
      }
    }
    for (let i = 0; i < next.length; i++) age[i] = next[i] ? (cells[i] ? Math.min(255, age[i] + 1) : 0) : 0;
    this.cells = next;
    this.next = cells;
    this.generation++;
  }
}
