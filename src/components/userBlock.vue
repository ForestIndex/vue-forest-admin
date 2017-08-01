<style lang="scss">
.user {
    margin: 1% 0;
    padding: 1%;
    width: 98%;
    box-shadow: 0 0 .5rem gray;
    .col2 li {
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 40%;
        vertical-align: top;
    }
}
.info {
    width: 76%;
    margin: 1% 10%;
    padding: 2%;
    input {
    width: 40%;
    }
    textarea {
        width: 90%;
        min-height: 10rem;
    }
}
.active {
    font-size: .9rem;
    color: #47ae3b;
    font-family: sans-serif;
}
.inactive {
    font-size: .9rem;
    color: #dc3232;
    font-family: sans-serif;
}
.small {
    font-size: .7rem;
    color: gray;
}
</style>
<template>
<li class="user">
    <ul class="col2">
        <li>
            <h2>{{ info.businessName }}</h2>
            <h5>{{ username || info.email }}</h5>
        </li>
        <li>
            <span class="active" v-if="activeState">Active <i class="fa fa-check" aria-hidden="true"></i></span>
            <span class="inactive" v-if="!activeState">Inactive</span>
            <button class="" v-on:click="toggleActive">
                <span v-if="activeState">Deactivate</span>
                <span v-if="!activeState">Activate</span>
            </button>
        </li>
    </ul>
    <div v-if="showInfo" class="info">
        <h4>Business Name</h4>
        <input type="text" v-model="info.businessName" placeholder="Enter a business name" />

        <h4>Phone</h4>
        <input type="text" v-model="info.phone" placeholder="Business contact phone" />
        
        <h4>Email</h4>
        <input type="text" v-model="info.email" placeholder="Business email address" />

        <h4>Address</h4>
        <input type="text" v-model="info.address.street" placeholder="Street address" />
        <input type="text" v-model="info.address.zip" placeholder="Zipcode" />

        <h4>Description</h4>
        <textarea type="text" v-model="info.description" placeholder="Enter a business description" />

        <h4>Service</h4>
        <el-dropdown>
        <span class="el-dropdown-link">
            {{ info._service || 'Select a service' }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-on:click="">Action 1</el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>
    </div>
    <button v-on:click="showInfo=!showInfo">
        <span v-if="!showInfo">Edit Info</span>
        <span v-if="showInfo" v-on:click="saveChanges">Save</span>
    </button>
    <button v-if="showInfo" v-on:click="refresh">Refresh</button>
    <span class="clickable small" v-if="showInfo" v-on:click="showInfo=false">Hide Info</span>
</li>
</template>
<script>
import env from '../env';

export default {
    data: function() {
        return {
            activeState: false,
            showInfo: false,
            host: ''
        };
    },
    props: [
        'id',
        'username',
        'active',
        'info'
    ],
    methods: {
        toggleActive: function() {
            this.activeState = !this.activeState;
            if (!this.showInfo) this.showInfo = true;
        },
        refresh: function() {
            this.activeState = this.active;
            this.$emit('refresh');
        },
        saveChanges: async function() {
            const payload = {
                username: this.username,
                active: this.active,
                info: this.info
            };
            const headers = { 'Content-Type': 'applications/json' };
            await this.$http.post(`${this.host}/api/users/${this.id}`, payload, headers);
        }
    },
    created: function() {
        console.log(this.info);
        const e = env();
        this.host = `${e.API_HOST}`;
        this.activeState = this.active;
    }
}
</script>