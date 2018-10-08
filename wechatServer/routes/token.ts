import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as WxService from "../services/wxService";
import * as UserModel from "../models/users";
import * as debugModal from "debug";
import * as config from "config";

let debug: any = debugModal("ts-express:route:token");
let router: express.Router = express.Router();
/* GET home page. */
router.get("/", function(req:express.Request, res: express.Response, next: express.NextFunction): void {
  res.send("test");
});

router.put("/:code", function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  (async() => {
    let session: WxService.ISession = await WxService.code2Session(req.params.code);
    let userInfo: WxService.IUserInfo = await WxService.decryptUserInfo(session, req.body);
    if(userInfo === null) {
      debug(`数据解析失败`);
      res.statusCode = 400;
      res.json({
        errmsg: "数据解析失败，非法用户数据"
      });
      return;
    }
    let user: UserModel.IUser = await UserModel.query(userInfo.openId);
    if(user === null) {
      debug(`do not find user. create new user!`);
      user = await UserModel.create(userInfo);
    }

    if(user === null) {
      debug("user create failed");
      res.statusCode = 400;
      res.json({
        errmsg: "用户创建失败"
      });
    } else {
      debug("user create success. send user token");
      res.statusCode = 201;
      res.json({
        access_token: jwt.sign({userId:user.userId}, config.get<any>("JWT").secret)
      });
    }
  })();
});

export default router;