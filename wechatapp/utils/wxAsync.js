function getUserInfo() {
  return new Promise( (resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(new Error(e.errmsg));
      }
    })
  })
}

function login() {
  return new Promise( (resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(new Error(e.errmsg));
      }
    })
  })
}

function request({url,data = undefined,header=undefined, method=undefined, dataType=undefined, responseType=undefined}) {
  return new Promise( (resolve, reject)=> {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success(res) {
        if(res.statusCode >= 200 && res.statusCode < 400) {
          resolve(res);
        }
        else {
          let err = new Error(`调用错误:${res.statusCode}-${res.errmsg}`);
          reject(err);
        }
      },
      fail(e) {
        reject(new Error(e.errMsg));
      }
    })
  })
}

module.exports = {
  getUserInfo,
  login,
  request,
}