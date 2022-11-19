// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import fs from "node:fs";
import path from "node:path";
import express from "express";
import setup from "./setup";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export const createServer = async () => {
  const root = process.cwd();
  const isProd = process.env.NODE_ENV === "production";
  const resolve = (p: string) => path.resolve(__dirname, p);
  const app = express();
  const viteServer = await setup(app, root, isProd, isTest);

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
        const indexProd = isProd
          ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
          : "";

        template = indexProd;
        // @ts-expect-error The file will exist after running `npm run build`.
        render = (await import("./dist/server/entry-server")).render;
      }

      const appHtml = render("home");
      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      !isProd && viteServer.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return app;
};

if (!isTest) {
  createServer().then((app) =>
    app.listen(5173, () => {
      console.log(`> Ready on http://localhost:5173`);
    })
  );
}
