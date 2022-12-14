import fs from "node:fs";
import path from "node:path";

const resolve = (p: string) => path.resolve(__dirname, p);
const isProd = process.env.NODE_ENV === "production";

export const render = async (page, req, res) => {
  const url = req.originalUrl;
  const viteServer = res.locals.viteServer;

  try {
    let template, render;
    if (!isProd) {
      // always read fresh template in dev
      template = fs.readFileSync(resolve("../../index.html"), "utf-8");
      template = await viteServer.transformIndexHtml(url, template);
      render = (await viteServer.ssrLoadModule("/src/lib/entry-server.tsx"))
        .render;
    } else {
      const indexProd = fs.readFileSync(
        resolve("../../dist/client/index.html"),
        "utf-8"
      );

      template = indexProd;
      render = (await import("../../dist/server/entry-server")).render;
    }

    const appHtml = render(page);
    const html = template
      .replace(`<!--app-html-->`, appHtml)
      .replace("PAGE", page);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e: any) {
    !isProd && viteServer.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
};
