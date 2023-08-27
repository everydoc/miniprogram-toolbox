App({
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    var that = this
    that.globalData.openid = wx.getStorageSync('openid')
    if (that.globalData.openid) {
      that.globalData.isAdmin = that.globalData.admin === that.globalData.openid;
    } else {
      //调用登录接口
      wx.login({
        success(res) {
          if (res.code) {
            // 获取后台用户信息
            wx.request({
              url: this.globalData.baseUrl + '/user/auth',
              method: 'GET',
              data: {
                code: res.code
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log(res)// 查看admin的openid
                that.globalData.openid = res.data.openid // 设置openid
                that.globalData.isAdmin = that.globalData.admin === res.data.openid // 设置是否管理员
                wx.setStorageSync('openid', res.data.openid)
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }
        }
      });
    }
  },
  globalData: {
    admin: "oYWWS65lYN99X5eWDyvIHQjQJOfs",
    isAdmin: false,
    openid: null,
    baseUrl: "https://magic.imjcker.com:1314/app/toolbox",
    userInfo: null
  }
})