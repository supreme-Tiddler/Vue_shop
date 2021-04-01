import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/Login'
Vue.use(VueRouter)
const routes = [
  // 重定向根组件到登录组件
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login }
]
const router = new VueRouter({
  routes
})
export default router
