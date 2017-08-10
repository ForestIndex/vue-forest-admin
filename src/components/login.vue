<style lang="scss">
.error {
    color: red;
    font-size: .9rem;
    font-family: sans-serif;
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
}
</style>
<template>
<section class="fullScreen">
    <form class="loginPanel">
        <h3>Forest Index Admin Login</h3>
        <input type="text" v-model="login.username" placeholder="Email or username" />
        <input type="password" v-model="login.password" placeholder="Password" />
        <button class="submit" v-on:click="submit" >Login</button>
        <span v-if="badLogin" class="error">Invalid username or passowrd</span>
    </form>
</section>
</template>
<script>
import env from '../env';

export default {
    data: function() {
        return {
            host: '',
            login: {
                username: '',
                password: ''
            },
            badLogin: false
        };
    },
    methods: {
        submit: function() {
            const url = `${this.host}/api/login`;
            this.$http.post(url, this.login)
            .then((res) => {
                if (res.body.token) {
                    const dt = new Date();
                    dt.setDate(dt.getDate() + 1);
                    this.$cookies.set('forestryservices',res.body.token, dt);
                    this.$router.push('users');
                } else this.badLogin = true;
            })
            .catch((res) => {
                if (res.status === 403) this.badLogin = true;
                else console.log(res);
            });
        }
    },
    created: function() {
        const e = env();
        this.host = e.API_HOST;
    }
}
</script>