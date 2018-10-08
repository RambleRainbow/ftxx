import * as wxAsync from "../utils/wxAsync"
import regeneratorRuntime from "../utils/regeneratorRuntime"
let app = getApp();

function createToken({code, userInfo}) {
  return new Promise( (resolve, reject) => {
    (async() => {
      try {
        console.log(userInfo);
        let res = await wxAsync.request({
          url: `${app.globalData.config.urlWxService}/api/v1/tokens/${code}`,
          method: "PUT",
          dataType: "JSON",
          data: userInfo
        })
        if(res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    })();
  });
}

module.exports = {
  createToken
}