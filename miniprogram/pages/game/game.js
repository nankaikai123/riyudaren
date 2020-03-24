// miniprogram/pages/game/game.js

//获取应用实例
var app = getApp()
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: "../../images/game.png",
    background2:"../../images/beijing.jpg",
    jindutiao:10,
    i:0,
    //view1:false,
    view2:true,
    item: "",
    ciyu:'',
    xuanzhongFlg:true,
    current_item_datiqu:"00",
    current_item_xuanciqu: "0",
    xuanZhongJiaMing:'',
    daTiQuXuanZhongIndex:0, //选词区选中的索引，用于消除选词区选中单词
    xuanCiAr2:'', //选词区备用词组，用于还原选词区
    xuanCiAr:'', //选词区词组，用于页面选词区填充
    yemianjiazaiFlg:false, //判断数据加载完毕
    table_height:150,
    tr_height:150
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let base64 = wx.getFileSystemManager().readFileSync("images/game.png", 'base64')
    that.setData({
      background: 'data:img;base64,' + base64
    });
    let base642 = wx.getFileSystemManager().readFileSync("images/beijing.jpg", 'base64')
    that.setData({
      background2: 'data:img;base64,' + base642
    }),
    that.dingshi()

    //取出通关数
    var tongGuanShu = app.globalData.tongGuanShu
    //取出数组
    var itemzong = new Array();
    var dancizong = db.collection('word').where({
      id:tongGuanShu
    }).get({
      success: function (res) {
        var split = res.data[0].word_msg
        itemzong = split.split("-")
        console.log(itemzong.length)
        that.setData({
          item: itemzong,
          yemianjiazaiFlg:true,
          table_height:300 / 5,
          tr_height:316.6 / itemzong.length
        })
      }
    })
    //设置定时器避免数据加载不完全
    var interval = setInterval(function(){
      if (that.data.yemianjiazaiFlg){
        console.log("加载完毕")
        clearInterval(interval) //取消数据加载的定时判断
        var datiArr = new Array() //答题用词组
        var xuanCiArr = new Array() //选词用词组
        var xuanCiArr2 = new Array() //选词用备用词组
        that.setData({
          datiAr: datiArr,
          xuanCiAr: xuanCiArr,
          xuanCiAr2: xuanCiArr2
        })
        var itemlinshi = that.data.item
        for (var index in itemlinshi) {
          var itemlinshi1 = itemlinshi[index]
          that.bianliciyu(itemlinshi1, index)
        }
        console.log(that.data.datiAr)
        console.log(that.data.xuanCiAr)
      }
    },300)
    
  },  
  /**
     * 进度条定时器
     */
  dingshi: function () {
    var that = this;
    var i = setInterval(function () {
      that.setData({
        jindutiao: that.data.jindutiao + 1
      })
      if (that.data.jindutiao > 90)
        clearInterval(i)
    }, 200)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      console.log("页面初次渲染完成")
      that.setData({
        jindutiao: 100
      })
      that.begingame();
    }, 3000);
  },
  /**
   * 百分比加载完成后打开游戏界面
   */
  begingame: function () {
    var that = this;
    setTimeout(function(){
      that.setData({
        view1: true,
        view2: false
      })
    },500)
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setTimeout(function () {
      console.log("监听界面显示")
      that.setData({
        jindutiao: 60
      })
    }, 1000)
  },
  /**
   * 答题区选择假名：背景变为选中状态
   * 选词区置空
   * 如果选择了选词区的假名将选择的假名放入点击的空格
   * 如果点击有假名的空格就还原
   * 最后触发成功失败判断
   */
  daTiQuXuanCi: function (e) {
    var that = this;
    let cuu = e.currentTarget.dataset.key;//获取index值,用于改变css变为选中样式
    //判断是不是最后一个格子，不是的话不能点击
    var clickIndex = e.currentTarget.dataset.key2 //点击格子的数量
    var hangMu = e.currentTarget.dataset.hangmu //点击单词的行目
    var itemLinShi = that.data.datiAr //答题区展示的数组
    var xuanZhongDanCi = itemLinShi[hangMu] //取出点击的单词
    var danCiLen = xuanZhongDanCi.length //选中单词长度
    if (clickIndex != (danCiLen - 1) || that.data.xuanZhongJiaMing == ''){
      return
    }
    that.DianJiSheng();//点击音效
    //选中单词后进行替换
    var zongDanCiShu = that.data.item.length - 1
    var gaiHouDanCi = '' //改后单词
    var danCiLinShi = '' //临时单词
    var xuanCiArLinShi = that.data.xuanCiAr //选词区数组
    if (hangMu == zongDanCiShu) {
      for (var i = 0; i < danCiLen - 1; i++) {
        danCiLinShi = danCiLinShi + xuanZhongDanCi.substring(i, i + 1)
      }
      if (xuanZhongDanCi.substring(danCiLen - 1, danCiLen) == ' ') {
        var xuanCiArLinShi = that.data.xuanCiAr
        xuanCiArLinShi[that.data.daTiQuXuanZhongIndex] = ' '
        that.setData({
          xuanCiAr: xuanCiArLinShi
        }),
          danCiLinShi = danCiLinShi + that.data.xuanZhongJiaMing
      } else {
        danCiLinShi = danCiLinShi + ' '
        var jiaMing = xuanZhongDanCi.substring(danCiLen - 1,danCiLen) //答题区中还原到选词区的假名
        var num = -1 //还原选词区顺序
        var xuanCiAr2 = that.data.xuanCiAr2
        for (var i =0;i<xuanCiAr2.length;i++){
          if (jiaMing == xuanCiAr2[i]){
            num = i
          }
        }
        xuanCiArLinShi[num] = jiaMing
      }
      itemLinShi[hangMu] = danCiLinShi
    } else {
      var xuanZhongDanCiXiaYiHang = itemLinShi[(hangMu + 1)]
      var danCiXiaYiHangLen = xuanZhongDanCiXiaYiHang.length //选中单词长度
      var danCiLinShi2 = '' //下一行的临时单词
      for (var i = 0; i < danCiLen - 1; i++) {
        danCiLinShi = danCiLinShi + xuanZhongDanCi.substring(i, i + 1)
      }
      if (xuanZhongDanCi.substring(danCiLen - 1, danCiLen) == ' '){
        var xuanCiArLinShi = that.data.xuanCiAr
        xuanCiArLinShi[that.data.daTiQuXuanZhongIndex]=' '
        that.setData({
          xuanCiAr: xuanCiArLinShi
        }),
        danCiLinShi = danCiLinShi + that.data.xuanZhongJiaMing
        //下一行单词头假名
        danCiLinShi2 = danCiLinShi2 + that.data.xuanZhongJiaMing
        for (var j = 1; j < danCiXiaYiHangLen; j++) {
          danCiLinShi2 = danCiLinShi2 + xuanZhongDanCiXiaYiHang.substring(j, j + 1)
        }
      } else {
        danCiLinShi = danCiLinShi + ' '
        var jiaMing = xuanZhongDanCi.substring(danCiLen - 1, danCiLen) //答题区中还原到选词区的假名
        var num = -1 //还原选词区顺序
        var xuanCiAr2 = that.data.xuanCiAr2
        for (var i = 0; i < xuanCiAr2.length; i++) {
          if (jiaMing == xuanCiAr2[i]) {
            num = i
          }
        }
        xuanCiArLinShi[num] = jiaMing
        //下一行单词头假名
        danCiLinShi2 = danCiLinShi2 + " "
        for (var j = 1; j < danCiXiaYiHangLen; j++) {
          danCiLinShi2 = danCiLinShi2 + xuanZhongDanCiXiaYiHang.substring(j, j + 1)
        }
      }
      itemLinShi[hangMu] = danCiLinShi
      
      itemLinShi[(hangMu + 1)] = danCiLinShi2
    }
    that.setData({
      datiAr: itemLinShi,
      xuanCiAr: xuanCiArLinShi,
      current_item_datiqu: cuu,
      current_item_xuanciqu: '0',
      xuanZhongJiaMing:''
    })
    //通关判断
    if (that.panduan() == true){
      that.tijiao(true)
    } else if (that.panduan() == "2"){
      console.log("未填完不做操作")
    }else {
      that.tijiao(false)
    }
  },

  /**
   * 选词区选择假名：背景变为选中状态
   * 答题区置空
   * 获取选择的词
   */
  xuanCiQuXuanCi: function (e) {
    var that = this;
    that.DianJiSheng();//点击音效
    let cuu = e.currentTarget.dataset.key;//获取index值
    that.setData({
      current_item_xuanciqu: cuu,
      daTiQuXuanZhongIndex:cuu,
      current_item_datiqu: '0',
      xuanZhongJiaMing: e.currentTarget.dataset.item
    })
  },
  /**
   * 点击音效
   */
  DianJiSheng:function(){
    if(app.globalData.dianJiSheng){
      const dianJiSheng = wx.createInnerAudioContext()
      dianJiSheng.src = "cloud://kk-nkknb.6b6b-kk-nkknb-1257801408/sound.mp3"
      dianJiSheng.play()
    }
  },
  /**
   * 胜利失败处理
   */
  //提交
  tijiao: function (jieguo) {
    //"2>1":代表游戏过关的flag
    if (jieguo == true) {//提高通关数
      console.log(app.globalData.tongGuanShu)
      db.collection("userInformation").doc(app.globalData.open_Id).update({
        data: {
          tongGuanShu: app.globalData.tongGuanShu + 1
        },
        success: function () {
          app.globalData.tongGuanShu = app.globalData.tongGuanShu + 1
          wx.showModal({
            title: '提示',
            content: '成功！',
            showCancel: true,//是否显示取消按钮
            cancelText: "主页",//默认是“取消”
            cancelColor: '#191970',//取消文字的颜色
            confirmText: "下一关",//默认是“确定”
            confirmColor: '#191970',//确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                wx.navigateTo({
                  url: '../main/main',
                })
              } else {
                //点击下一关，重新载入当前页面
                wx.navigateTo({
                  url: '../game/game',
                })
              }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '失败！',
        showCancel: true,//是否显示取消按钮
        cancelText: "主页",//默认是“取消”
        cancelColor: '#191970',//取消文字的颜色
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
  /**
   * 遍历单词展示到前端
   */
  bianliciyu:function(danci,index){
    var that = this
    var datiArr = that.data.datiAr //答题用词组
    var xuanCiArr = that.data.xuanCiAr//选词用词组
    var xuanCiArr2 = that.data.xuanCiAr2//选词备用词组
    var danciLen = danci.length //单词长度
    var danciLinshi = "" //临时用单词
    //根据头尾分成答题区和选词区
    if (index == 0){
      for (var i = 0;i<danciLen - 1;i++){
        danciLinshi = danciLinshi + danci.substring(i, i + 1)
      }
      danciLinshi = danciLinshi + " "
      xuanCiArr[index] = danci.substring(danciLen - 1, danciLen)
      xuanCiArr2[index] = danci.substring(danciLen - 1, danciLen)
    } else {
      danciLinshi = danciLinshi + " "
      for (var i = 1; i < danciLen - 1; i++) {
        danciLinshi = danciLinshi + danci.substring(i, i + 1)
      }
      danciLinshi = danciLinshi + " "
      xuanCiArr[index] = danci.substring(danciLen - 1, danciLen)
      xuanCiArr2[index] = danci.substring(danciLen - 1, danciLen)
    }
    datiArr[index] = danciLinshi
      that.setData({
        xuanCiAr2: xuanCiArr2,//备用选词区假名顺序，还原选词区时用
        flg:2
      })
    that.setData({
      datiAr: datiArr,
      xuanCiAr: xuanCiArr,
      current_item_datiqu: "0" + (danciLen - 1)
    })

  },
  /**
   * 通关判断函数
   * 返回值：true 成功 2 未全部填满无需判断 false：失败
   */
  panduan:function(){
    var that = this
   var xuanCiQu = that.data.xuanCiAr 
   for(var i = 0;i<xuanCiQu.length;i++){
     if (xuanCiQu[i] != " "){
       return "2"
     }
   }
    var xuanCiQu = that.data.xuanCiAr2 //正确顺序 
    var user = new Array()//用户顺序
    var daTiQu = that.data.datiAr
    for(var i = 0;i<daTiQu.length;i++){
      var len = daTiQu[i].length
      user[i] = daTiQu[i].substring(len -1,len)
    }
    //判断两个数组是否一致，一致就成功，否则失败
    for(var i = 0;i<xuanCiQu.length;i++){
      if(xuanCiQu[i] != user[i])
        return false
    }
    return true
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