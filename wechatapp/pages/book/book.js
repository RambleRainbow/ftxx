// pages/book/book.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "5b73ef6f91d29f0cc875b042",
    bookName: "活了一百万次的猫",
    swiperIndex: 0,
    bookDetail: {}
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
      bookName: options.name
    })
    wx.setNavigationBarTitle({
      title: options.name,
    });
    wx.request({
      url: app.globalData.config.url + `/api/v1/books/${options.id}`,
      header: {
        "Authorization": `Beared ${app.globalData.token.access}`
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          self.setData({
            bookDetail: res.data
          })
        } else {
          wx.showToast({
            title: '哎呀，出错了',
          })
        }
      }
    })
  },
  doPreview() {
    wx.previewImage({
      urls: this.data.bookDetail.images,
      current: this.data.bookDetail.images[this.data.swiperIndex]
    })
  },

  bindGetUserInfo(e) {
    console.log(e);
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