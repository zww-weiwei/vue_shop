// 主程序入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入字体图标样式
import './assets/fonts/iconfont.css'
// 引入全局样式表
import './assets/css/global.css'
// 引入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 为axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 将树形表格插件注册为全局组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
