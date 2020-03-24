// miniprogram/pages/main/main.js
//获取应用实例
var app = getApp()
// 获取BackgroundAudioManager 实例
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sethide:'/images/set-hide.png',
    background:"/images/main_bg.jpg",
    touxiang:'',
    username:'',
    login:false,
    gender:"中",
    tongGuanShu:app.globalData.tongGuanShu
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //背景转为base64，否则无法显示
    let base641 = wx.getFileSystemManager().readFileSync(that.data.sethide, 'base64')
    let base64 = wx.getFileSystemManager().readFileSync(that.data.background, 'base64')
    that.setData({
      background: 'data:jpg;base64,' + base64,
      sethide: 'data:jpg;base64,' + base641
    })
    //获取用户信息
    var userInfo = '' //存放用户信息
    wx.getUserInfo({
      success:function(res){
        userInfo = res
        var gender = ''
        if(res.userInfo.gender == 1){
          gender = "男"
        } else if(res.userInfo.gender == 2){
          gender = "女"
        } else {
          gender = "中"
        }
        that.setData({
          login:true,
          touxiang:res.userInfo.avatarUrl,
          username:res.userInfo.nickName,
          gender:gender
        })
      }
    })

    //测试云开发
    //通过wx.login获取openid
    wx.login({
      success:function(res){
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data:{
            appid: "wxb2a1bb6c12ff1633",
            secret: "910eb41847b0b4ea40896cd768361c34",
            js_code: res.code,
            grant_type: 'authorization_code'  
          },
          success:function(inforRes){
            that.UserDengLu(inforRes.data.openid)
          },
          fail:function(inforrFailRes){
            console.log("失败："+inforrFailRes)
          }
        })
      }
    })
  },
  /**
   * 用户登录
   * 判断首次登录
   * 首次重置数据 不是首次加载数据
   */
  UserDengLu:function(openid){
    var that = this
    wx.cloud.init({
      traceUser: true,
      env: 'kk-nkknb'
    })
    const db = wx.cloud.database();
    const todos = db.collection('userInformation').where({
      openid: openid
    }).get({
      success:function(res){
        var userNum1 = new Number //总用户条数
        db.collection('userInformation').where({}).count({
          success:function(res){
            userNum1 = res.total//用户总条数
            userNum1 = userNum + 1
          }
        }) 
        if(res.data.length == 0){
          //新用户
          console.log("新用户")
          db.collection('userInformation').add({
            data:{
              userNum:userNum1,
              _id: openid,
              openid:openid,
              tongGuanShu:0
            },
            success:function(res){
              console.log(res)
            },
            fail:function(res){
              console.log("失败："+res)
            }
          }),
          that.setData({
            tongGuanShu:0
            })
          app.globalData.openId = openid
          app.globalData.open_Id = openid
          app.globalData.tongGuanShu = 0
        } else {
          //不是新用户获取数据
          that.setData({
            tongGuanShu: res.data[0].tongGuanShu
          })
          app.globalData.tongGuanShu = res.data[0].tongGuanShu
          app.globalData.openId = res.data[0].openid
          app.globalData.open_Id = res.data[0]._id
        }
      },
      fail:function(res){
        console.log("失败："+res)
      }
    })
  },
  /**
   * 跳转到单词表页面
   */
  urldanci: function () {
    wx.navigateTo({
      url: '../danci/danci',
    })
  },
  /**
   * 个人信息框弹出
   */
  changeYL: function () {
    this.setData({
      showModal: true
    })
  },
  hidexinxi:function(){
    if (this.data.showModal )
  this.setData({
    showModal: false
  })
  },
  /**
   *打开设置提示
   */
  showSet: function () {
    this.setData({
      isSetTrue: true
    })
  },
  /**
   *关闭设置提示
   */
  hideSet: function () {
    this.setData({
      isSetTrue: false
    })
  },
  /**
   * 点击开始按钮，跳转开始界面
   */
  startGame:function(){
    wx.navigateTo({
      url: '../game/game',
    })
  },
  /**
   * 用户登录函数
   */
  getUserInfo:function(e){
    var that = this
    that.setData({
      login: true,
      touxiang: e.detail.userInfo.avatarUrl,
      username: e.detail.userInfo.nickName,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.globalData.dianJiSheng = true //点击声开关
    // 对背景音乐实例进行设置
    //backgroundAudioManager.src = "cloud://kk-nkknb.6b6b-kk-nkknb-1257801408/bgm.mp3"
    backgroundAudioManager.title = 'bgml'   // 标题为必选项
    backgroundAudioManager.loop = true
    backgroundAudioManager.autoplay = true
    backgroundAudioManager.play()           // 开始播放
    //监听音频自然播放至结束的事件
    backgroundAudioManager.onEnded(() => {
      console.log("播放完毕")
      backgroundAudioManager.src = "cloud://kk-nkknb.6b6b-kk-nkknb-1257801408/bgm.mp3"
    })
  },
  bgMusicStop: function (e) {
    if (e.detail.value) {
      backgroundAudioManager.play()
      //监听音频自然播放至结束的事件
      backgroundAudioManager.onEnded(() => {
        backgroundAudioManager.play();
      })
    } else {
      backgroundAudioManager.pause()
    }
  },
  bgSoundStop: function (e) {
    app.globalData.dianJiSheng = e.detail.value
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