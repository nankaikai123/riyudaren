// miniprogram/pages/danci/danci.js
var app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dancibenbeijing:"../../images/beijing1.png",
      array:"",
      //右侧导航栏
    daohanglan1: [{ suoyinid: "a", suoyin: "あ" }, { suoyinid: "i", suoyin: "い" }, { suoyinid: "u", suoyin: "う" }, { suoyinid: "e", suoyin: "え" }, { suoyinid: "o", suoyin: "お" }, { suoyinid: "ka", suoyin: "か" }, { suoyinid: "ki", suoyin: "き" }, { suoyinid: "ku", suoyin: "く" }, { suoyinid: "ke", suoyin: "け" }, { suoyinid: "ko", suoyin: "こ" }, { suoyinid: "sa", suoyin: "さ" }, { suoyinid: "si", suoyin: "し" }, { suoyinid: "su", suoyin: "す" }, { suoyinid: "se", suoyin: "せ" }, { suoyinid: "so", suoyin: "そ" }, { suoyinid: "ta", suoyin: "た" }, { suoyinid: "ti", suoyin: "ち" }, { suoyinid: "tu", suoyin: "つ" }, { suoyinid: "te", suoyin: "て" }, { suoyinid: "to", suoyin: "と" }, { suoyinid: "na", suoyin: "な" }, { suoyinid: "ni", suoyin: "に" }],
    daohanglan2: [{ suoyinid: "nu", suoyin: "ぬ" }, { suoyinid: "ne", suoyin: "ね" }, { suoyinid: "no", suoyin: "の" }, { suoyinid: "ha", suoyin: "は" }, { suoyinid: "hi", suoyin: "ひ" }, { suoyinid: "fu", suoyin: "ふ" }, { suoyinid: "he", suoyin: "へ" }, { suoyinid: "ho", suoyin: "ほ" }, { suoyinid: "ma", suoyin: "ま" }, { suoyinid: "mi", suoyin: "み" }, { suoyinid: "mu", suoyin: "む" }, { suoyinid: "me", suoyin: "め" }, { suoyinid: "mo", suoyin: "も" }, { suoyinid: "ya", suoyin: "や" }, { suoyinid: "yu", suoyin: "ゆ" }, { suoyinid: "yo", suoyin: "よ" }, { suoyinid: "ra", suoyin: "ら" }, { suoyinid: "ri", suoyin: "り" }, { suoyinid: "ru", suoyin: "る" }, { suoyinid: "re", suoyin: "れ" }, { suoyinid: "ro", suoyin: "ろ" }, { suoyinid: "wa", suoyin: "わ" }],
      scrollNow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
    //背景转为base64，否则无法显示
    let base64 = wx.getFileSystemManager().readFileSync("images/beijing1.png", 'base64')
    that.setData({
      dancibenbeijing: 'data:jpg;base64,' + base64
    });
    var arr = new Array //储存单词数据
    arr.push({ "suoyin": "あ" })
    wx.showLoading({ //loding开始
      title: '玩命加载中ing',
    })
    wx.cloud.callFunction({
      name: "danciRecord",
      data: {
        targetid: "a"
      }
    }).then(res =>{
      arr = arr.concat(res.result.data)
      console.log(arr)
      that.setData({
        array:arr
      })
      setTimeout(function () { //loding消失
        console.log(">300")
        wx.hideLoading()
      }, arr.length)
    })    
  },

  /**
   * 点击单词表右侧索引函数
   */
  bindsuoyin:function(e){
    var currentsuoyinid = e.currentTarget.dataset.id;
    var currentsuoyin = e.currentTarget.dataset.id2;
    var that = this;
    var arr = new Array //储存单词数据
    arr.push({ "suoyin": currentsuoyin })
    wx.showLoading({  //loding开始
      title: '玩命加载中ing',
    })
    wx.cloud.callFunction({
      name: "danciRecord",
      data: {
        targetid: currentsuoyinid
      }
    }).then(res => {
      arr = arr.concat(res.result.data)
      that.setData({
        array: arr
      })
        setTimeout(function () { //loding消失
          console.log(">300")
          wx.hideLoading()
        }, arr.length-200)
    })
  },
  /**
   * 滚动条滑动时触发方法 
   */
  onPageScroll:function(e){
    //获取当前位置
    this.setData({
      scrollNow:e.scrollTop
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})