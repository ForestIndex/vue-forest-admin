<style lang="scss">

</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <img class="headerImg" src="./forestindex3.png"/>
            <ul>
                <li v-for="service in services">
                    <h2>{{ service.name }}</h2>
                    <h5 v-on:click="showCategories=!showCategories">
                        <span v-if="!showCategories">Show Categories</span>
                        <span v-if="showCategories">Hide Categories</span>
                    </h5>
                    <ul v-if="showCategories">
                        <li v-for="cat in service.categories">{{ cat.name }}</li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</section>
</template>
<script>
import navigation from './navigation.vue';
import env from '../env';

export default {
    components: {
        navigation: navigation,
    },
    data: () => {
        return {
            API_HOST: null,
            services: [],
            categories: []
        };
    },
    methods: {
        getServices: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/services`);
            this.services = res.body;
            return Promise.resolve();
        },
        getCategories: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/categories`);
            for (let i = 0; i < this.services.length; i++) {
                this.services[i].categories = this.categories.filter((cat) => {
                    console.log(this.services[i]._id, cat._service._id);
                    if (cat._id === this.services[i]._id) return cat;
                });
            }
        },
        start: function() {
            this.getServices()
            .then(() => this.getCategories())
        },
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        const token = this.$cookies.get('forestryservices');
        if (!token) this.$router.push('login');
        this.start();
    }
}
</script>