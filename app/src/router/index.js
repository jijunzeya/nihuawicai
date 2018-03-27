import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login.vue'], resolve)
    },
    {
      path: '/test',
      name: 'test',
      component: resolve => require(['@/pages/test.vue'], resolve)
    },
    {
      path: '/chatroom',
      name: 'chatroom',
      component: resolve => require(['@/pages/chatroom/index.vue'], resolve)
    },
    {
      path: '/game',
      name: 'game',
      component: resolve => require(['@/pages/game/index.vue'], resolve)
    }
  ]
})
