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
// 因为多个组件需要发起请求,所以将axios挂载到vue函数中
// 挂载在vue的原型上 所有的vue实例都有http方法
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
