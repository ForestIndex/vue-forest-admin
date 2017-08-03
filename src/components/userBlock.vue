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
            <h2>{{ user.info.businessName }}</h2>
            <h5>{{ user.username || info.email }}</h5>
        </li>
        <li>
            <span class="active" v-if="user.active">Active <i class="fa fa-check" aria-hidden="true"></i></span>
            <span class="inactive" v-if="!user.active">Inactive</span>
            <button class="" v-on:click="toggleActive">
                <span v-if="user.active">Deactivate</span>
                <span v-if="!user.active">Activate</span>
            </button>
        </li>
    </ul>
    <div v-if="showInfo" class="info">
        <h4>Business Name</h4>
        <input type="text" v-model="user.info.businessName" placeholder="Enter a business name" />

        <h4>Phone</h4>
        <input type="text" v-model="user.info.phone" placeholder="Business contact phone" />
        
        <h4>Email</h4>
        <input type="text" v-model="user.info.email" placeholder="Business email address" />

        <h4>Address</h4>
        <input type="text" v-model="user.info.address.street" placeholder="Street address" />
        <input type="text" v-model="user.info.address.city" placeholder="City" />
        <input type="text" v-model="user.info.address.zip" placeholder="Zipcode" />
        <select v-model="selectedState">
            <option disabled><span class="el-dropdown-link">Select a state</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option v-for="state in states" :value="state">{{ state.name }}</option>
        </select>

         <h4>Operational Counties</h4>
        <select v-model="selectedCounties">
            <option disabled>Select counties where this business operates</option>
        </select> 

        <h4>Description</h4>
        <textarea type="text" v-model="user.info.description" placeholder="Enter a business description" />

         <h4>Service</h4>
         <select v-model="selectedService">
            <option disabled><span class="el-dropdown-link">Select a service</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option v-for="service in services" :value="service">{{ service.name }}</option>
        </select>

        <h4>Category</h4>
         <select v-model="selectedCat">
            <option disabled><span class="el-dropdown-link">Select a category</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option v-for="category in currentCatOpts" :value="category">{{ category.name || "none" }}</option>
        </select>

         <!-- <el-dropdown>
            <el-button type="primary">
                {{ user._service.name || 'Select a service' }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" v-model="user._service.name">
                <el-dropdown-item v-for="service in services">{{ service.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
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
            showInfo: false,
            host: '',
            currentCatOpts: [],
            selectedService: this.user._service,
            selectedCat: null,
            selectedState: this.user.info.address.state,
            currentCountOpts: [],
            selectedCounties: []
        };
    },
    watch: {
        selectedService: function() {
            this.user._service = this.selectedService;
            this.currentCatOpts = this.categories.filter((cat) => cat._service === this.selectedService._id);
        },
        selectedCat: function() {
            this.user._category = this.selectedCat;
        },
        selectedState: function() {
            this.user.info.address.state = this.selectedState;
            this.getCurrentCounties(); 
        },
        selectedCounties: function() {
            this.user.info.operationalCounties = this.selectedCounties;
        },
        user: function() {
            this.start();
        }
    },
    props: [
        'user',
        'services',
        'categories',
        'states'
    ],
    methods: {
        toggleActive: function() {
            this.user.active = !this.user.active;
            if (!this.showInfo) this.showInfo = true;
        },
        refresh: function() {
            this.$emit('refresh');
        },
        saveChanges: function() {
            const payload = this.user;
            payload._service = this.user._service._id;
            payload._category = this.user._category._id;
            payload.info.address.state = this.user.info.address.state._id;
            const headers = { 'Content-Type': 'applications/json' };
            this.$http.post(`${this.host}/api/users/${this.user._id}`, payload, headers)
            .then((data) => this.$emit('refresh'));
        },
        getCurrentCounties: async function() {
            const res = await this.$http.get(`${this.host}/api/states/${this.user.info.address.state._id}/counties`);
            this.currentCountOpts = res.body.map((county) => county);
        },
        start: function() {
            this.currentCatOpts = this.categories.filter((cat) => cat._service === this.selectedService._id);
            this.selectedCat = this.user._category;
            this.selectedState = this.user.info.address.state;
            this.getCurrentCounties();
        }
    },
    created: function() {
        const e = env();
        this.host = `${e.API_HOST}`;
        this.start();
    }
}
</script>