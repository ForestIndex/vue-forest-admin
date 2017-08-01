<style lang="scss">
#nav {
    // width: 100%;
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
</style>
<template>
<span>
    <!-- put bars here for mobile -->
    <ul id="nav">
        <li :class="{ currentScreen: users }" v-on:click="go('users')">Business Users</li>
        <li :class="{ currentScreen: services }" v-on:click="go('services')">Services and Categories</li>
        <li :class="{ currentScreen: settings }" v-on:click="go('settings')">My Settings</li>
    </ul>
</span>
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
            default:
                break;
        }
    }
}
</script>