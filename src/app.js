import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import fastClick from 'fastclick';
import vueCookies from 'vue-cookies';

import users from './components/users.vue';
import login from './components/login.vue';
import services from './components/services.vue';
import settings from './components/settings.vue';

Vue.use(VueRouter);
Vue.use(vueCookies);
Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
    request.credentials = true;
    request.headers['Authorization'] = 'Bearer: ' + localStorage.getItem('forestryservices');
    next();
});

Vue.use(() => {
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        fastClick.attach(document.body);
    }, false);
  }
});

const routes = [
  {
    path: '/users',
    component: users,
    name: 'users'
   },
   {
     path: '/login',
     component: login,
     name: 'login'
   },
    {
      path: '/services',
      component: services,
      name: 'services'
    },
    {
      path: '/settings',
      component: settings,
      name: 'settings'
    }
];

const router = new VueRouter({
  routes,
  history: true
});

router.push('/users');

const app = new Vue({
  router
}).$mount('#app');
