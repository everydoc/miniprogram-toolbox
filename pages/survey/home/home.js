// pages/home/home.js
import {
  getHomeListApi
} from '../../../api/home'
var that;
const app = getApp();

Component({

  data: {
    total: 0, //总条数
    tableList: [], //列表数据
    parms: {
      currentPage: 1,
      pageSize: 20,
    }
  },

  // onLoad: function (options) {
  //   console.log('执行onLoad')
  //   this.getHomeList()
  //   //数据加载完后，停止下拉刷新
  //   wx.stopPullDownRefresh({
  //     success: (res) => {},
  //   })
  // },
  lifetimes: {
    attached() {
      that = this;

      console.log('执行onLoad')
      this.getHomeList()
      //数据加载完后，停止下拉刷新
      wx.stopPullDownRefresh({
        success: (res) => {},
      })

    }
  },
  methods: {
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      console.log('下拉刷新')
      //从第一页开始加载，把列表里面的数据清空
      this.data.parms.currentPage = 1
      this.setData({
        tableList: []
      })
      //重新加载
      // this.onLoad()
      this.getHomeList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      console.log('上拉触底')
      //判断是否还有下一页，若有，继续加载数据；若无，停止加载并提示信息
      let that = this
      // 计算总页数
      let totalPage = Math.ceil(that.data.total / that.data.parms.pageSize)
      if (that.data.parms.currentPage >= totalPage) {
        //没有下一页了
        wx.showToast({
          title: '没有更多数据了',
        })
      } else {
        that.setData({
          currentPage: that.data.parms.currentPage++
        })
        // that.onLoad()
      }
    },

    /**
     * 获取列表
     */
    async getHomeList() {
      that = this
      let res = await getHomeListApi(that.data.parms)
      if (res && res.code == 1) {
        console.log("getHomeListApi", res)
        that.setData({
          total: res.data.total,
          tableList: that.data.tableList.concat(res.data.list) //原数据合并
        })
        console.log(that.data)
      }
    },

    gotoDetail: function (e) {
      console.log(e)
      wx.redirectTo({
        url: 'pages/survey/detail/detail?questionId=' + e.currentTarget.dataset.questionid,
      })
    }
  }
})