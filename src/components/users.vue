<style lang="scss">
.block li { display: block; }
.controls {
    background-color: black;
    color: white;
    width: 90%;
    padding: 5%;
    margin: 0;
    li {
        display: inline-block;
        padding: 0;
        margin: 0 2rem;
        vertical-align: middle;
    }
}
.headerImg {
    width: 20%;
}
.spinner {
    margin: 0 40%;
    padding: 0;
    width: 20%;
}
.center-msg {
    text-align: center;
    margin: 2% 0;
    font-size: 1.3rem;
}
</style>

<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <img class="headerImg" src="assets/forestindex3.png"/>
            <ul class="controls">
                <li>
                    Showing {{ users.length }} of {{ users.length }}
                </li>
                <li>
                    <button v-on:click="addUser">Add User</button>
                </li>
            </ul>
            <h6 class="small center-msg" v-if="users.length < 1 && !loading">There are no users in the database. Press "Add User" above to begin adding businesses.</h6>
            <img v-if="loading" class="spinner" src="assets/loading_wheel.gif" alt="loading..."/>
            <user :states="states" :services="services" :categories="categories" v-on:refresh="getUsers" :key="user._id" v-for="user in users" :user="user"/>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import user from './userBlock.vue';

export default {
    data: () => {
        return {
            loading: true,
            users: [],
            services: [],
            categories: [],
            states: []
        };
    },
    components: {
        navigation: navigation,
        user: user
    },
    methods: {
        addUser: function() {
            const newUser = {
                _id: 0,
                username: '',
                password: '',
                active: true,
                order: this.users.length,
                info: {
                    images: [],
                    description: '',
                    businessName: '',
                    phone: '',
                    email: '',
                    operationalCounties: [],
                    address: {
                        street: '',
                        city: '',
                        state: {},
                    },
                }
            };
            this.users.splice(0, 0, newUser);
        },
        getUsers: async function() {
            this.$http.get(`${process.env.API_HOST}/api/allusers`)
            .then((res) => {
                if (res.status === 200) {
                    this.users = res.body.map((user) => user);
                    this.loading = false;
                }
                else this.$router.push('login');
            }, (res) => {
                this.$router.push('login');
            });
        },
        getServices: async function() {
            const res = await this.$http.get(`${process.env.API_HOST}/api/services`);
            this.services = res.body.map((service) => service);
            return Promise.resolve();
        },
        getCategories: async function() {
            const res = await this.$http.get(`${process.env.API_HOST}/api/categories`);
            this.categories = res.body.map((cat) => cat);
            return Promise.resolve();
        },
        getStates: async function() {
            const res = await this.$http.get(`${process.env.API_HOST}/api/states`);
            this.states = res.body.map((state) => state);
            return Promise.resolve();
        }
    },
    created: function() {
        const token = window.localStorage.getItem(process.env.COOKIE_NAME);
        if (!token) this.$router.push('login');

        this.getServices();
        this.getCategories();
        this.getStates();
        this.getUsers();
    }
}
</script>
