import express from "express";
import { localAuth } from "../utils/auth";
import User from "../models/User";

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
    let errors = [];
    console.log(req.body);

    for (let reqField of ["email", "username", "password"]) {
        if (null == req.body[reqField] || req.body[reqField].length === 0) {
            errors.push([reqField, `${reqField} cannot be blank.`]);
        }
    }

    if (null == errors.find(err => err[0] === "username")) {
        const usernameMatch = await User.count({ username: req.body.username });
        if (usernameMatch > 0) {
            errors.push(["username", "Username is not available."]);
        }
    }

    if (null == errors.find(err => err[0] === "email")) {
        const emailMatch = await User.count({ email: req.body.email });
        if (emailMatch > 0) {
            errors.push(["email", "Email already registered."]);
        }

        const emailPattern = new RegExp("@\\w+\\.");
        if (!emailPattern.test(req.body.email)) {
            errors.push(["email", "Invalid email format."]);
        }
    }

    if (null == errors.find(err => err[0] === "password")) {
        if (req.body.password !== req.body.passwordConfirmation) {
            errors.push(["password", "Passwords must match"]);
        }

        if (req.body.password.length < 8) {
            errors.push(["password", "Password must be at least 8 characters"]);
        }
    }

    if (errors.length > 0) {
        return res.render("session/register", {
            errors: errors,
            user: req.body
        });
    }

    let user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = await User.hashPassword(req.body.password);
    await user.save();

    res.redirect("/");
});

router.post("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export default router;
