// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'lib-flexible';
Vue.config.productionTip = false;
import './mint-ui';
import cache from './libs/cache-data';
Vue.use(cache);
// import './assets/css/common.less';
// import './assets/css/var.less';

/* eslint-disable no-new */
// import VueSocketio from 'vue-socket.io';
// Vue.use(VueSocketio, 'http://localhost:3000/chat');

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

