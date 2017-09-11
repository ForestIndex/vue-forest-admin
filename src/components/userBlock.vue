<style lang="scss">
$red: rgb(87.4%, 24.5%, 24.5%);

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
.toggle {
    &:hover {
        cursor: pointer;
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
.error {
    border: .1rem solid $red;
    width: 10%;
}
.errorText {
    color: $red;
}
.green {
    color: rgb(21.3%, 74.9%, 7.8%);
}
.errSubmit {
    border: .1rem solid $red;
}
</style>
<template>
<li class="user">
    <ul class="col2">
        <li>
            <h2>{{ user.info.businessName || 'New Business User' }}</h2>
            <h5>{{ user.username || user.info.email }}</h5>
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
        <input :class="{ errSubmit: errBusName }" type="text" v-model="user.info.businessName" placeholder="Enter a business name" />

        <h4>Phone</h4>
        <input :class="{ errSubmit: errPhone }" type="text" v-model="user.info.phone" placeholder="Business contact phone" />
        
        <h4>Email</h4>
        <input :class="{ errSubmit: errEmail }" type="text" v-model="user.info.email" placeholder="Business email address" />

        <h4>Address</h4>
        <input :class="{ errSubmit: errStreet }" type="text" v-model="user.info.address.street" placeholder="Street address" />
        <input :class="{ errSubmit: errCity }" type="text" v-model="user.info.address.city" placeholder="City" />
        <input :class="{ errSubmit: errZip }" type="text" v-model="user.info.address.zip" placeholder="Zipcode" />
        <select :class="{ errSubmit: errState }" v-model="selectedState">
            <option disabled><span class="el-dropdown-link">Select a state</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option v-bind:key="state._id" v-for="state in states" :value="state">{{ state.name }}</option>
        </select>

         <h4>Operational Counties</h4>
        <h6 class="toggle" v-on:click="showCounties=!showCounties">{{ showCounties ? 'Hide' : 'Show' }} operational counties</h6>
        <ul :class="{ errSubmit: errCounties }" class="drop clickable" v-if="showCounties">
            <li  v-bind:key="county._id" v-for="county in currentCountOpts" v-on:click="selectCounty(county)">{{ county.name }} <i v-if="selectedCounties.indexOf(county._id) >= 0" class="fa fa-check green" aria-hidden="true"></i></li>
        </ul>

        <h4>Description</h4>
        <textarea :class="{ errSubmit: errDescr }" type="text" v-model="user.info.description" placeholder="Enter a business description" />

         <h4>Service</h4>
         <select :class="{ errSubmit: errService }" v-model="selectedService">
            <option disabled><span class="el-dropdown-link">Select a service</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option :key="service._id" v-for="service in services" :value="service">{{ service.name }}</option>
        </select>

        <h4>Category</h4>
         <select :class="{ errSubmit: errCategory }" v-model="selectedCat">
            <option disabled><span class="el-dropdown-link">Select a category</span><i class="el-icon-caret-bottom el-icon--right"></i></option>
            <option :key="category._id" v-for="category in currentCatOpts" :value="category">{{ category.name || "none" }}</option>
        </select>

         <!-- <el-dropdown>
            <el-button type="primary">
                {{ user._service.name || 'Select a service' }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" v-model="user._service.name">
                <el-dropdown-item v-for="service in services">{{ service.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->

        <ul class="arrows">
            <li>
                <i class="fa fa-arrow-up" aria-hidden="true" v-on:click="move('up')"></i>
            </li>
            <li class="small">order: {{ user.order + 1 || 'NA' }}</li>
            <li>
                <i class="fa fa-arrow-down" aria-hidden="true" v-on:click="move('down')"></i>
            </li>
        </ul>

    </div>
    <button v-if="!showInfo" v-on:click="showInfo=!showInfo">Edit Info</button>
    <button :class="{ errSubmit: badSubmit }" v-if="showInfo" v-on:click="saveChanges">Save Changes</button>
    <button v-if="showInfo" v-on:click="refresh">Refresh</button>
    <span class="clickable small" v-if="showInfo" v-on:click="showInfo=false">Hide Info</span>
    <span v-if="!user._id" class="small">pending changes</span>
    <span class="green" v-if="saved">Saved Changes <i class="fa fa-check" aria-hidden="true"></i></span>
    <span class="errorText">{{ errorMessage }}</span>
</li>
</template>
<script>
import env from '../env';

export default {
    data: function() {
        return {
            token: null,
            showInfo: false,
            host: '',
            currentCatOpts: [],
            selectedService: this.user._service,
            selectedCat: null,
            selectedState: this.user.info.address.state,
            currentCountOpts: [],
            selectedCounties: [],
            showCounties: false,
            badSubmit: false,
            saved: false,
            errBusName: false,
            errCity: false,
            errZip: false,
            errDescr: false,
            errState: false,
            errService: false,
            errCategory: false,
            errCounties: false,
            errorMessage: ''
        };
    },
    watch: {
        selectedService: function() {
            this.user._service = this.selectedService;
            this.currentCatOpts = this.categories.filter((cat) => cat._service === this.selectedService._id);
            this.errService = false;
            this.badSubmit = false;
        },
        selectedCat: function() {
            this.user._category = this.selectedCat;
        },
        selectedState: function() {
            this.user.info.address.state = this.selectedState;
            const ids = this.currentCountOpts.map((county) => county._id);
            this.getCurrentCounties();
            this.selectedCounties.forEach((c) => {
                const idx = ids.indexOf(c._id);
                if (idx < 0) this.selectedCounties.splice(idx, 1);
            });
        },
        selectedCounties: function() {
            this.user.info.operationalCounties = this.selectedCounties;
        },
        user: function() {
            this.start();
        },
        'user.info.businessName': function() {
            this.errBusName = false;
            this.badSubmit = false;
        },
        'user.info.address.city': function() {
            this.errCity = false;
            this.badSubmit = false;
        },
        'user.info.address.zip': function() {
            this.errZip = false;
            this.badSubmit = false;
        },
        'user.info.description': function() {
            this.errDescr = false;
            this.badSubmit = false;
        },
        'user.info.address.state': function() {
            this.errState = false;
            this.badSubmit = false;
            this.showCounties = true;
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
        validateForm: function() {
            if (!this.user.info.businessName || this.user.info.businessName.length < 1) {
                this.errBusName = true;
                return false;
            } else if (!this.user.info.address.city || this.user.info.address.city.length < 1) {
                this.errCity = true;
                return false;
            } else if (!this.user.info.address.zip) {
                this.errZip = true;
                return false;
            } else if (!this.user.info.address.state || !this.user.info.address.state._id) {
                this.errState = true;
                return false;
            } else if (!this.user.info.description) {
                this.errDescr = true;
                return false;
            } else if (!this.user._service || !this.user._service._id) {
                this.errService = true;
                return false;
            } else if (this.user.info.operationalCounties.length === 0) {
                this.errCounties = true;
                return false;
            }
            return true;
        },
        saveChanges: function() {
            const validForm = this.validateForm();
            if (validForm) {
                this.errorMessage = '';
                const payload = this.user;
                payload._service = this.user._service._id;

                if (this.user._category && this.user._category._id) {
                    payload._category = this.user._category._id;
                }

                payload.info.address.state = this.user.info.address.state._id;
                payload.info.operationalCounties = this.selectedCounties;
                const headers = { 'Content-Type': 'applications/json' };
                const id = !!this.user._id ? `/${this.user._id}` : '';
                const token = `?token=${this.token}`;
                const url = `${this.host}/api/users${id}${token}`;

                this.$http.post(url, payload, headers)
                .then((res) => {
                    this.showSave();
                    this.$emit('refresh');
                }, (res) => {
                    this.errorMessage = 'There was an error saving changes.'
                });
            } else {
                this.badSubmit = true;
            }
        },
        showSave: function() {
            this.saved = true;
            setTimeout(() => {
                this.saved = false;
            }, 2000);
        },
        getCurrentCounties: async function() {
            const res = await this.$http.get(`${this.host}/api/states/${this.user.info.address.state._id}/counties`);
            this.currentCountOpts = res.body.map((county) => county);
        },
        selectCounty: function(county) {
            const id = county._id;
            if (this.selectedCounties.indexOf(id) <= -1) {
                this.selectedCounties.push(id);
            } else {
                const idx = this.selectedCounties.indexOf(id);
                this.selectedCounties.splice(idx, 1);
            }
        },
        move: function(direction) {
            if (direction === 'up') {
                this.user.order = this.user.order === 0 ? 0 : this.user.order - 1;
            } else if (direction === 'down') {
                this.user.order += 1;
            }
        },
        start: function() {
            this.currentCatOpts = this.categories.filter((cat) => cat._service === this.selectedService._id);
            this.selectedCat = this.user._category;
            const sc = {
                _id: 90,
                name: "South Carolina",
                abbreviation: "SC"
            };
            this.selectedState = this.user.info.address.state || sc;            
            this.getCurrentCounties();
            if (this.user.info.operationalCounties) {
                this.selectedCounties = this.user.info.operationalCounties.map((county) => county._id);
            } else {
                this.selectedCounties = [];
            }
        }
    },
    created: function() {
        const e = env();
        this.host = `${e.API_HOST}`;
        this.token = this.$cookies.get('forestryservices');
        if (!this.token) this.$router.push('login');
        if (this.user.info.businessName) this.start();
    }
}
</script>