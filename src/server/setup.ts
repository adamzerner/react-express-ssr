import path from "node:path";
import { Express } from "express";

export default async (
  app: Express,
  root: string,
  isProd: boolean,
  isTest: boolean,
  hmrPort: number | undefined
) => {
  const resolve = (p: string) => path.resolve(__dirname, p);
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

  return viteServer;
};
