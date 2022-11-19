// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import express from "express";
import setup from "./setup";
import router from "./router";
import { isTestEnv } from "../utils/is-test-env";

const createServer = async () => {
  const app = express();
  const viteServer = await setup(app);

  app.use((_, res, next) => {
    res.locals = {
      viteServer,
    };
    next();
  });
  app.use(router);
  app.listen(5173, () => {
    console.log(`> Ready on http://localhost:5173`);
  });

  return app;
};

if (!isTestEnv) {
  createServer();
}
