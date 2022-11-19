// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import express from "express";
import setup from "./setup";
import { render } from "./render";
import { isTestEnv } from "../utils/is-test-env";

const createServer = async () => {
  const app = express();
  const viteServer = await setup(app);

  app.get("/", async (req, res) => {
    render("home", req, res, viteServer);
  });
  app.get("/about", async (req, res) => {
    render("about", req, res, viteServer);
  });
  app.use("*", async (req, res) => {
    render("notFound", req, res, viteServer);
  });
  app.listen(5173, () => {
    console.log(`> Ready on http://localhost:5173`);
  });
};

if (!isTestEnv) {
  createServer();
}
