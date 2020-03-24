// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'kk-nkknb'
 } )
const db = cloud.database({})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var targetid = event.targetid
  // 先取出集合记录总数
  const countResult = await db.collection('danci_' + targetid).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('danci_' + targetid).skip(i * 100).limit(100).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}


  // var xunHuanNum = event.xunHuanNum
  // var i = event.i
  // var arr = event.arr
  // db.collection('danci_' + targetid).skip(i*100).get().then(res =>{
  //     for (var j = 0; j < res.data.length; j++) {
  //       arr.push(res.data[j])
  //     }
  //     if (i == xunHuanNum - 1) {
  //       console.log(arr)
  //       return arr
  //     } else {
  //       i = i + 1
  //       cloud.callFunction({
  //         name:"danciRecord",
  //         data:{
  //           targetid: targetid,
  //           arr: arr,
  //           xunHuanNum: xunHuanNum,
  //           i:i
  //         }
  //       })
  //     }
  //   })
//   return db.cloud
// }