import { OceanEngine, type OceanOptions, type SharkSpec } from "../src";

export interface Figure extends OceanOptions {
  sharks?: SharkSpec[];
  /** Ripples follow the cursor, so the wake field can be drawn on. */
  draw?: boolean;
  /** A drop lands somewhere every second or so, so the field is never blank. */
  drip?: boolean;
}

/** One engine per `<canvas data-fig>`; off-screen figures pause themselves. */
export function mountFigures(figures: Record<string, Figure>) {
  const engines: Record<string, OceanEngine> = {};
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>("canvas[data-fig]")) {
    const id = canvas.dataset.fig ?? "";
    const fig = figures[id];
    if (!fig) continue;
    const { sharks, draw, drip, ...options } = fig;
    const engine = new OceanEngine(canvas, sharks, options);
    engines[id] = engine;
    if (drip) {
      setInterval(() => {
        const r = canvas.getBoundingClientRect();
        engine.world.splash(r.width * (0.1 + 0.8 * Math.random()), r.height * (0.1 + 0.8 * Math.random()));
      }, 1400);
    }
    if (!draw) continue;
    let last = 0;
    canvas.addEventListener(
      "pointermove",
      (e) => {
        const now = performance.now();
        if (now - last < 90) return;
        last = now;
        const r = canvas.getBoundingClientRect();
        engine.world.splash(e.clientX - r.left, e.clientY - r.top);
      },
      { passive: true },
    );
  }
  return engines;
}

/** Smooth 0→1 between two times. */
export const ramp = (t: number, from: number, to: number) => {
  const k = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return k * k * (3 - 2 * k);
};

/** Call `fn` every frame with the time into a loop of `period` seconds. */
export function loop(period: number, fn: (t: number) => void) {
  const start = performance.now();
  const tick = () => {
    fn(((performance.now() - start) / 1000) % period);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
