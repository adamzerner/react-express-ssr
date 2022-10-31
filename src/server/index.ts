// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import fs from "node:fs";
import path from "node:path";
import express from "express";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export const createServer = async (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort?: any
) => {
  const resolve = (p: string) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const app = express();
  let viteServer;

  if (!isProd) {
    const vite = await import("vite");

    viteServer = await vite.createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    app.use(viteServer.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve("../index.html"), "utf-8");
        template = await viteServer.transformIndexHtml(url, template);
        render = (await viteServer.ssrLoadModule("/src/entry-server.tsx"))
          .render;
      } else {
        template = indexProd;
        // @ts-expect-error The file will exist after running `npm run build`.
        render = (await import("./dist/server/entry-server")).render;
      }

      const context = {};
      const appHtml = render(url, context);

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      !isProd && viteServer.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, viteServer };
};

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log(`> Ready on http://localhost:5173`);
    })
  );
}
