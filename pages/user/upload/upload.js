var app = getApp()
var that
Page({
  data: {
    imgList: [],
    folderName: null,
    video: null,
    size: 0,
    files: []
  },
  onLoad: function () {
    that = this
  },
  formSubmit: function (e) {
    var param = e.detail.value;
    // console.log(param)
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    // console.log('my param:' + JSON.stringify(param))
      if (that.data.files.length == 0) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: 'tip',
          content: 'choose one video'
        })
        return;
      }
      wx.showLoading({
        title: '图片上传中'
      });
      for (const file in that.data.files) {
        if (Object.hasOwnProperty.call(that.data.files, file)) {
          const element = that.data.files[file];
          wx.uploadFile({
            url: app.globalData.baseUrl + '/image/upload_new',
            method: 'POST',
            filePath: element.tempFilePath,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data',
              'Cookie': wx.getStorageSync('token')
            },
            formData: {
              folderName: that.data.folderName
            },
            success: function (res) {
              wx.hideLoading();
            },
            fail: function (r) {
              wx.hideLoading();
              console.log('upload file failed')
            }
          })
        }
      }
      
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 1500,
        success() {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/tools/preview/preview',
            })
          }, 1500);
        }
      })
  },
  checkName: function (name) {
    if (name.length < 2 || name.length > 32) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '文件名长度为2-32位字符'
      });
      return false;
    }
    return true;
  },
  checkMemo: function (memo) {
    if (memo.length > 32) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '备注信息长度为0-32位字符'
      });
      return false;
    }
    return true;
  },
  // 选择视频
  pickVideo() {
    wx.chooseMedia({
      mediaType: ["image"],
      sizeType: ["original"],
      camera: 'back',
      sourceType: ["album", "camera"],
      maxDuration: 60,
      success(res) {
        that.setData({
          files: res.tempFiles
        })
      }
    })
  }
})