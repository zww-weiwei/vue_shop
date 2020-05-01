import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/Login'
import Home from './../components/Home'
import Welcome from './../components/Welcome'
import Users from './../components/users/Users'
import Rights from './../components/power/Rights'
import Roles from './../components/power/Roles'
import Categories from './../components/goods/Categories'
import Params from './../components/goods/Params'
import List from './../components/goods/List'
import Add from './../components/goods/Add'
import Order from './../components/order/Order'
import Report from './../components/report/Report'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token 强制跳转登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
