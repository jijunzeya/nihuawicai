import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)

let router = new Router({
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

router.beforeEach((to, from, next) => {
  // if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
  console.log('@@##router.beforeEach ' + to.path);
  let token = Vue.getCache('token', 'session');
  token = '11';
  if (token) {  // 通过vuex state获取当前的token是否存在
    console.log('@@##router token pass');
    next();
    // checkPermission(to, from, next);
  } else if (to.path !== '/login') {
    console.log('@@##router.beforeEach 无token返回重新登录');
    next({
      path: '/login'  // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
  } else {
    next();
  }
});

export default router;
