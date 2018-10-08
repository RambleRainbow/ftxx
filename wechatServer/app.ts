/// <refrence path="routes/router.d.ts" />

import * as createError from "http-errors";
import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as errorHandler from "errorHandler";
import * as methodOverride from "method-override";

import indexRouter from "./routes/index";
import tokenRouter from "./routes/token";
import userRouter from "./routes/user";
let app: express.Application = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("COOKIE_PARSER_SECRET"));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/tokens", tokenRouter);
app.use("/api/v1/users", userRouter);
// catch 404 and forward to error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  req = req;
  res = res;

  next(createError(404));
});

app.use(errorHandler());

export default app;