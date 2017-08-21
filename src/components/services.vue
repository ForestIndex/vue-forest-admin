<style lang="scss">

</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <img class="headerImg" src="./forestindex3.png"/>
            <span class="small">{{ services.length }} Services </span><button class="submit" v-on:click="addService">Add Service</button>
            <ul>
                <service v-bind:key="serv._id" v-for="serv in services" :service="serv" v-on:refresh="getServices"/>
            </ul>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import service from './serviceBlock.vue';
import env from '../env';

export default {
    components: {
        navigation: navigation,
        service: service
    },
    data: () => {
        return {
            API_HOST: null,
            services: []
        };
    },
    methods: {
        addService: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/services`);
            const num = res.body.length;
            this.services.push({ name: '', order: num });
        },
        getServices: async function() {
            this.$http.get(`${this.API_HOST}/api/services`)
            .then((res) => {
                this.services = res.body;
            }, (err) => {
                console.log(err);
                this.$router.push('login');
            });
        },
        start: function() {
            this.getServices();
        },
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        this.start();
    }
}
</script>