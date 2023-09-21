const app = getApp();
const request = require('../../utils/request.js');
var that;
Page({
  data: {
    url: '',
    videoUrl: '',
    videoTitle: '',
    downloadUrl: '',
    isShow: false,
    isDownload: false,
    isButton: true,
    isParsing: false
  },
  onLoad(options) {
    that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })

    request.get('/video/getTips',{},this,res=>{
      if(res.code == 1){
        that.setData({
          info: res.data
        })
      }
    })
  },
  onShow(){
    if (wx.getPrivacySetting){
      wx.getPrivacySetting({
        success: res => {
          if (res.needAuthorization) {
            this.setData({
              modalName: 'dialogPrivacy',
              privacyContractName: res.privacyContractName
            })
          }
        },
        fail: () => {
          console.log('get privacy setting failed')
        }
      })
    } else {
      console.log('隐私保护政策暂不可用')
    }
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
    request.post('/video/getInfoOss', params, this, function (res) {
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
                  success: function (o) {
                    console.log(o.authSetting)
                  }
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
              },
              fail: function (o) {
                console.log(o)
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
  onShareAppMessage: function () {
    return {
      title: '短视频去水印',
      path: '/pages/index/index',
    }
  },
  onShareTimeline: function () {
    return {
      title: '短视频去水印',
      path: '/pages/index/index',
    }
  },
  copyUrl: function () {
    // console.log(event.currentTarget.dataset.url);
    wx.setClipboardData({
      data: this.data.videoUrl,
    });
  },
  showToast: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  paste () {
    wx.getClipboardData({
      success: res => {
        var str = res.data.trim()
        // console.log(str)
        if (this.regUrl(str)) {
          request.get('/video/getInfoOss', {
              url: this.findUrlByStr(str)[0]
            }, this,
            res => {
              if (res.code == 1) {
                this.setData({
                  url: res.data.url,
                  videoUrl: res.data.videoUrl,
                  videoTitle: res.data.videoTitle,
                  downloadUrl: res.data.downloadUrl
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