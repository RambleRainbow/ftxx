Page({
  data: {
    inputShowed: false,
    inputVal: "",
    grids: [
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg"},
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
      { name: "活了100万次的猫", image: "https://img12.360buyimg.com/n2/jfs/t6652/357/528149228/508023/6fb1f085/59410a88N30ac50fb.jpg" },
    ],
    filterIndex: 0,
    filters: [
      { name: "所有年级", value: 0 },
      { name: "一 ~ 二", value: 1 },
      { name: "三 ~ 四", value: 2 },
      { name: "五 ~ 六", value: 3 },
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
  }
});