import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import App from "../models/App";
const router = express.Router();

router.use(ensureLoggedIn("/sessions/login"));

router.get("/", async function(req, res) {
  const apps = await App.find();
  res.render("apps/index", {
    apps: apps
  });
});

router.get("/new", function(req, res) {
  res.render("apps/new", {
    app: {}
  });
});

router.post("/", async function(req, res) {
  let app = new App();
  app.name = req.body.name;
  app.key = App.keygen();
  await app.save();

  res.redirect("/apps");
});

router.get("/:id", async function(req, res) {
  const app = await App.findById(req.params.id);
  res.render("apps/show", {
    app: app
  });
});

router.post("/:id", async function(req, res) {
  await App.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });
  res.redirect(`/apps/${req.params.id}`);
});

router.get("/:id/edit", async function(req, res) {
  const app = await App.findById(req.params.id);
  res.render("apps/edit", {
    app: app
  });
});

router.post("/:id/delete", async function(req, res) {
  await App.findByIdAndRemove(req.params.id);
  res.redirect("/apps");
});

router.post("/:id/path", async function(req, res) {
  const app = await App.findByIdAndUpdate(req.params.id, {
    $push: {
      paths: req.body.path
    }
  });
  res.redirect(`/apps/${req.params.id}`);
});

router.post("/:id/remove-path", async function(req, res) {
  const app = await App.findByIdAndUpdate(req.params.id, {
    $pull: {
      paths: req.body.path
    }
  });
  res.redirect(`/apps/${req.params.id}`);

})

export default router;
