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

Vue.config.productionTip = false

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
}).$mount('#app')
