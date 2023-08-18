// pages/detail/detail.js
import {
  getDetailsApi
} from '../../../api/home.js'

const app = getApp()
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId: '',
    questionDesc: '',
    questionTitle: '',
    questionImg: '',
    status: '',
    shareId: null
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this

    console.log('详情页')
    console.log(options)
    this.setData({
      questionId:options.questionId
    })
    // 从分享过来，启用一个按钮回到文件列表。
    if(options.shareId){
      this.setData({
        shareId: options.shareId
      })
    }
    
  },

  async getDetails() {
    let parm = {
      questionId: that.data.questionId,
      openid: app.globalData.openid
      //openid:wx.getStorageSync('openid')
    }
    let res = await getDetailsApi(parm);
    
    if (res && res.code == 1) {
      that.setData({
        questionId: res.data.questionId,
        questionDesc: res.data.questionDesc,
        questionTitle: res.data.questionTitle,
        questionImg: res.data.questionImg,
        status: res.data.status
      })
      console.log('显示数据',that.data)
    }

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
    this.getDetails()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: that.data.questionTitle,
      path: "/pages/survey/detail/detail?shareId=" + wx.getStorageSync('openid') + '&questionId=' + that.data.questionId
    }
  },

  onShareTimeline: function () {
    return {
      title: that.data.questionTitle,
      query: "shareId=" + wx.getStorageSync('openid') + '&questionId=' + that.data.questionId
    }
  },

  gotoAnswer: function (e) {
    wx.navigateTo({
      url: '../answer/answer?questionId=' + e.currentTarget.dataset.questionid,
    })
  },

  hasAnswer(e) {
    wx.showToast({
      title: '您已答卷',
      duration: 2000
    })
  }

})