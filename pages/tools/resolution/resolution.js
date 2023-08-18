const app = getApp();
const request = require('../../../utils/request.js');
var that;
Page({
  data: {
    url: '',
    videoUrl: '',
    videoTitle: '',
    downloadUrl: '',
    isShow: false,
    isDownload: false,
    isButton: true
  },
  onLoad(options) {
    that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  // 视频地址匹配是否合法
  regUrl: function (t) {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t)
  },
  findUrlByStr: function (t) {
    return t.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
  },
  submit: function () {
    this.setData({
      isButton: false
    })
    if (this.regUrl(this.data.url)) {
      this.parseVideo();
    } else {
      this.showToast('请复制短视频平台分享链接后再来')
      this.setData({
        isButton: true
      })
    }
  },
  // 视频解析
  parseVideo: function () {
    var that = this;
    var params = {
      url: this.data.url
    };
    request.post('/video/getInfo', params, this, function (res) {
      if (res.code != 1) {
        that.showToast('解析失败请检查链接正确性,或重试一次')
      } else {
        let url = res.data.url
        if (!url) {
          that.showToast('解析失败')
        } else {
          if (url.indexOf("https") == -1) {
            url = url.replace('http', 'https')
          }
          that.setData({
            isShow: true,
            url: url,
            videoUrl: res.data.videoUrl,
            videoTitle: res.data.videTitle
          })
        }
      }
      that.setData({
        isButton: true
      })
    }, function (res) {
      console.error(res)
    })
  },
  hideModal() {
    this.setData({
      isShow: false,
      isUrlDownload: false
    })
  },
  saveVideo() {
    let that = this
    that.setData({
      isDownload: true,
    })
    var t = this;
    wx.getSetting({
      success: function (o) {
        o.authSetting['scope.writePhotosAlbum'] ? t.download() : wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            t.download()
          },
          fail: function (o) {
            t.setData({
              isDownload: false,
              isShow: false,
            })
            wx.showModal({
              title: '提示',
              content: '视频保存到相册需获取相册权限请允许开启权限',
              confirmText: '确认',
              cancelText: '取消',
              success: function (o) {
                o.confirm ? (wx.openSetting({
                  success: function (o) {}
                })) : ''
              }
            })
          }
        })
      }
    })
  },
  download: function () {
    var t = this;
    request.get('/video/getDownloadUrl',{url: t.data.url},this,
      res=> {
        t.setData({
          downloadUrl: res.data
        })
        wx.downloadFile({
          url: t.data.downloadUrl,
          success: function (o) {
            wx.saveVideoToPhotosAlbum({
              filePath: o.tempFilePath,
              success: function (o) {
                t.showToast('视频保存成功')
                t.setData({
                  isDownload: false,
                  isShow: false,
                })
                // 扣分
                request.get('/user/minusPoints', {}, this,
                  (res) => {
                    // console.log('减分成功：', res.data)
                  },
                  (err) => {
                    console.log('扣分失败')
                  }
                );
              },
              fail: function (o) {
                t.showToast('视频保存失败')
                t.setData({
                  isDownload: false,
                })
              }
            })
          },
          fail: function (o) {
            t.setData({
              isUrlDownload: true,
              isDownload: false,
            })
          }
        })
      },
      err=>{
        console.error('获取下载链接失败')
      }
    )

  },
  onShareAppMessage: function () {
    return {
      path: '/pages/welfare/home/home',
    }
  },
  copyUrl: function () {
    // console.log(event.currentTarget.dataset.url);
    wx.setClipboardData({
      data: this.data.videoUrl,
    });
    // 扣分
    request.get('/user/minusPoints', {}, this,
      (res) => {
        // console.log('减分成功：', res.data)
      },
      (err) => {
        console.log('扣分失败')
      }
    );
  },
  showToast: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  paste: function () {
    wx.getClipboardData({
      success: res => {
        var str = res.data.trim()
        console.log(str)
        if (this.regUrl(str)) {
          request.post('/video/getInfo', {
              url: this.findUrlByStr(str)[0]
            }, this,
            res => {
              if (res.code == 1) {
                this.setData({
                  url: res.data.url,
                  videoUrl: res.data.videoUrl,
                  videoTitle: res.data.videoTitle
                })
              }
            }
          )
        } else {
          wx.showToast({
            icon: 'error',
            title: '无效的链接',
          })
        }
      },
      fail: err=>{
        wx.showToast({
          icon: 'error',
          title: '粘贴失败！',
        })
      }
    })
  }
})