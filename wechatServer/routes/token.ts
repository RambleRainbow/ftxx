import * as express from "express";
import * as request from "request";
import * as jwt from "jsonwebtoken";
import * as WxService from "../services/wxService";
import * as UserModel from "../models/users";
import * as debugModal from "debug";

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
    debug(userInfo);
    let user: UserModel.IUser = await UserModel.query(userInfo.openId);
    if(user === null) {
      user = await UserModel.create(userInfo);
    }

    if(user === null) {
      res.statusCode = 400;
      res.json({
        errmsg: "用户创建失败"
      });
    } else {
      res.statusCode = 201;
      res.json({
        access_token: jwt.sign({userId:user.userId}, "hyyd@ftxx@RAINBOW")
      });
    }
  })();
});

export default router;