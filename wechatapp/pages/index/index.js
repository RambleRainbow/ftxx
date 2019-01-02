//index.js
import regeneratorRuntime from "../../utils/regeneratorRuntime"
import * as wxAsync from "../../utils/wxAsync"
import * as wxService from "../../services/wxService"


//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  updateUserInfo(userInfo) {
    app.globalData.userInfo = userInfo;
    this.setData({
      hasUserInfo: userInfo ? true : false
    })
  },
  doLogin({code, userInfo}) {
    return new Promise( (resolve, reject) => {
      (async() => {
        try {
          let token = await wxService.createToken({code, userInfo});
          resolve(token);
        } catch(err) {
          resolve("");
        }
      })();
    });
  },
  login({code, userInfo}) {
    (async() => {
      let token = await this.doLogin({code, userInfo});
      if (token === "") {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
      else {
        app.globalData.token.access = token.access_token;
        app.globalData.t = 1;
        console.log("index:" + getApp().globalData.token.access);
        wx.redirectTo({
          url:`../books/books?token=${token.access_token}`,
        })
      }
    })();
  },
  onLoad: function () {
    let self = this;
    (async() => {
      try {
        let res = await wxAsync.login();
        let resUserInfo = await wxAsync.getUserInfo();
        self.updateUserInfo(resUserInfo.userInfo);
        if(this.data.hasUserInfo) {
          self.login({code: res.code, userInfo: resUserInfo});
        }
      }
      catch(err) {
        this.setData({
          hasUserInfo: false
        })
      }
    })();
  },
  onGetUserInfo: function(e) {
    this.updateUserInfo(e.detail.userInfo);
    if(this.data.hasUserInfo) {
      (async() => {
        let res = await wxAsync.login();
        let resUserInfo = await wxAsync.getUserInfo();
        this.login({
          code: res.code,
          userInfo: resUserInfo
        });
      })();
    }
  }
})
