import type { SharkKind, SharkSpec } from "../src";

/** ?sharks=thresher,hammerhead,mako,nurse — first is biggest, the rest step down. */
export function sharksFromQuery(): SharkSpec[] | undefined {
  const kinds = new URLSearchParams(location.search).get("sharks")?.split(",").filter(Boolean) as SharkKind[] | undefined;
  return kinds?.map((kind, i) => ({ kind, size: 1 - i * 0.1 }));
}

export const flag = (name: string) => new URLSearchParams(location.search).has(name);

/**
 * The haj chat's first screen: its roster was great hammerhead, hammerhead, tiger, zebra. Here the zebra
 * gives way to two hammerheads, two whale sharks join, and a thresher fills out the cast.
 * Sizes sit under the haj values so seven sharks fit where four did, and the chat pages keep them all in frame.
 */
export const HERO_SHARKS: SharkSpec[] = [
  { kind: "whale", size: 1.05 },
  { kind: "greathammer", size: 0.95 },
  { kind: "whale", size: 0.88 },
  { kind: "thresher", size: 0.85 },
  { kind: "hammerhead", size: 0.85 },
  { kind: "tiger", size: 0.78 },
  { kind: "hammerhead", size: 0.76 },
];

/** Every species once (?all), sized so the big ones read as nearer. */
export const ALL_SHARKS: SharkSpec[] = [
  { kind: "whale", size: 1.3 },
  { kind: "greathammer", size: 1.1 },
  { kind: "hammerhead", size: 1 },
  { kind: "tiger", size: 0.95 },
  { kind: "thresher", size: 0.9 },
  { kind: "classic", size: 0.85 },
  { kind: "mako", size: 0.8 },
  { kind: "nurse", size: 0.75 },
  { kind: "zebra", size: 0.7 },
];
