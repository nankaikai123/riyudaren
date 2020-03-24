//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //提交
  tijiao: function () {
    //"2>1":代表游戏过关的flag
    if (2>1) {
      wx.showModal({
        title: '提示',
        content: '成功！',
        showCancel: true,//是否显示取消按钮
        cancelText: "主页",//默认是“取消”
        cancelColor: 'skyblue',//取消文字的颜色
        confirmText: "重新开始",//默认是“确定”
        confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击主页，跳转到主页面
          } else {
            //点击重新开始，重新载入当前页面
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '失败！',
        showCancel: true,//是否显示取消按钮
        cancelText: "主页",//默认是“取消”
        cancelColor: 'skyblue',//取消文字的颜色
        confirmText: "重新开始",//默认是“确定”
        confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击主页，跳转到主页面
          } else {
            //点击重新开始，重新载入当前页面
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    } 
  },
  //打开设置提示
  showSet: function () {
    this.setData({
      isSetTrue: true
    })
  },
   //关闭设置提示
    hideSet: function () {
    this.setData({
      isSetTrue: false
    })
  }

})
