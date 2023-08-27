const app = getApp()

function post(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'POST', sourceObj, successFun, failFun, completeFun)
}

function get(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'GET', sourceObj, successFun, failFun, completeFun)
}

function requestApi(url, params, method, sourceObj, successFun, failFun, completeFun) {
  if (method == 'POST') {
    // var contentType = 'application/x-www-form-urlencoded'
    var contentType = 'application/json'
  } else {
    var contentType = 'application/json'
  }
  params["openid"] = wx.getStorageSync('openid');
  wx.request({
    url: app.globalData.baseUrl + url,
    method: method,
    data: params,
    header: {
      'Content-Type': contentType
    },
    success: function (res) {
      typeof successFun == 'function' && successFun(res.data, sourceObj);
    },
    fail: function (res) {
      typeof failFun == 'function' && failFun(res.data, sourceObj)
    },
    complete: function (res) {
      typeof completeFun == 'function' && completeFun(res.data, sourceObj)
    }
  })
}

module.exports = {
  post,
  get
}