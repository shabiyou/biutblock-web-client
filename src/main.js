// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import './assets/css/reset.css'
import './assets/css/public.scss'
//import './assets/common/font.css' 使用字体

import i18n from './utils/index'
import axios from 'axios'
import qs from 'qs'
// import Vconsole from 'vconsole'
import './utils/global.js'
import store from '../store'
import Element from 'element-ui'
import 'babel-polyfill'

import cal from './utils/calculation'
import { resolve } from 'url'
import { rejects } from 'assert'
const request = require('request')
Vue.prototype.cal = cal

axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

/**打开移动端浏览器debug */
// const vConsole = new Vconsole()
// Vue.use(vConsole)

let httpHeaderOption = {
  'content-type': 'application/json',
  'access-control-allow-origin' : '*',
  'access-control-allow-headers': '*'
}
let fetch = require('node-fetch')

//获取钱包余额 BIUT、BIU
Vue.prototype.getWalletBalance = async (address, type) => {
  let url = _const.url
  let token = 'SEC'
  if (type === 'biu') {
    url = _const.url_sen
    token = 'SEN'
  }
  let bodyRequest = {
    'method': 'sec_getBalance',
    'params': [address, token]
  }

  const text = await new Promise((resolve, rejects) => {
    request({
      url: url,
      method: 'POST',
      body: bodyRequest,
      json: true
    }, (err, res, body) => {
      resolve(body.body)
    })
  })

  let amount = JSON.parse(text).result.value.Balance
  return amount
}

Vue.prototype.getAllWalletBalance = async (address, type) => {
  let url = _const.url
  let token = 'SEC'
  let amount = 0
  if (type === 'biu') {
    url = _const.url_sen
    token = 'SEN'
  }
  for (let addr of address) {
    let bodyRequest = {
      'method': 'sec_getBalance',
      'params': [addr, token]
    }
    let text = await fetch(url, {
      method: 'post',
      body: JSON.stringify(bodyRequest), // request is a string
      headers: httpHeaderOption
    }).then((res) => res.json())
    amount = amount + Number(JSON.parse(text.body).result.value.Balance)
  }
  return amount
}

Vue.prototype.getNonce = async function (address) {
  let nonceData = {
    "jsonrpc": "2.0",
    "id":"1",
    'method': 'sec_getNonce',
    "params": [""+address+""]
  }
  let body = await fetch(_const.url, {
    method: 'post',
    body: JSON.stringify(nonceData), // request is a string
    headers: httpHeaderOption
  }).then((res) => res.json())
  let nonce = JSON.parse(body.body).result.Nonce
  return nonce
}

Vue.prototype.updateWalletBalance = async function (wallet) {
  let address = wallet.walletAddress.replace('0x', '')
  let walletSEC = await this.getWalletBalance(address, 'biut')
  let walletSEN = await this.getWalletBalance(address, 'biu')
  let nonce = await this.getNonce(address)
  let freezeAmount = '0'
  let timeLocks = []
  let availibleAmount = walletSEC
  let poolAddress = []
  for (let pool of wallet.mortgagePoolAddress) {
    poolAddress.push(pool.replace('0x', ''))
  }
  for (let pool of wallet.ownPoolAddress) {
    poolAddress.push(pool.replace('0x', ''))
  }
  poolAddress = Array.from(new Set(poolAddress))
  let contracts = await this.getContractInfoSync(poolAddress)

  for (let i = 0; i < contracts.length; i++) {
    if (contracts[i].timeLock) {
      timeLocks.push(contracts[i].timeLock)
    }
  }
  for (let timelock of timeLocks) {
    if (address in timelock && address in timelock[address]) {
      let benifits = timelock[address][address]
      for (let benifit of benifits) {
        freezeAmount = this.cal.accAdd(freezeAmount, benifit.lockAmount)
      }
    }
  }

  return {
    walletBalance: Number(this.cal.accAdd(freezeAmount, availibleAmount)),
    freezeAmount: freezeAmount,
    availibleAmount: availibleAmount,
    walletBalanceSEN: walletSEN,
    nonce: nonce
  }
}

Vue.prototype.getContractInfo = (contractAddress, callback) => {
  let rpcMethod = 'sec_getContractInfo'
  let url = _const.url
  let bodyRequest = {
    'method': rpcMethod,
    'params': [contractAddress]
  }
  fetch(url, {
    method: 'post',
    body: JSON.stringify(bodyRequest),
    headers: httpHeaderOption
  }).then(res => {
    return res.json()
  }).then(json => {
    callback(JSON.parse(json.body).contractInfo)
  })
}

Vue.prototype.getContractInfoSync = async (pools) => {
  let contractInfos = []
  for (let i in pools) {
    let bodyRequest = {
      'method': 'sec_getContractInfo',
      'params': [pools[i]]
    }
    let response = await fetch(_const.url, {
      method: 'post',
      body: JSON.stringify(bodyRequest),
      headers: httpHeaderOption
    }).then((res) => {
      return res.json()
    })
    contractInfos.push(JSON.parse(response.body).result.contractInfo)
  }
  return contractInfos
}

Vue.prototype.createOwnContract = async (transfer) => {
  let bodyRequest = {
    'method': 'sec_createContractTransaction',
    'params': transfer
  }
  let response = await fetch(_const.url, {
    method: 'post',
    body: JSON.stringify(bodyRequest),
    headers: httpHeaderOption
  }).then((res) => {
    return res.json()
  })
  return transfer.sendToAddress
}

//获取上传url
Vue.prototype.funDownload = function (filename, content) {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content], {
    type: "application/octet-stream"
  })
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink); // 触发点击
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
Vue.prototype.getPointNum = function (num) {
  let str = String(num);
  return str.split('.').map((item, idx) => idx === 0 ? item.replace(/\B(?=(\d{3})+$)/g, ',') : item.substring(0, 8)).join('.').replace(/(?:(\.\d*[1-9])0+|\.0*)$/, '$1')
}

//下载文件方法
Vue.prototype.getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]);
  return null;
}

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App,
  },
  template: '<App/>'
}).$mount('#app')
