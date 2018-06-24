import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware";
import session from "express-session";
import connectRedis from "connect-redis";
import mongoose from "mongoose";
import passport from "passport";
import connectFlash from "connect-flash";

import secrets from "./utils/secretLoader";
import {config as authConfig} from "./utils/auth";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import appsRouter from "./routes/apps";
import sessionRouter from "./routes/session";

mongoose.connect(secrets.mongoConn);

const app = express();
authConfig(passport);

const RedisStore = connectRedis(session);

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.use(cors({
  origin: secrets.approvedOrigins
}));
app.use(logger(secrets.logLevel));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secrets.cookieSecret, {}));
app.use(session({
  store: new RedisStore({
    url: secrets.redisConn
  }),
  resave: false,
  saveUninitialized: false,
  secret: secrets.sessionSecret
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
  src: path.join(__dirname, "..", "public"),
  dest: path.join(__dirname, "..", "public"),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flash = req.flash();
  res.locals.hasFlash = Object.keys(res.locals.flash).length > 0;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/apps", appsRouter);
app.use("/sessions", sessionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
