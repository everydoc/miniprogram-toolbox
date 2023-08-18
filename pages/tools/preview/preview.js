import request from '../../../utils/request.js'

var app = getApp()
var that
Page({
  data: {
    imageUrls: null,
    videoList: [],
    currentPage: 1,
    hasNextPage: true,
    hasPreviousPage: false,
    totalPage: 1,
    total: 0,
    isAdmin: false
  },
  onLoad: function () {
    that = this
    this.setData({
      imageUrl: app.globalData.imageUrl,
      isAdmin: app.globalData.isAdmin
    })
    that.getImageList()
  },
  getImageList() {
    request.get(
      '/image/getLatestImageList', {
        pageIndex: that.data.currentPage
      }, this,
      function (res) {
        that.setData({
          videoList: res.data.list,
          imageUrls: res.data.list.map(a => that.data.imageUrl + a.folderName + '/' + a.realName),
          hasPreviousPage: res.data.hasPreviousPage,
          hasNextPage: res.data.hasNextPage,
          total: res.data.total,
          totalPage: res.data.totalPage,
          currentPage: that.data.currentPage + 1
        })
      },
      function (err) {
        console.log(err)
        wx.showToast({
          title: '加载失败，下拉刷新',
        })
      }
    )
  },
  nextPage() {
    that.setData({
      currentPage: that.data.currentPage + 1
    })
    this.getImageList(that.data.currentFolder)
  },
  previousPage() {
    that.setData({
      currentPage: that.data.currentPage - 1
    })
    this.getImageList(that.data.currentFolder)
  },

  // 删除文件夹
  deleteImage(e) {
    console.log(e.target)
    wx.request({
      url: app.globalData.baseURL + '/image/deleteImage',
      data: {
        realName: e.target.id
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 1) {
          if (res.data.data.succeed) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500,
              success() {
                setTimeout(() => {
                  console.log("删除成功")
                  that.getImageList(that.data.currentFolder)
                }, 1500);
              }
            });
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'success',
              duration: 1500
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.message
          })
        }
      }
    })
  },

  // 下载视频
  downloadImage(e) {
    console.log(e.target.id)
    wx.showLoading({
      title: '图片下载中'
    });
    wx.downloadFile({
      url: app.globalData.baseURL + '/image/download?folderName=' + that.data.currentFolder + '&imageName=' + that.data.videoList[e.target.id].imageName,
      filePath: wx.env.USER_DATA_PATH + '/' + that.data.videoList[e.target.id].realName,
      header: {
        'content-type': 'application/json',
        'Cookie': wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        console.log('path:' + res.filePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.filePath,
          success: function (res) {
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'success',
          duration: 1000
        })
        console.log('download image failed')
      }
    })
  },

  preview(e) {
    // console.log(e.target)
    // 这里减一分
    wx.previewImage({
      urls: that.data.imageUrls,
      current: that.data.imageUrls[e.target.id]
    })
    request.get('/user/minusPoints', {}, this,
      (res) => {
        // console.log('减分成功：', res.data)
      },
      (err) => {
        console.log('扣分失败')
      }
    );
  },
  onPullDownRefresh() {
    // this.previousPage();
    console.log('下拉刷新')
    that.setData({
      currentPage: 1
    })
    this.getImageList()
  },
  onReachBottom() {
    that.setData({
      isAdmin: app.globalData.isAdmin
    })
    // 下拉一页也要减少1分
    if (that.data.videoList.length < that.data.total) {
      request.get(
        '/image/getLatestImageList', {
          pageIndex: that.data.currentPage
        },
        this,
        function (res) {
          that.setData({
            videoList: that.data.videoList.concat(res.data.list),
            imageUrls: that.data.imageUrls.concat(res.data.list.map(a => that.data.imageUrl + a.folderName + '/' + a.realName)),
            hasPreviousPage: res.data.hasPreviousPage,
            hasNextPage: res.data.hasNextPage,
            total: res.data.total,
            totalPage: res.data.totalPage,
            currentPage: that.data.currentPage + 1
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
        function (err) {
          console.log(err.data)
        }
      )
    }
  },
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '每日美图'
        })
      }, 2000)
    })
    return {
      title: '美图分享',
      path: '/pages/gallery/preview/preview',
      promise
    }
  }
})