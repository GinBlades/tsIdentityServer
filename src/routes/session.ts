import express from "express";
import { localAuth } from "../utils/auth";
import User, { IUserDocument } from "../models/User";
import { UserRepository } from "../repositories/userRepository";
import App from "../models/App";

const router = express.Router();

async function remoteLogin(code: string, user: IUserDocument) {
    const app = await App.find({"tokens.code": code});
    const token = App.keygen();
    await User.findByIdAndUpdate(user._id, {
        $push: {
            tokens: {
                issued: new Date().getTime(),
                used: false,
                code: token
            }
        }
    });
    return token;
}

router.get("/login", async (req, res) => {
    if (req.query.code && req.isAuthenticated) {
        // TODO: Confirm redirect is valid.
        const token = await remoteLogin(req.query.code, <IUserDocument>req.user);
        return res.redirect(`${req.query.return_to}/sessions/auth?token=${token}`);
    }
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
