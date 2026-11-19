import { flipH, flipV, GLIDER, LWSS, type Life, type SharkKind } from "../src";
import { loop, mountFigures, ramp, type Figure } from "./figures";
import { flag } from "./query";

const still = flag("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Gliders from the corners, a spaceship each way, and a soup in the middle that settles to ash. */
const seed = (life: Life) => {
  const { cols, rows } = life;
  life.put(GLIDER, 2, 2);
  life.put(flipH(GLIDER), cols - 6, Math.floor(rows * 0.15));
  life.put(flipV(GLIDER), Math.floor(cols * 0.2), rows - 6);
  life.put(flipH(flipV(GLIDER)), cols - 10, rows - 8);
  life.put(LWSS, cols - 8, Math.floor(rows * 0.5));
  life.put(flipH(LWSS), 2, Math.floor(rows * 0.72));
  life.soup(cols * 0.36, rows * 0.3, cols * 0.64, rows * 0.7, 0.32);
};

const KINDS: SharkKind[] = ["classic", "hammerhead", "greathammer", "tiger", "zebra", "mako", "thresher", "nurse", "whale"];

const shark = (extra: Partial<Figure> = {}): Figure => ({
  sharks: [{ kind: "classic", size: 1.4 }],
  fish: 0,
  pointer: false,
  clearCentre: false,
  still,
  ...extra,
});

const engines = mountFigures({
  life: { sharks: [], fish: 0, pointer: false, still, life: seed },
  field: { sharks: [], fish: 0, draw: true, drip: true, still },
  agents: { sharks: [], still },
  spine: shark({ stage: "spine" }),
  silhouette: shark({ stage: "silhouette" }),
  shaded: shark({ stage: "shaded" }),
  glyphs: shark(),
  ...Object.fromEntries(KINDS.map((kind) => [`species-${kind}`, shark({ sharks: [{ kind, size: 1.25 }] })])),
  hunger: { sharks: [{ kind: "classic", size: 1.1 }, { kind: "hammerhead", size: 0.9 }], clearCentre: false, still },
  bleed: shark({
    sharks: [
      { kind: "classic", size: 1.1 },
      { kind: "hammerhead", size: 0.9 },
    ],
    life: seed,
  }),
});

if (!still) {
  // Fig. 01: Life alone. Gliders leave, the soup settles, then the board fades and starts again.
  {
    const { renderer } = engines.life;
    const life = renderer.life!;
    let reseeded = true;
    loop(30, (t) => {
      renderer.lifeOpacity = t < 27 ? ramp(t, 0, 1.5) : 1 - ramp(t, 27, 29.5);
      if (t < 27) reseeded = false;
      else if (t >= 29.5 && !reseeded) {
        life.reset();
        reseeded = true;
      }
    });
  }

  // Fig. 10: Life first, then the sharks bleed in.
  //   0–12s  Life alone.  12–16s  sharks fade in, the wake starts seeding cells.
  //  16–30s  sharks hunt through the ash; seeding stops at 24s.  30–36s  fade, reseed, again.
  {
    const { renderer } = engines.bleed;
    const life = renderer.life!;
    const tag = document.querySelector<HTMLElement>('[data-tag="bleed"]')!;
    let phase = "";
    const show = (label: string) => {
      if (label === phase) return;
      phase = label;
      tag.textContent = label;
    };
    renderer.sharkOpacity = 0;
    let reseeded = true;
    loop(36, (t) => {
      if (t < 12) {
        renderer.sharkOpacity = 0;
        renderer.lifeOpacity = ramp(t, 0, 1.5);
        life.sowing = false;
        show("Fig. 10 · Life · B3/S23");
      } else if (t < 30) {
        renderer.sharkOpacity = ramp(t, 12, 15);
        renderer.lifeOpacity = 1;
        life.sowing = t < 24;
        show(t < 20 ? "Fig. 10 · Bleed · wake seeds cells" : "Fig. 10 · Sharks · bodies clear cells");
        reseeded = false;
      } else {
        renderer.sharkOpacity = 1 - ramp(t, 30, 33);
        renderer.lifeOpacity = 1 - ramp(t, 32, 35);
        life.sowing = false;
        if (t >= 35 && !reseeded) {
          life.reset();
          reseeded = true;
        }
      }
    });
  }
}
