<style lang="scss">
.center {
    width: 30%;
    margin: .2% 0 .2% 10%;
    width: 75%;
}
.serviceBlock {
    border: .03rem solid gray;
    border-radius: .2rem;
    margin: 1% 0;
    padding: 1%;
    width: 98%;
}
.arrows {
    width: 100%;
    padding: 0;
    margin: 5% 0 0 0;
    li {
        display: block;
        text-align: center;
        width: 10%;
        right: 0;
        i:hover {
            cursor: pointer;
            color: #255dd1;
        }
    }
}
</style>
<template>
<section>
    <li class="serviceBlock">
        <button class="delete right" v-on:click="deleteService">Delete Category</button>
        <button class="blueBtn right" v-on:click="save">Save Changes</button>
        <div class="small" v-on:click="refresh">Refresh</div>
        <h2>{{ service.name }}</h2>
        <span v-on:click="editName=!editName" class="small"><i class="fa fa-pencil" aria-hidden="true"></i> Name</span>
        <input v-if="editName" type="text" v-model="service.name" placeholder="Service name" />
        <h5 class="clickable" v-on:click="showCategories=!showCategories">
            <span v-if="!showCategories">Show Categories</span>
            <span v-if="showCategories">Hide Categories</span>
        </h5>
        <ul v-if="showCategories">
            <div v-if="categories.length === 0">This service does not have any categries.</div>
            <button class="submit center" v-on:click="categories.push({ _service: service._id })">Add Category</button>
            <category v-bind:key="cat._id" v-for="cat in categories" :category="cat" v-on:refresh="getCategories" /> 
        </ul>
        <ul class="arrows">
            <li>
                <i class="fa fa-arrow-up" aria-hidden="true" v-on:click="move('up')"></i>
            </li>
            <li class="small">order: {{ service.order + 1 || 'NA' }}</li>
            <li>
                <i class="fa fa-arrow-down" aria-hidden="true" v-on:click="move('down')"></i>
            </li>
        </ul>
        <span class="green" v-if="showSaved">Saved Changes <i class="fa fa-check" aria-hidden="true"></i></span>
    </li>
</section>
</template>
<script>
import env from '../env';
import category from './categoryBlock.vue';

export default {
    components: {
        category: category
    },
    data: () => {
        return {
            token: null,
            API_HOST: null,
            showCategories: false,
            categories: [],
            editName: false,
            showSaved: false
        };
    },
    props: [
        'service'
    ],
    methods: {
        getCategories: async function() {
            const res = await this.$http.get(`${this.API_HOST}/api/categories`);
            this.categories = res.body.filter((cat) => cat._service === this.service._id);
        },
        refresh: function() {
            this.$emit('refresh');
        },
        notifyShowChanges: function() {
            this.showSaved = true;
            setTimeout(() => {
                this.showSaved = false;
            }, 2000);
        },
        move: function(direction) {
            if (direction === 'up') {
                this.service.order = this.service.order === 0 ? 0 : this.service.order - 1;
            } else if (direction === 'down') {
                this.service.order += 1;
            }
        },
        deleteService: async function() {
            if (this.service._id) {
                const res = await this.$http.delete(`${this.API_HOST}/api/services/${this.service._id}?token=${this.token}`);
                if (!res.ok || res.status >= 400) {
                    alert('There was an issue deleting service.');
                }
            } 
            this.$emit('refresh');
        },
        save: async function() {
            let res;
            if (this.service._id && this.service._id >= 0) {
                // update
                res = await this.$http.put(`${this.API_HOST}/api/services/${this.service._id}/?token=${this.token}`, this.service);
            } else {
                // create new
                res = await this.$http.post(`${this.API_HOST}/api/services?token=${this.token}`, this.service);
            }
            if (res.ok || res.status >= 200) {
                this.notifyShowChanges();
            } else {
                alert('There was an issue saving service');
                console.log(res);
            }
            this.$emit('refresh');
        }
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        this.token = this.$cookies.get('forestryservices');
        this.getCategories();
    }
}
</script>