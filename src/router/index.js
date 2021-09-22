import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Users from '@/components/Users'
import Right from '@/components/Right'
import Roles from '@/components/Roles'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    alias: '/'
  },
  {
  	path: '/home',
  	name: 'Home',
  	component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Right,
      },
      {
        path: '/roles',
        component: Roles,
      }
    ],
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if ( to.path === '/login' ){
    return next()
  }

  const token = sessionStorage.token

  if ( !token ){
    return next('/login')
  }

  next()
})

export default router
