import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from '../components/user/Users.vue'
// 路由懒加载方式
const Login = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/Login')
const Home = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/Welcome')
const Rights = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/power/Roles')
const Cate = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/goods/Params')
Vue.use(VueRouter)
const routes = [
  // 重定向根组件到登录组件
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      // 因为这个Welcome 是home下面的子组件 所以在home 下面
      // 二级路由 的页面   重定向在 welcome 页面
      { path: '/home', redirect: '/welcome' },
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params }
    ]
  }
]
const router = new VueRouter({
  routes
})
// 路由守卫 "遍历路由之前做操作"
// to   将要访问的路径
// form   从哪里来
// next  代表下一步要进行什么操作
router.beforeEach((to, form, next) => {
  // 可如果是登录页  可以进行下一步
  if (to.path === '/login') {
    return next()
  }
  // 如果不是登录页,判断用户是否有登录依据 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果 tokenStr 为空 则代表没有登录 取反为真
  if (!tokenStr) {
    return next('/login')// 跳转到 /login
  }
  // 如果tokenStr为真 '有tokenStr值' 有登录 那么执行下一步
  next()
})
export default router
