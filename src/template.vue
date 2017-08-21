<style lang="scss">

</style>
<template>
<section>
    <ul class="col2 block">
        <li class="col"><navigation /></li>
        <li class="col">
            <img class="headerImg" src="./forestindex3.png"/>
            <!-- content -->
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
            API_HOST: null
        };
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        // this.token = this.$cookies.get('forestryservices');
    }
}
</script>