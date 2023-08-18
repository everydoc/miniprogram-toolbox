//引入
const http = require('../utils/http')

//获取列表
export async function getHomeListApi(parm){
  return await http.GET("/survey/app/getList",parm)
}

//查询问卷详情列表
export async function getDetailsApi(parm){
  return await http.GET("/survey/app/getDetail",parm)
}

//根据问卷id查询试题列表
export async function getPaperListApi(parm){
  return await http.GET("/survey/app/getPaperList",parm)
}

//问卷提交
export async function saveCommitApi(parm){
  return await http.POST("/survey/app/commitSurvey",parm)
}

//我的页面列表
export async function  getMyQuestionListApi(params) {
  return await http.GET("/survey/app/getMyQuestionList",params)
}

//试题回显
export async function getMyPaperListShowApi(params) {
  return await http.GET("/survey/app/getPaperListShow",params)
}
