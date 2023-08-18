Page({
  data: {
    PageCur: 'tools'
  },
  NavChange(e) {
    // console.log(e.currentTarget.dataset)
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '天府书虫',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})