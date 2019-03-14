// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI8n from 'vue-i18n'
import i18n from './utils/index'
import axios from 'axios'
import qs from 'qs'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'normalize.css'
import './assets/css/public.css'

import Element from 'element-ui'


axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

let httpHeaderOption = {
  'content-type': 'application/json'
}
let fetch = require('node-fetch')
//获取钱包余额
Vue.prototype.getWalletBalance = async (address)=> {
  let url = 'http://13.209.3.183:3001/rpctransfer/callrpc'
  let bodyRequest = {
    'method': 'sec_getBalance',
    'params': [""+address+""]
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
Vue.prototype.getObjectURL = function(file) {  
  var url = null;  
  if (window.createObjcectURL != undefined) {  
      url = window.createOjcectURL(file);  
  } else if (window.URL != undefined) {  
      url = window.URL.createObjectURL(file);  
  } else if (window.webkitURL != undefined) {  
      url = window.webkitURL.createObjectURL(file);  
  }  
  return url;  
}, 

Vue.config.productionTip = false

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app')
