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
        resolve(res);
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