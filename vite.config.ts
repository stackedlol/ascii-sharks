import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const PAGES = ["light", "dark", "blueprints"];
/** Old routes that now live on another page. */
const ALIASES: Record<string, string> = { concepts: "blueprints" };
const root = fileURLToPath(new URL(".", import.meta.url));

/** Serve /light as /light.html in dev and preview, so the routes read like routes. */
function cleanUrls(): Plugin {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void) => {
    const url = req.url ?? "";
    const path = url.split("?")[0];
    const name = ALIASES[path.slice(1)] ?? path.slice(1);
    if (PAGES.includes(name)) req.url = `/${name}.html${url.slice(path.length)}`;
    next();
  };
  return {
    name: "clean-urls",
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
}

export default defineConfig({
  plugins: [cleanUrls()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(["index", ...PAGES].map((p) => [p, `${root}${p}.html`])),
    },
  },
});
