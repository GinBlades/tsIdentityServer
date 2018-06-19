import express from "express";
import { localAuth } from "../utils/auth";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("session/login");
});

router.post("/login", localAuth, (req, res) => {
    res.redirect("/");
});

router.get("/register", (req, res) => {
    res.render("session/register");
});

router.post("/register", (req, res) => {
    res.redirect("/");
});

router.post("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export default router;
