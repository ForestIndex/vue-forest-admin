<style lang="scss">
$red: rgb(87.4%, 24.5%, 24.5%);
.clickable {
    &:hover {
        cursor: pointer;
    }
}
.redBtn {
    border: none;
    background-color: $red;
    color: white;
}
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
.images {
    width: 80%;
    margin: .5%;
    padding: 0;
    li {
        display: block;
        width: 100%;
        img {
            width: 50%;
            margin: 0 auto;
            padding: 0;
        }
    }
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
        <input type="text" v-model="user.info.email" placeholder="Business email address" />

        <h4>Address</h4>
        <input type="text" v-model="user.info.address.street" placeholder="Street address" />
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

        <h5>Images:</h5>
        <file-base64 v-bind:multiple="true" v-bind:done="uploadFiles"></file-base64>
        <h3 v-if="images.length === 0">No Images</h3>
        <ul class="images">
            <li v-for="image in user.info.images" :key="image">
                <img :src="baseUrl + '/api/images/' + image" alt="user.info.businessName">
                <h6 class="errorText clickable" v-on:click="showDeleteImg = true;" v-if="!showDeleteImg">Delete Image</h6>
                <div v-if="showDeleteImg">
                    <button v-on:click="deleteImage(image)" class="redBtn">Delete</button>
                    <button v-on:click="showDeleteImg = false;">Cancel</button>
                </div>
            </li>
        </ul>

        <ul class="arrows">
            <li>
                <i class="fa fa-arrow-up" aria-hidden="true" v-on:click="move('up')"></i>
            </li>
            <li class="small">order: {{ user.order + 1 || orderDisplay }}</li>
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
    <span v-if="infoText && infoText.length > 0">{{ infoText }}</span>
</li>

</template>
<script>
import fileBase64 from 'vue-file-base64';

export default {
    components: {
        fileBase64
    },
    data: function() {
        return {
            baseUrl: `${process.env.API_HOST}`,
            disabledUpload: true,
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
            errEmail: false,
            errZip: false,
            errDescr: false,
            errState: false,
            errStreet: false,
            errPhone: false,
            errService: false,
            errCategory: false,
            errCounties: false,
            errorMessage: '',
            orderDisplay: 'Click the arrows to set order',
            images: [],
            showDeleteImg: false,
            infoText: ''
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
        'user.order': function() {
            orderDisplay = this.user.order + 1;
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
        'user.info.address.street': function() {
            // this.errStreet = false;
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
            // } else if (!this.user.info.address.street || !this.user.info.address.street.length < 1) {
                // this.errStreet = true;
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
                const id = (!!this.user && this.user._id !== 0 && this.user._id !== undefined) ? `/${this.user._id}` : '';
                const url = `${process.env.API_HOST}/api/users${id}`;

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
            if (!!this.selectedState && !!this.selectedState._id) {
                const res = await this.$http.get(`${process.env.API_HOST}/api/states/${this.selectedState._id}/counties`);
                this.currentCountOpts = res.body.map((county) => county);
            }
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
            if (!this.user.order) this.user.order = 0;
            switch (direction) {
                case 'up': this.user.order += 1;
                    break;
                case 'down':
                    if (this.user.order > 0) this.user.order -= 1;
                    else this.user.order = 0;
            }
        },
        refresh: function() {
            this.$emit('refresh');
        },
        deleteImage: function(fullUrl) {
            const imageName = fullUrl.replace(`${process.env.API_HOST}/api/images/`, '');
            const url = `${process.env.API_HOST}/api/users/${this.user._id}/images`;
            const payLoad = { image: imageName };
            this.$http.delete(url, { body: payLoad })
            .then((res) => {
                this.$emit('refresh');
            }, (err) => {
                console.log(err);
            });
        },
        start: function() {
            if (!!this.selectedService && !!this.selectedService._id) this.currentCatOpts = this.categories.filter((cat) => cat._service === this.selectedService._id);
            this.selectedCat = this.user._category;
            const sc = {
                _id: 90,
                name: "South Carolina",
                abbreviation: "SC"
            };
            this.selectedState = this.user.info.address.state || sc;            
            this.getCurrentCounties();
            this.images = this.user.info.images.map((image) => `${process.env.API_HOST}/api/images/${image}`);
            if (this.user.info.operationalCounties) {
                this.selectedCounties = this.user.info.operationalCounties.map((county) => county._id);
            } else {
                this.selectedCounties = [];
            }
        },
        uploadFiles: function(files) {
            this.errorMessage = '';
            if (files.length > 0) {
                const url = `${process.env.API_HOST}/api/upload`;
                this.$http.post(url, files)
                .then(successfulUpload, badUpload);
            }

            function successfulUpload(res) {
                res.body.forEach((fileName) => {
                    this.user.info.images.push(fileName);
                });
                const updateUser = this.user;
                const updateUrl = `${process.env.API_HOST}/api/users/${this.user._id}`;

                this.$http.post(updateUrl, updateUser)
                .then((res) => {
                    this.$emit('refresh');
                }, (err) => {
                    console.log(err);
                    this.errorMessage = 'There was an error upload files';
                });
            }

            function badUpload(res) {
                console.log(res);
                this.errorMessage = 'There was an error uploading image. It may be too large.';
            }
        }
    },
    created: function() {
        const token = this.$cookies.get('forestryservices');
        if (!token) this.$router.push('login');
        this.start();
    }
}
</script>
