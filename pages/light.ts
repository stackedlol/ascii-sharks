import { OceanEngine } from "../src";
import { ALL_SHARKS, flag, HERO_SHARKS, sharksFromQuery } from "./query";

// The haj chat's first screen, on paper: fish, the cursor as a predator, and
// the sharks keeping a soft pool clear in the middle. ?all puts every species in; ?still=1 draws one frame.
new OceanEngine(document.querySelector("canvas")!, sharksFromQuery() ?? (flag("all") ? ALL_SHARKS : HERO_SHARKS), {
  theme: "light",
  contain: true,
  still: flag("still"),
});
