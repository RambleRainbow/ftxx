"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jwt = require("jsonwebtoken");
const WxService = require("../services/wxService");
const UserModel = require("../models/users");
const debugModal = require("debug");
const config = require("config");
let debug = debugModal("ts-express:route:token");
let router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("test");
});
router.put("/:code", function (req, res, next) {
    (() => __awaiter(this, void 0, void 0, function* () {
        let session = yield WxService.code2Session(req.params.code);
        let userInfo = yield WxService.decryptUserInfo(session, req.body);
        if (userInfo === null) {
            debug(`数据解析失败`);
            res.statusCode = 400;
            res.json({
                errmsg: "数据解析失败，非法用户数据"
            });
            return;
        }
        let user = yield UserModel.query(userInfo.openId);
        if (user === null) {
            debug(`do not find user. create new user!`);
            user = yield UserModel.create(userInfo);
        }
        if (user === null) {
            debug("user create failed");
            res.statusCode = 400;
            res.json({
                errmsg: "用户创建失败"
            });
        }
        else {
            debug("user create success. send user token");
            res.statusCode = 201;
            res.json({
                access_token: jwt.sign({ userId: user.userId }, config.get("JWT").secret)
            });
        }
    }))();
});
exports.default = router;
