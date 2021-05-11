import express from "express";
import 'express-async-errors';
import { default as createError } from "http-errors"

import path from "path";
import cookieParser from "cookie-parser"
import { default as logger } from "morgan"
import d from 'debug'
const debug: d.Debugger = d.debug('simple-bbs:server:params')

import { default as indexRouter } from "./routes/index"
import { default as usersRouter } from "./routes/users"

interface HttpException extends Error {
  status: number
}

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./public")));

app.use((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  debug(`${req.method} ${req.path}`);
  if (debug.enabled) {
    debug(`req.params: %o`, req.params);
    debug(`req.body: %o`, req.body);
    debug(`req.query: %o`, req.query);
  }
  next()
})

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpException,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export = app;
