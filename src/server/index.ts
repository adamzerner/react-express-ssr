// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import express from "express";
import setup from "../lib/setup";
import router from "./router";
import { isTestEnv } from "../lib/is-test-env";

const createServer = async () => {
  const app = express();

  await setup(app);

  app.use(router);
  app.listen(5173, () => {
    console.log(`> Ready on http://localhost:5173`);
  });
};

if (!isTestEnv) {
  createServer();
}
