import express from "express";
import { render } from "../render";

const router = express.Router();

router.get("/", async (req, res) => {
  render("home", req, res);
});
router.get("/about", async (req, res) => {
  render("about", req, res);
});
router.use("*", async (req, res) => {
  render("notFound", req, res);
});

export default router;
