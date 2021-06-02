import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局css样式
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
// 设置基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//  每个请求都需要带上 token,因为这个token用于校验是否登录
axios.interceptors.request.use(config => {
  // 读取sessionStorage 中保存的token值 , 作为Authorization这个字段 传到服务器
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 因为多个组件需要发起请求,所以将axios挂载到vue函数中
// 挂载在vue的原型上 所有的vue实例都有http方法
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
