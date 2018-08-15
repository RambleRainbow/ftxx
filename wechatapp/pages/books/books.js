const app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    grids: [ 
    ],
    filterIndex: 0,
    filters: [
      { name: "全年级", value: 0 },
      { name: "一|二", value: 1 },
      { name: "三|四", value: 2 },
      { name: "五|六", value: 3 },
    ],
  },
  setFilter(value) {
    return () => {
     this.setData({
        filterIndex: value
      })
    };
  },
  setFilter0() { this.setData({ filterIndex: 0 }); },
  setFilter1() { this.setData({ filterIndex: 1 }); },
  setFilter2() { this.setData({ filterIndex: 2 }); },
  setFilter3() { this.setData({ filterIndex: 3 }); },
  getBtnClass0() { return this.data.filterIndex == 0 ? "filter_btn_sel" : "" },
  getBtnClass1() { return this.data.filterIndex == 1 ? "filter_btn_sel" : "" },
  getBtnClass2() { return this.data.filterIndex == 2 ? "filter_btn_sel" : "" },
  getBtnClass3() { return this.data.filterIndex == 3 ? "filter_btn_sel" : "" },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  onShow(options) {
    let self = this;
    console.log(this);
    wx.request({
      url: app.globalData.config.url + "/api/v1/books",
      method: "GET",
      dataType: "json",
      success: function(res) {
        if(res.statusCode >= 200 && res.statusCode < 300){
          self.setData({
            grids: res.data
          })
        } else {
          wx.showToast({
            title: "有点小问题\n请稍后再试",
            icon: "none",
            duration: 2000
          })
        }     
      },
      fail() {
        wx.showToast({
          title: '有点小问题哦\n请稍后再试'
        })
      }
    })
  },
  onPullDownRefresh() {
    
  }
});