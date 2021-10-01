import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Users from '@/components/Users'
import Right from '@/components/Right'
import Roles from '@/components/Roles'
import GoodsCategory from '@/components/goods/Category'

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
        name: 'Welcome',
        component: Welcome,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Right,
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles,
      },
      {
        path: '/categories',
        name: 'Categories',  
        component: GoodsCategory,
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
