import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IUserDocument } from "../models/User";

const strategy = new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, done) => {
    const user = await User.findOne({ username: username });

    const genericFailureMessage = "Incorrect username or password";
    if (null == user) {
        return done(null, false, { message: genericFailureMessage });
    }

    if (!user.comparePassword(password)) {
        return done(null, false, { message: genericFailureMessage });
    }

    return done(null, user);
});

const serializeUser = (user: IUserDocument, done: Function) => {
    done(null, user._id);
};

const deserializeUser = async (id: string, done: Function) => {
    const user = await User.findById(id);
    done(null, user);
};

export const config = (passportInstance: PassportStatic) => {
    passportInstance.use(strategy);
    passportInstance.serializeUser(serializeUser);
    passportInstance.deserializeUser(deserializeUser);
}

export const localAuth = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
});
