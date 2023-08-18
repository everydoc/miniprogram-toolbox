// pages/tools/toutiaoadd/toutiaoadd.js
const request = require('../../../utils/request.js');
var app = getApp()
var that

Page({

  data: {
    InputBottom: 0,
    users:[]
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    // request.get('/toutiao/userListByOpenid',{},this, res=>{
    //   if(res.code == 1){
    //     that.setData({
    //       users: res.data
    //     })
    //   }else{
    //     wx.showToast({
    //       title: '获取用户数据失败',
    //     })
    //   }
    // },err=>{
    //   wx.showToast({
    //     title: '网络请求失败',
    //   })
    // })
  },
  addUser(e) {
    let userDomain = e.detail.value.userDomain
    console.log(e.detail)
    if(this.regUrl(userDomain)){
      let domain = this.findUrlByStr(userDomain)[0]
      request.post('/toutiao/addUser',{domain: domain},this,res=>{
        if(res.code == 1){
          wx.showToast({
            title: '绑定数据成功',
          })
        }else if (res.code == -1){
          wx.showToast({
            title: res.message,
          })
        }
      })
    }
  },
  regUrl: function (t) {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t)
  },
  findUrlByStr: function (t) {
    return t.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
  }
})