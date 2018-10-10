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
const WxService = require("../services/wxService");
const dbg = require("debug");
let router = express.Router();
let debug = dbg("ts:route:user");
/* GET home page. */
router.put("/", function (req, res, next) {
    let params = req.body;
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            let session = yield WxService.code2Session(params.loginCode);
            if (session.errcode) {
                res.statusCode = 410;
                res.json({
                    errmsg: "SESSION读取失败"
                });
                return;
            }
            if (params.userInfo.signature !== WxService.signature(session.session_key, params.userInfo.rawData)) {
                res.statusCode = 400;
                res.json({
                    errmsg: "数据签名验证错误"
                });
            }
            let user = WxService.decryptUserInfo(session, params.userInfo);
            if (user === null) {
                res.statusCode = 400;
                res.json({
                    errmsg: "用户数据解码失败"
                });
            }
            console.log(user);
        }
        catch (err) {
            debug("create user:" + err.message);
            res.statusCode = 400;
            res.json({
                errmsg: err.message
            });
        }
    }))();
});
exports.default = router;
