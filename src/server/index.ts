// Based on https://github.com/vitejs/vite/blob/main/playground/ssr-react/server.js

import express from "express";
import setup from "./setup";
import { render } from "./render";
import { isTestEnv } from "../utils/is-test-env";

const createServer = async () => {
  const app = express();
  const viteServer = await setup(app);

  app.engine("tsx", async (filePath, options, callback) => {
    const [html, error] = await render(filePath, viteServer);
    if (error) return callback(error);
    return callback(null, html);
  });
  app.set("views", "./src/pages"); // specify the views directory
  app.set("view engine", "tsx"); // register the template engine
  app.use("*", async (req, res) => {
    res.render("home");
  });
  app.listen(5173, () => {
    console.log(`> Ready on http://localhost:5173`);
  });
};

if (!isTestEnv) {
  createServer();
}
