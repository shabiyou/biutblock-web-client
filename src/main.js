// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import './assets/css/reset.css'
import './assets/css/public.scss'
import './assets/common/font.css'

import i18n from './utils/index'
import axios from 'axios'
import qs from 'qs'

import './utils/global.js'

import Element from 'element-ui'
import 'babel-polyfill'

//金额，分开
import {currency} from './utils/currency'
Vue.filter("currency",currency)

axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false


Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

let httpHeaderOption = {
  'content-type': 'application/json'
}
let fetch = require('node-fetch')

//获取钱包余额 BIUT、BIU
Vue.prototype.getWalletBalance = async (address,type) => {
  let url = _const.url
  if (type == 'biu') {
    url = _const.url_sen
  }
  let bodyRequest = {
    'method': 'sec_getBalance',
    'params': ["" + address + ""]
  }
  const text = await fetch(url, {
    method: 'post',
    body: JSON.stringify(bodyRequest), // request is a string
    headers: httpHeaderOption
  }).then((res) => res.json())

  let amount = JSON.parse(text.body).result.value
  return amount
}

//获取上传url
Vue.prototype.funDownload = function (filename, content) {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content], { type: "application/octet-stream" });
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);// 触发点击
  eleLink.click();
  document.body.removeChild(eleLink);
}

//下载文件方法
Vue.prototype.getObjectURL = function (file) {
  var url = null;
  if (window.createObjcectURL != undefined) {
    url = window.createOjcectURL(file);
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

//input输入框不能输入空格跟中文
Vue.prototype.inputNull = function (ipt) {
  let ipts = ipt.replace(/[\u4E00-\u9FA5]/g, '').replace(/\s+/g, '')
  return ipts
}

//科学计算法转化成数字
Vue.prototype.scientificNotationToString = function (param) {
  let strParam = String(param)
  let flag = /e/.test(strParam)
  if (!flag) return param
  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}

//判断是否是移动端
Vue.prototype.ismobile = function () {
  var mobileArry = ["iPhone", "iPad", "Android", "Windows Phone", "BB10; Touch", "BB10; Touch", "PlayBook", "Nokia"];
  var ua = navigator.userAgent;
  var res = mobileArry.filter(function (arr) {
    return ua.indexOf(arr) > 0;
  });
  return res.length > 0;
}

//截取小数点后八位
Vue.prototype.getPointNum = function (num, n) {
  let str = String(num);
  let index = str.indexOf(".");
  let str1 = str.substring(0,index+n+1);
  str1 = Number(str1);
  return str1;
}

new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app')
