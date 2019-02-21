import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/Welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
      ]
    }
  ]
})

// 给路由设置导航守卫
// 在守卫中对token进行监听,有token就让执行,否则就跳转到login页面
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  // 如果是login页面就通过
  if (to.path === '/login') {
    return next()
  }

  // 如果不是login就判断是否有token
  // 获取到token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }

  // 否则继续向下执行
  next()
})

export default router
