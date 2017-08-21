<style lang="scss">
.error {
    color: #ae2222;
    font-size: .9rem;
    font-family: sans-serif;
    border: none;
    width: 100%;
    margin: .5% 0;
    padding: 0;
    text-align: center;
}
.loginPanel {
    text-align: center;
    width: 50%;
    margin: 5% 25%;
    padding: 3% 0;
    background-color: gray;
    h3 {
        color: white;
    }
    input {
        width: 78%;
        margin: 1% 10%;
        padding: 1%;
    }
    img {
        width: 2%;
        vertical-align: middle;
    }
}
</style>
<template>
<section class="fullScreen">
    <form class="loginPanel">
        <h3>Forest Index Admin Login</h3>
        <input type="text" v-model="login.username" placeholder="Email or username" />
        <input type="password" v-model="login.password" placeholder="Password" />
        
        <h5 v-if="badLogin" class="error">Invalid Credentials</h5>
        <h5 class="error">{{ errMessage }}</h5>

        <button class="submit" v-on:click="submit" >Login</button>
        <img v-if="loading" src="./loading_wheel.gif" alt="loading..."/>
    </form>
</section>
</template>
<script>
import env from '../env';

export default {
    data: function() {
        return {
            loading: false,
            host: '',
            login: {
                username: '',
                password: ''
            },
            badLogin: false,
            errMessage: ''
        };
    },
    watch: {
        'login.password': function() {
            this.badLogin = false;
            this.errMessage = '';
        },
        'login.username': function() {
            this.badLogin = false;
            this.errMessage = '';
        }
    },
    methods: {
        submit: async function() {
            this.loading = true;
            const url = `${this.host}/api/login`;
            this.$http.post(url, this.login)
            .then((res) => {
                if (res.body.token && res.ok) {
                    const dt = new Date();
                    dt.setDate(dt.getDate() + 1);

                    this.$cookies.set('forestryservices', res.body.token, dt);
                    setTimeout(() => {
                        this.$router.push('users');
                    }, 2000);
                } else {
                    this.badLogin = true;
                    this.loading = false;
                }
            }, (res) => {
                this.errMessage = res.bodyText;
                this.badLogin = true;
                this.loading = false;
            });
        }
    },
    created: function() {
        const e = env();
        this.host = e.API_HOST;
    }
}
</script>