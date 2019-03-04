import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000
var loadinginstace
axios.interceptors.request.use(config => {
  // element ui Loading方法
  // loadinginstace = Loading.service({
  //   fullscreen: true
  // })
  return config
}, error => {
  // loadinginstace.close()
  // Message.error({
  //   message: '加载超时'
  // })
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
  //loadinginstace.close()
  return data
}, error => {
  // loadinginstace.close()
  // Message.error({
  //   message: '加载失败'
  // })
  return Promise.reject(error)
})

// 数据请求
const requestData = function (mark, data, options = {}) {
  const {
    raw
  } = options;
  return axios({
    url: mark,
    method: 'post',
    baseURL: 'http://39.108.137.8:8099/v1.0/',
    // headers: {
    //   'token': store.state.token
    // },
    data: qs.stringify(data || {})
  }).then(function (result) {
    // if (result.data.resp_code === "000005") {
    //   alert('请登陆后重试...')
    //   sessionStorage.clear()
    //   this.$router.push({path:'/'})
    //   return
    // }
    return result.data;
  }, function (error) {
    //alert('系统出错，请稍后重试...')
    return
  })
}
// 挂载
const install = function (Vue, options) {
  Vue.$axios = axios
  Vue.prototype.$axios = axios
  Vue.$requestData = requestData
  Vue.prototype.$requestData = requestData
}

export default {
  install,
  axios,
  requestData
}
