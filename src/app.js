import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import fastClick from 'fastclick';

import users from './components/users.vue';
import login from './components/login.vue';
import services from './components/services.vue';
import settings from './components/settings.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
    let token = window.localStorage.getItem(process.env.COOKIE_NAME);
    // console.log(request.url);
    // console.log(token);
    if (token) {
        request.headers = request.headers || {};
        request.credentials = true;
        request.headers.set('Accept', 'application/json');
        request.headers.set('Authorization', `${process.env.COOKIE_NAME}=${token}`);
    }
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
