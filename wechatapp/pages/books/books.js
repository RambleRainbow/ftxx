const app = getApp();
Page({
  data: {
    companyName: "方泰小学",
    inputShowed: false,
    inputVal: "",
    grids: [],
    filterIndex: 0,
    filters: [
      { name: "全年级", value: 0 },
      { name: "一|二", value: 1 },
      { name: "三|四", value: 2 },
      { name: "五|六", value: 3 },
    ],
    classLabels:["所有年级"],
    books: []
  },
  setFilter0() { 
    this.setData({ 
      filterIndex: 0,
      classLabels: ["所有年级"],
      grids: this.filterBooks(this.data.inputVal, ["所有年级"], this.data.books)
    }); 
  },
  setFilter1() {
    this.setData({
      filterIndex: 1,
      classLabels: ["一年级", "二年级"],
      grids: this.filterBooks(this.data.inputVal, ["一年级","二年级"], this.data.books)
    });
  },
  setFilter2() {
    this.setData({
      filterIndex: 2,
      classLabels: ["三年级", "四年级"],
      grids: this.filterBooks(this.data.inputVal, ["三年级", "四年级"], this.data.books)
    });
  },
  setFilter3() {
    this.setData({
      filterIndex: 3,
      classLabels: ["五年级", "六年级"],
      grids: this.filterBooks(this.data.inputVal, ["五年级", "六年级"], this.data.books)
    });
  },
  canShow(index) {
    return true;
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      grids: this.filterBooks("", this.data.classLabels, this.data.books)
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      grids: this.filterBooks("", this.data.classLabels, this.data.books)
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      grids: this.filterBooks(this.data.inputVal, this.data.classLabels, this.data.books)
    });
  },
  filterBooks(bookName, labels, books) {
    let grid = [];
    grid = books.filter( book => {
        if(book.name.match(bookName)) {
          for(let i = 0; i < labels.length; i++) {
            if(book.labels.find( item => item === labels[i])) {
              return true;
            }
          }
        }
        return false;
    });
    return grid;
  },
  onLoad(options) {
    let self = this;
    wx.request({
      url: app.globalData.config.url + "/api/v1/books",
      method: "GET",
      dataType: "json",
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          self.setData({
            books: res.data,
            grids: self.filterBooks(self.data.inputVal, self.data.classLabels, res.data)
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
          title: '有点小问题哦\n请稍后再试',
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  onShow(options) {

  },
  onPullDownRefresh() {
    
  }
});