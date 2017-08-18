<style lang="scss">
.catBlock {
    display: block;
    box-shadow: 0 0 .3rem black;
    border-radius: .3rem;
    width: 70%;
    margin: 1% 10%;
    padding: .5% 2.5%;
    ul {
        width: 100%;
        margin: 0;
        padding: 0;
        li {
            display: inline-block;
            width: 48%;
            margin: 0;
            padding: 0;
            vertical-align: top;
            h4 {
                margin-bottom: .1%;
            }
        }
    }
}
.delete {
    background-color: #b24141;
    border: none;
    color: white;
    margin: 0 .2%;
    &:hover {
        background-color: #9c2323;
        cursor: pointer;
    }
}
.right { float: right; }
.blueBtn {
    background-color: #4567d9;
    border: none;
    color: white;
    &:hover {
        background-color: #2749bb;
        cursor: pointer;
    }
}
.small {
    font-size: .8rem;
    color: #747474;
    &:hover { cursor: pointer; }
}
.firstInput {
    margin-top: 5%;
}
</style>
<template>
<li class="catBlock">
    <ul>
        <li>
            <h4>{{ category.name || "None" }}</h4>
            <span class="small" v-on:click="editName=!editName"><i class="fa fa-pencil" aria-hidden="true"></i> Name</span>
            <input class="firstInput" v-if="editName" type="text" v-model="category.name" placeholder="Category Name" />
        </li>
        <li>
            <button class="delete right" v-on:click="deleteCat">Delete Category</button>
            <button class="blueBtn right" v-on:click="save">Save Changes</button>
            <div class="small" v-on:click="refresh">Refresh</div>
        </li>
    </ul>
    <span class="green" v-if="showSaved">Saved Changes <i class="fa fa-check" aria-hidden="true"></i></span>
</li>
</template>
<script>
import env from '../env';

export default {
    data: () => {
        return {
            API_HOST: null,
            editName: false,
            showSaved: false
        };
    },
    props: [
        'category'
    ],
    methods: {
        save: async function() {
            if (!this.category.name) {
                this.category.name = "";
            }
            let res;
            // If the category doesn't exist, create one
            if (!this.category._id) {
                res = await this.$http.post(`${this.API_HOST}/api/categories`, this.category);
            } else {
                res = await this.$http.put(`${this.API_HOST}/api/categories/${this.category._id}`, this.category);
            }
            if (res.ok || res.status === 200) {
                this.notifySaved();
            } else {
                alert('There was an error saving Category');
                console.log(res);
            }
            this.$emit('refresh');
        },
        refresh: function() {
            this.$emit('refresh');
        },
        notifySaved: function() {
            this.showSaved = true;
            setTimeout(() => {
                this.showSaved = false;
            }, 2000);
        },
        deleteCat: async function() {
            const res = await this.$http.delete(`${this.API_HOST}/api/categories/${this.category._id}`);
            if (res.ok || res.status === 200) {
                this.$emit('refresh');
            } else {
                alert('There was an error deleting Category');
                console.log(res);
            }
        }
    },
    created: function() {
        const e = env();
        this.API_HOST = e.API_HOST;
        const token = this.$cookies.get('forestryservices');
        if (!token) this.$router.push('login');
    }
}
</script>
