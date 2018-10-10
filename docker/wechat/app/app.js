"use strict";
/// <refrence path="routes/router.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const index_1 = require("./routes/index");
const token_1 = require("./routes/token");
const user_1 = require("./routes/user");
let app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("COOKIE_PARSER_SECRET"));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/api/v1/tokens", token_1.default);
app.use("/api/v1/users", user_1.default);
// catch 404 and forward to error handler
app.use((err, req, res, next) => {
    req = req;
    res = res;
    next(createError(404));
});
app.use(errorHandler());
exports.default = app;
