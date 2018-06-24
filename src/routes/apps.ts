import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
const router = express.Router();

router.use(ensureLoggedIn("/sessions/login"));

router.get("/", async function(req, res) {
  res.render("apps/index");
});

router.get("/new", function(req, res) {
  res.render("apps/new");
});

router.post("/", async function(req, res) {
  res.redirect("/apps");
});

router.get("/:id", async function(req, res) {
  res.render("apps/show");
});

router.post("/:id", async function(req, res) {
  res.redirect(`/apps/${req.params.id}`);
});

router.get("/:id/edit", async function(req, res) {
  res.render("apps/edit");
});

router.post("/:id/delete", async function(req, res) {
  res.redirect("/apps");
});

export default router;
