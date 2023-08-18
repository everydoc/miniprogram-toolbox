var app = getApp()
var that

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    isAdmin: false
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached(){
      that = this;
      that.setData({
        isAdmin: app.globalData.isAdmin
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
