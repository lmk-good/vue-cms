import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login')
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home'),
    redirect: '/Welcome',
    children: [
      {
        path: '/Welcome',
        name: 'Home',
        component: () => import('../views/Welcome')
      },
      {
        path: '/users',
        component: () => import('../components/users/User')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles')
      }
    ]
  }
]

const router = new Router({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行 next('/login') 强制跳转
  if (to.path === 'Login') return next()
  // 获取token
  const tokenStr = JSON.stringify(window.sessionStorage.getItem('token'))
  console.log(tokenStr)
  if (!tokenStr) return next('/Login')
  next()
})

export default router
