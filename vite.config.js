import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Static multi-page build: every top-level .html file is its own entry point,
// each mounting its own React root (see src/entries/*.jsx). `npm run build`
// still produces plain static HTML/CSS/JS in dist/ — React is bundled and
// hydrated client-side, but there's no Node server involved at runtime.
//
// Three.js is *not* in any of these entry bundles. It sits behind the dynamic
// import in src/scenes/Scene.jsx, so Rollup emits it as its own async chunk
// that the browser only fetches when a 3D accent actually approaches the
// viewport. Deliberately no manual chunking on top of that: Rollup's automatic
// splitting already isolates it correctly, and hand-written manualChunks is an
// easy way to accidentally make an async chunk eager again.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "es2020",
    // Saves a gzip pass over every asset on each CI build; the sizes are
    // reported by the host anyway.
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        subscriptions: resolve(__dirname, "subscriptions.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
  esbuild: {
    legalComments: "none",
  },
});
