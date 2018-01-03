<style lang="scss">
#nav {
    margin: 0;
    padding: 0;
    background-color: black;
    height: 100vh;
    li {
        list-style-type: none;
        padding: 5%;
        width: 90%;
        color: white;
        &:hover {
            cursor: pointer;
            box-shadow: 0 0 .3rem gray inset;
        }
    }
    .currentScreen {
        background-color: gray;
    }
}
@media(max-width: 1080px) {
    #nav {
        li {
            font-size: .9rem;
        }
    }
}
</style>
<template>
<div class="side-panel" v-bind:class="">
    <!-- put bars here for mobile -->
    <ul id="nav">
        <li :class="{ currentScreen: users }" v-on:click="go('users')">Business Users</li>
        <li :class="{ currentScreen: services }" v-on:click="go('services')">Services and Categories</li>
        <li :class="{ currentScreen: settings }" v-on:click="go('settings')">My Settings</li>
    </ul>
</div>
</template>
<script>
export default {
    data: function() {
        return {
            users: false,
            services: false,
            settings: false
        };
    },
    methods: {
        go: function (location) {
            this.$router.push(location);
        }
    },
    created: function() {
        switch(this.$route.name) {
            case 'users':
                this.users = true;
                break;
            case 'services':
                this.services = true;
                break;
            case 'settings':
                this.settings = true;
                break;
            default:
                this.users = true;
                break;
        }
    }
}
</script>
