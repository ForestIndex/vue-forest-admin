<style lang="scss">
.small-block {
    box-shadow: 0 0 .5rem gray;
    padding: 5%;
}
</style>
<template>
<li class="block small-block">
    <h5>{{ admin.username }}</h5>
    <input type="password" v-model="newPassword" placeholder="New password" />
    <input type="password" v-model="checkPassword" placeholder="Retype password" />
    <button class="submit" v-on:click="save">Save Changes</button>
    <span class="error">{{ errorMessage }}</span>
    <span class="green" v-if="showSaved">Saved Changes <i class="fa fa-check" aria-hidden="true"></i></span>
</li>
</template>
<script>
import navigation from './navigation.vue';
import env from '../env';

export default {
    props: [
        'admin'
    ],
    components: {
        navigation: navigation,
    },
    watch: {
        newPassword: function() { this.errorMessage = ''; },
        checkPassword: function() { this.errorMessage = ''; }
    },
    methods: {
        save: function() {
            if (this.newPassword && this.newPassword.length > 0) {
                if (this.newPassword.length < 8) this.errorMessage = 'Password must be at least 8 characters.'
                else if (this.newPassword !== this.checkPassword) this.errorMessage = 'Passwords do not match.'
                else {
                    this.$http.post(`${this.API_HOST}/api/users/${this.admin._id}?token=${this.token}`, { password: this.newPassword })
                    .then((res) => {
                        if (res.ok) {
                            this.showSaved = true;
                            this.newPassword = null;
                            this.checkPassword = null;
                            setTimeout(() => {
                                this.showSaved = false;
                            }, 2000);
                        } else this.errorMessage = 'There was an error saving changes';
                    }, (res) => {
                        this.errorMessage = 'There was an error saving changes...';
                        console.log(res);
                    });
                }
            }
        }
    },
    data: () => {
        return {
            token: null,
            API_HOST: null,
            newPassword: null,
            checkPassword: null,
            errorMessage: '',
            showSaved: false
        };
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        this.token = this.$cookies.get('forestryservices');
    }
}
</script>