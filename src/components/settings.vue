<style lang="scss">
#admins {
    margin-left: 0;
    padding-left: 0;
    h2 {
        padding-left: 4%;
    }
}
.logout {
    margin: 1% 3.5%;
    width: 20%;
    background-color: #dbdbdb;
    padding: 1% 0;
}
</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col" id="admins">
            <img class="headerImg" src="./forestindex3.png"/>
            <h2>Settings</h2>
            <button class="logout" v-on:click="logout">Logout</button>
            <ul>
                <block v-bind:key="adm._id" v-for="adm in admins" :admin="adm"></block>
            </ul>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import env from '../env';
import block from './adminBlock.vue';

export default {
    components: {
        navigation: navigation,
        block: block
    },
    methods: {
        getAdmins: function() {
            this.$http.get(`${this.API_HOST}/api/admins?token=${this.token}`)
            .then((res) => {
                if (res.ok) {
                    this.admins = res.body.filter((a) => a.username !== 'sysadmin');
                } else {
                    this.$router.push('login');
                }
            }, (res) => {
                console.log(res);
            });
        },
        logout: function() {
            this.$cookies.remove('forestryservices');
            setTimeout(() => {
                this.$router.push('login');
            }, 0);
        }
    },
    data: () => {
        return {
            API_HOST: null,
            token: null,
            admins: []
        };
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        this.token = this.$cookies.get('forestryservices');
        this.getAdmins();
    }
}
</script>