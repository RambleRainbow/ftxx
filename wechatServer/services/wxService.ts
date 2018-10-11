/// <reference path="wxService.d.ts"/>

import * as request from "request";
import * as crypto from "crypto";
import { raw } from "body-parser";
import * as debugModal from "debug";

let debug: debugModal.IDebugger = debugModal("ts-express:service:wx");

const URL_WX: string= "https://api.weixin.qq.com";

class WxService implements WxService.IService {
  private _appid: string = "";
  private _secret: string = "";
  constructor(appid: string, secret: string) {
    this._appid = appid;
    this._secret = secret;
  }

  signature(sessionKey: string, rawData: string): string {
    let sha1: crypto.Hash = crypto.createHash("sha1");
    sha1.update(`${rawData}${sessionKey}`);
    return sha1.digest("hex");
  }

  code2Session(code: string): Promise<WxService.ISession> {
    return new Promise<WxService.ISession>( (resolve, reject) => {
      request.get({
        url: `${URL_WX}/sns/jscode2session?appid=${this._appid}&secret=${this._secret}&js_code=${code}&grant_type=authorization_code`,
        method: "GET",
        json: true,
        headers: {
          "Content-Type": "application/json"
        }
      },
      function(error: any, response: request.Response, body: any): void {
        if(error) {
          debug(`invoke code2session error: ${error.message}`);
          resolve(null);
          return;
        }

        if(response.statusCode < 200 || response.statusCode >= 300) {
          debug(`http request api code2session error: ${response.statusCode},${body}`);
          resolve(null);
          return;
        }

        let session: WxService.ISession = <WxService.ISession>body;
        debug(`get session: ${session.openid},${session.session_key}`);
        resolve(session);
      });
    });
  }

  private decryptData(sessionKey: string, iv: string, data: string): any {
  // base64 decode
    let bufKey: Buffer = new Buffer(sessionKey, "base64");
    let bufData: Buffer = new Buffer(data, "base64");
    let bufIv: Buffer = new Buffer(iv, "base64");
    let rtn: any;

    try {
       // 解密
      var decipher: crypto.Decipher = crypto.createDecipheriv("aes-128-cbc", bufKey, bufIv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      var decoded: string = decipher.update(bufData, "binary", "utf8");
      decoded += decipher.final("utf8");

      rtn = JSON.parse(decoded);

    } catch (err) {
      throw new Error("数据解码失败");
    }

    if (rtn.watermark.appid !== this._appid) {
      throw new Error("appid校验失败");
    }

    return rtn;
  }

  decryptUserInfo(session: WxService.ISession, data: WxService.IUserInfoWithSignature): WxService.IUserInfo {
    let userInfo: any;

    try {
      userInfo = this.decryptData(session.session_key, data.iv, data.encryptedData);
    } catch(err) {
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

let svr: WxService = new WxService("wxfff7ec6387d698d6", "9a446299ed31fe35dfbc26c0d6417427");
module.exports = svr;