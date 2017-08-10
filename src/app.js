import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import attachFastClick from 'fastclick';
import ElementUI from 'element-ui';
import vueCookies from 'vue-cookies';

Vue.use(VueRouter);
Vue.use(vueCookies);
Vue.use(VueResource);
Vue.use(ElementUI);

Vue.http.interceptors.push((request, next) => {
    request.credentials = true;
    next();
});

const routes = [
  {
    path: '/users',
    component: require('./components/users.vue'),
    name: 'users'
   },
   {
     path: '/login',
     component: require('./components/login.vue'),
     name: 'login'
   },
    {
      path: '/services',
      component: require('./components/services.vue'),
      name: 'services'
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

attachFastClick(document.body);
