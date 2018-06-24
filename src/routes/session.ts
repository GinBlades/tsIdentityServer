import express from "express";
import { localAuth } from "../utils/auth";
import User from "../models/User";
import { UserRepository } from "../repositories/userRepository";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("session/login");
});

router.post("/login", localAuth, (req, res) => {
    res.redirect("/");
});

router.get("/register", (req, res) => {
    res.render("session/register", {
        errors: [],
        user: {}
    });
});

router.post("/register", async (req, res) => {
    const repo = new UserRepository();

    let user = repo.fromRequest(req);
    const repoResult = await repo.create(user, req.body.passwordConfirmation);

    if (null == repoResult.error) {
        return res.redirect("/");
    } else {
        return res.render("session/register", {
            errors: [repoResult.error],
            user: req.body
        });
    }
});

router.post("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export default router;
