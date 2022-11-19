// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import express from "express";
import setup from "./setup";
import { render } from "./render";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export const createServer = async () => {
  const root = process.cwd();
  const isProd = process.env.NODE_ENV === "production";
  const app = express();
  const viteServer = await setup(app, root, isProd, isTest);

  app.use("*", async (req, res) => {
    render("home", req, res, viteServer);
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
