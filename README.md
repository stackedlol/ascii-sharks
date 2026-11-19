# ascii sharks

```
                            ;'
                             %%'
                              .t;.               .oooo
                               S;:S%              %8S8.
                                ;:tt%t '..        XX%%S
t'                            ''XSSS8SSX%XX8#.    %XSX%
 :;'               ;.''X8%8XX%%S%%S%SStt%tSX8S#X8't%ttt.
  ::%'       ''8XXXSSt%Stttttt%8@%%@%8@8%Sttt%%%%SSSSS%tt.
  'SXXtt%t%%%S%:;StS%ttSS%tSXSt88@@%8%@8%tStS%%X%SS%%S%;;t
 .@##88#@...'@@@@#@8@88X88#XXXSX8SX88SX8%SS%S%%S88St%t%%%.
  %;%t             :.    '.'##@###@X#888XX##8@@@#.X%XS%.
 .%t                            ;%%%#@@##@@@.     SXS%%
 t.                            .%;%%%.            %%XXS
                              '%t:t              .SXSS'
                             '::.                ooooo
                            .S'
                            .
```

Fish and sharks drawn as ASCII on a canvas. Zero dependencies.

```sh
npm install && npm run dev
```

```ts
import { OceanEngine } from "./src";

const engine = new OceanEngine(canvas, [{ kind: "hammerhead", size: 1 }]);

// Options: fish count (0 = sharks only), "dark" | "light" theme, a drawing stage
// ("spine" | "silhouette" | "shaded" | "full"), pointer on/off, a single still frame,
// and contain: true to keep every shark wholly inside the canvas.
new OceanEngine(canvas, undefined, { theme: "light", fish: 0, pointer: false, still: true });
```

Routes:

```
/            the demo
/light       the chat hero scene, on paper
/dark        the chat hero scene, on black
/blueprints  ten frames on one grid, from Conway's Life to the sharks
```

`?sharks=whale,hammerhead,mako,nurse` picks the cast on any shark page, `?all` puts every species in, and `?still=1` draws one settled frame.

MIT
