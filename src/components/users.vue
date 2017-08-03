<style lang="scss">
.block li { display: block; }
</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <user :states="states" :services="services" :categories="categories" v-on:refresh="getUsers" :key="user._id" v-for="user in users" :user="user"/>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import env from '../env';
import user from './userBlock.vue';
// import auth from '../toolbox/authorize';

export default {
    data: () => {
        return {
            users: [],
            services: [],
            categories: [],
            states: []
        };
    },
    components: {
        API_HOST: null,
        navigation: navigation,
        token: null,
        user: user
    },
    methods: {
        getUsers: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/allusers`);
            this.users = res.body.map((user) => user);
        },
        getServices: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/services`);
            this.services = res.body.map((service) => service);
            return Promise.resolve();
        },
        getCategories: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/categories`);
            this.categories = res.body.map((cat) => cat);
            return Promise.resolve();
        },
        getStates: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/states`);
            this.states = res.body.map((state) => state);
            return Promise.resolve();
        },
        // auth,
        controller: function() {
            return Promise.resolve()
            .then(() => this.getServices())
            .then(() => this.getCategories())
            .then(() => this.getStates())
            .then(() => this.getUsers());
        }
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        const token = this.$cookies.get('forestryservices');
        if (!token) this.$router.push('login');
        else this.controller();
    }
}
</script>
