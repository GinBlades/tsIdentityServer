import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import User from "../models/User";
import { UserRepository } from "../repositories/userRepository";
const router = express.Router();

router.use(ensureLoggedIn("/sessions/login"));

router.get("/", async function (req, res) {
    const users = await User.find();
    res.render("users/index", {
        users: users
    });
});

router.get("/new", function (req, res) {
    res.render("users/new", {
        user: {}
    });
});

router.post("/", async function (req, res) {
    res.redirect("/users");
});

router.get("/:id", async function (req, res) {
    const user = await User.findById(req.params.id);
    res.render("users/show", {
        user: user
    });
});

router.post("/:id", async function (req, res) {
    const repo = new UserRepository();
    const updateObj = repo.updateObj(req);
    const result = await User.findByIdAndUpdate(req.params.id, updateObj);
    res.redirect(`/users/${req.params.id}`);
});

router.get("/:id/edit", async function (req, res) {
    const user = await User.findById(req.params.id);
    res.render("users/edit", {
        user: user
    });
});

router.post("/:id/delete", async function (req, res) {
    await User.findByIdAndRemove(req.params.id);
    res.redirect("/users");
});

export default router;
