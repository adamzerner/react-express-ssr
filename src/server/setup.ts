import path from "node:path";
import { Express } from "express";
import { isTestEnv } from "../utils/is-test-env";

export default async (app: Express) => {
  const root = process.cwd();
  const isProdEnv = process.env.NODE_ENV === "production";
  const resolve = (p: string) => path.resolve(__dirname, p);
  let viteServer;

  if (!isProdEnv) {
    const vite = await import("vite");
    viteServer = await vite.createServer({
      root,
      logLevel: isTestEnv ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: undefined,
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
