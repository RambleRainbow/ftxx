// pages/book/book.js
import * as wxAsync from "../../utils/wxAsync.js";
import regeneratorRuntime from "../../utils/regeneratorRuntime";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "5b73ef6f91d29f0cc875b042",
    bookName: "活了一百万次的猫",
    swiperIndex: 0,
    bookDetail: {},
    likeAmount: 0,
    isUserLike: false,
    haveBookDetail: false
  },

  onSwiperChange(args) {
    this.setData({
      swiperIndex: args.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    this.setData({
      bookId: options.id,
      bookName: options.name,
      token: options.token
    })
    wx.setNavigationBarTitle({
      title: options.name,
    });
    (async() => {
      try {
        let res = await wxAsync.request({
          url: app.globalData.config.url + `/api/v1/books/${options.id}`,
          header: {
            //"Authorization": `Beared ${app.globalData.token.access}`
            "Authorization": `Beared ${this.data.token}`
          },
        });
        let resAmount = await wxAsync.request({
          url: app.globalData.config.url + `/api/v1/books/${options.id}/likes`,
          header: {
            //"Authorization": `Beared ${app.globalData.token.access}`
            "Authorization": `Beared ${this.data.token}`
          },
        })
        this.setData({
          bookDetail: res.data,
          haveBookDetail: true,
          likeAmount: resAmount.data.amount,
          isUserLike: resAmount.data.isUserLike
        })
      } catch (err) {
        console.log(err.message);
        wx.showToast({
          title: '哎呀，出错了',
        })
      }
    })();
  },
  doPreview() {
    wx.previewImage({
      urls: this.data.bookDetail.images,
      current: this.data.bookDetail.images[this.data.swiperIndex]
    })
  },

  onAddUserLike() {
    this.setData({
      isUserLike: true,
      likeAmount: this.data.likeAmount + 1
    });
    (async() => {
      try {
        let res = await wxAsync.request({
          url: app.globalData.config.url + `/api/v1/books/${this.data.bookId}/likes`,
          method: "POST",
          header: {
            //"Authorization": `Beared ${app.globalData.token.access}`
            "Authorization": `Beared ${this.data.token}`
          }
        });
      } catch(err) {}
    })();
  },

  onRemoveUserLike() {
    this.setData({
      isUserLike: false,
      likeAmount: this.data.likeAmount - 1
    });
    (async() => {
      try {
        let res = await wxAsync.request({
          url: app.globalData.config.url + `/api/v1/books/${this.data.bookId}/likes`,
          method: "DELETE",
          header: {
            //"Authorization": `Beared ${app.globalData.token.access}`
            "Authorization": `Beared ${this.data.token}`
          }
        });
        console.log(res);
      } catch(err) {
        console.log(err);
      }
    })();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})