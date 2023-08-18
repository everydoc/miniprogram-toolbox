//index.js
//注意！基础库【2.9.0】起支持 2d 模式，如不显示请检查基础库版本！
import uCharts from '../../../utils/u-charts.min.js';
const app = getApp();
const request = require('../../../utils/request.js');
var uChartsInstance = {};
var that;
Page({
  data: {
    cWidth: 750,
    cHeight: 500,
    pixelRatio: 1,
    showCanvas: false,
    userList: [],
    content: {
      article: [],
      video: []
    }
  },
  onLoad() {
    that = this;
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    const pixelRatio = wx.getSystemInfoSync().pixelRatio;
    this.setData({
      cWidth,
      cHeight,
      pixelRatio
    });
    wx.showLoading({
      title: '加载数据中',
    })
    this.getUserList();
    wx.hideLoading()
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  getUserList() {
    request.get('/toutiao/userList', {}, this,
      (res) => {
        if (res.code == 1) {
          that.setData({
            userList: res.data
          })
        }
      }
    )
  },
  getUserStat(e) {
    that.setData({
      showCanvas: true
    })
    this.getChartsData(e.currentTarget.id)
    this.getUserArticleAndVideoInfo(e.currentTarget.id)
  },
  copyUrl(e) {
    wx.setClipboardData({
      data: 'https://www.toutiao.com/c/user/token/' + e.currentTarget.id
    });
  },
  copyArticle(e) {
    wx.setClipboardData({
      data: e.currentTarget.id
    });
  },
  getUserArticleAndVideoInfo(token) {
    request.get('/toutiao/getArticleAndVideo', {token: token}, this, 
      (res)=>{
        if(res.code == 1){
          that.setData({
            content: res.data
          })
        }
      },
      (err)=>{
        console.error(err)
      }
    )
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