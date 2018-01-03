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

export default {
    components: {
        navigation: navigation,
    },
    data: () => {
        return {
            token: null
        };
    },
    created: function() {
        this.token = this.$cookies.get('forestryservices');
    }
}
</script>