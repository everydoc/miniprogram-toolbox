const request = require('../../../utils/request.js');
const utils = require('../../../utils/util.js');
var that;
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    isAdmin: false,
    forksCount: 0,
    success:false,
    error:false,
    userInfo: {
      isSignedIn: true
    }
  },
  lifetimes: {
    attached() {
      that = this;
      that.setData({
        isAdmin: app.globalData.isAdmin,
        userInfo: wx.getStorageSync('userInfo')
      })
      this.login();
    }
  },
  methods: {
    login() {
      request.get("/user/login", {}, this, (res) => {
        // console.log(res)
        if (res.code == 1) {
          that.setData({
            userInfo: res.data
          })
          wx.setStorageSync('userInfo', res.data)
        } else {
          console.error(res)
        }
      }, (err) => {
        console.error(err)
      });
    },
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(2) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(2) + 'W'
      }
      return e
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        error: false,
        success: false
      })
    },
    sign() {
      let that = this;
      request.get("/user/signIn", {}, this, function (res) {
        if (res.code == 1) {
          // console.log(res.data.endSignInTime)
          that.setData({
            userInfo: res.data,
            success: true
          })
          wx.setStorageSync('userInfo', res.data)
        } else {
          that.setData({
            error:true
          })
        }
      }, function (res) {
        console.error(res)
      });
    },

  }
})