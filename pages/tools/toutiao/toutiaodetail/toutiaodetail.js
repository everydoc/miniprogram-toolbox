//index.js
//注意！基础库【2.9.0】起支持 2d 模式，如不显示请检查基础库版本！
import uCharts from '../../../../utils/u-charts.min.js';
const app = getApp();
const request = require('../../../../utils/request.js');
var uChartsInstance = {};
var that;
Page({
  data: {
    cWidth: 750,
    cHeight: 500,
    pixelRatio: 1,
    userList: [],
    content: {
      article: [],
      video: []
    }
  },
  onLoad(options) {
    that = this;
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    const pixelRatio = wx.getSystemInfoSync().pixelRatio;
    this.setData({
      cWidth,
      cHeight,
      pixelRatio
    });

    // that.setData({

    // })
    // console.log(options)
    // this.getUserList();
    // this.getChartsData(options.token)
    this.getUserStat(options.token)
  },
  getChartsData(token) {
    request.get('/toutiao/statistics_last_7_days', {
        token: token
      }, this,
      (res) => {
        if (res.code == 1) {
          this.drawCharts('userStat', res.data);
          // 扣分
          request.get('/user/minusPoints', {}, this,
            (res) => {
              // console.log('减分成功：', res.data)
            },
            (err) => {
              console.log('扣分失败')
            }
          );
        }
      }
    );
  },
  drawCharts(id, data) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#' + id).fields({
      node: true,
      size: true
    }).exec(res => {
      if (res[0]) {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width * this.data.pixelRatio;
        canvas.height = res[0].height * this.data.pixelRatio;
        uChartsInstance[id] = new uCharts({
          animation: true,
          background: "#FFFFFF",
          canvas2d: true,
          dataLabel: true,
          categories: data.categories,
          color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          context: ctx,
          extra: {
            column: {
              type: "group",
              width: 30,
              activeBgColor: "#000000",
              activeBgOpacity: 0.08
            },
            line: {
              type: "curve"
            }
          },
          height: this.data.cHeight * this.data.pixelRatio,
          legend: {},
          padding: [15, 15, 0, 5],
          pixelRatio: this.data.pixelRatio,
          series: data.series,
          type: "line",
          width: this.data.cWidth * this.data.pixelRatio,
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            data: [{
              min: data.min
            }]
          }
        });
      } else {
        console.error("[uCharts]: 未获取到 context");
      }
    });
  },
  tap(e) {
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
  },
  getUserStat(token) {
    that.setData({
      showCanvas: true
    })
    this.getChartsData(token)
    this.getUserArticleAndVideoInfo(token)
  },
  copyUrl(e) {
    wx.setClipboardData({
      data: 'https://www.toutiao.com/c/user/token/' + e.currentTarget.id
    });
  },
  copyArticle(e) {
    wx.setClipboardData({
      data: e.currentTarget.id
    });
  },
  getUserArticleAndVideoInfo(token) {
    request.get('/toutiao/getArticleAndVideo', {token: token}, this, 
      (res)=>{
        if(res.code == 1){
          that.setData({
            content: res.data
          })
        }
      },
      (err)=>{
        console.error(err)
      }
    )
  }
})