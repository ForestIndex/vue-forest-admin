<style lang="scss">
.block li { display: block; }
</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <user v-on:refresh="getUsers" :key="user._id" v-for="user in users" :username="user.username" :info="user.info" :active="user.active" :id="user._id"/>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import env from '../env';
import user from './userBlock.vue';
import auth from '../toolbox/authorize';

export default {
    data: () => {
        return {
            users: []
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
        auth
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        const token = this.$cookies.get('forestryservices');
        if (!token) this.$router.push('login');
        this.getUsers();
    }
}
</script>
