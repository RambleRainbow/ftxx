import * as express from "express";
import * as request from "request";
import * as WxService from "../services/wxService";
import * as dbg from "debug";
let router: express.Router = express.Router();
let debug: dbg.IDebugger = dbg("ts:route:user");

interface IUserParams {
  loginCode: string;
  userInfo: WxService.IUserInfoWithSignature;
}

/* GET home page. */
router.put("/", function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  let params: IUserParams = <IUserParams>req.body;
  (async() => {
    try {
      let session: WxService.ISession = await WxService.code2Session(params.loginCode);
      if(session.errcode) {
        res.statusCode = 410;
        res.json({
          errmsg: "SESSION读取失败"
        });
        return;
      }

     if(params.userInfo.signature !== WxService.signature(session.session_key, params.userInfo.rawData)) {
       res.statusCode = 400;
       res.json({
         errmsg: "数据签名验证错误"
       });
     }

     let user: WxService.IUserInfo = WxService.decryptUserInfo(session, params.userInfo);
     if(user === null) {
       res.statusCode = 400;
       res.json({
         errmsg: "用户数据解码失败"
       });
     }

     console.log(user);
    } catch(err) {
      debug("create user:" + err.message);
      res.statusCode = 400;
      res.json({
        errmsg: err.message
      });
    }
  })();
});

export default router;