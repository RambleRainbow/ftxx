"use strict";
/// <reference path="wxService.d.ts"/>
const request = require("request");
const crypto = require("crypto");
const debugModal = require("debug");
let debug = debugModal("ts-express:service:wx");
const URL_WX = "https://api.weixin.qq.com";
class WxService {
    constructor(appid, secret) {
        this._appid = "";
        this._secret = "";
        this._appid = appid;
        this._secret = secret;
    }
    signature(sessionKey, rawData) {
        let sha1 = crypto.createHash("sha1");
        sha1.update(`${rawData}${sessionKey}`);
        return sha1.digest("hex");
    }
    code2Session(code) {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${URL_WX}/sns/jscode2session?appid=${this._appid}&secret=${this._secret}&js_code=${code}&grant_type=authorization_code`,
                method: "GET",
                json: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }, function (error, response, body) {
                if (error) {
                    debug(`invoke code2session error: ${error.message}`);
                    resolve(null);
                    return;
                }
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    debug(`http request api code2session error: ${response.statusCode},${body}`);
                    resolve(null);
                    return;
                }
                let session = body;
                debug(`get session: ${session.openid},${session.session_key}`);
                resolve(session);
            });
        });
    }
    decryptData(sessionKey, iv, data) {
        // base64 decode
        let bufKey = new Buffer(sessionKey, "base64");
        let bufData = new Buffer(data, "base64");
        let bufIv = new Buffer(iv, "base64");
        let rtn;
        try {
            // 解密
            var decipher = crypto.createDecipheriv("aes-128-cbc", bufKey, bufIv);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            var decoded = decipher.update(bufData, "binary", "utf8");
            decoded += decipher.final("utf8");
            rtn = JSON.parse(decoded);
        }
        catch (err) {
            throw new Error("数据解码失败");
        }
        if (rtn.watermark.appid !== this._appid) {
            throw new Error("appid校验失败");
        }
        return rtn;
    }
    decryptUserInfo(session, data) {
        let userInfo;
        try {
            userInfo = this.decryptData(session.session_key, data.iv, data.encryptedData);
        }
        catch (err) {
            return null;
        }
        return {
            openId: userInfo.openId,
            unionId: userInfo.unionId,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city,
            language: userInfo.language
        };
    }
}
let svr = new WxService("wxfff7ec6387d698d6", "9a446299ed31fe35dfbc26c0d6417427");
module.exports = svr;
