<template>
    <b-modal v-model="show" title="Export Project To Library" title-class="font-18" hide-footer size="lg">
        <form @submit.prevent="action(form)">
            <b-form-group id="input-group-1" label="Project Title" label-for="input-1">
                <b-form-input id="input-1" v-model="form.name" type="text" required placeholder="Title of Project">
                </b-form-input>
            </b-form-group>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Project Country" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.country" type="text" required
                            placeholder="Project country">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <label class="col-md-12">Regions</label>
                    <multiselect v-model="form.regions" :options="regionOptions" :multiple="true"></multiselect>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Project District" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.country" type="text" required
                            placeholder="Project District">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Project Year" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.year" type="text" required placeholder="Project year">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label="Project Summary / Narrative description">
                        <b-form-textarea id="input-1" v-model="form.description" placeholder="Description of project"
                            rows="4">
                        </b-form-textarea>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label="Description of service provided">
                        <b-form-textarea id="input-1" v-model="form.description" placeholder="Description of service provided"
                            rows="4">
                        </b-form-textarea>
                    </b-form-group>
                </div>
            </div>


            <div class=" row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Name of Client Contact Person" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.client" type="text" required
                            placeholder="Name of Client Contact Person">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Phone number" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.assocaite" type="text" required
                            placeholder="Phone number of contact person">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Address of client" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.assocaite" type="text" required
                            placeholder="Address of client">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Value of Service / Contract Amount" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.contract" type="text" required
                            placeholder="Value of service">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>

            <div class="row">
                <div class="col-6">
                    <b-form-group id="input-group-1" label="Start Date" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.start_date" type="date" required></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-6">
                    <b-form-group id="input-group-1" label="End Date" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.end_date" type="date" required></b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="d-flex mb-2">
                <label for="">Professional Experts</label>
                 <button type="button" class="btn btn-soft-primary btn-sm ml-4" @click="addProfessionalExpert">
                      <i class="uil uil-plus"></i>
                 </button>
            </div>
            <div v-for="prof in form.professionalExperts" :key="`prof-${prof.id}`" class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.contract" type="text" required
                            placeholder="Name">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.region" type="text" required
                            placeholder="Role">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="d-flex mb-2">
                <label for="">Associated consultants / Partners</label>
                 <button type="button" class="btn btn-soft-primary btn-sm ml-4" @click="addPartners">
                      <i class="uil uil-plus"></i>
                 </button>
            </div>
            <div v-for="part in form.partners" :key="`part-${part.id}`" class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.contract" type="text" required
                            placeholder="Name">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.region" type="text" required
                            placeholder="Role">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </b-modal>
</template>

<script>
import Multiselect from 'vue-multiselect';
export default {
    components: {
        Multiselect
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {
                regions: [],
                professionalExperts: [
                    {
                        id: 1,
                        name: '',
                        role: ''
                    }
                ],
                partners: [
                    {
                        id: 1,
                        name: '',
                        role: ''
                    }
                ]
            },
            regionOptions: [
                'Ashanti',
                'Western',
                'Volta',
                'Eastern',
                'Upper West',
                'Central',
                'Upper East',
                'Greater Accra',
                'Savannah',
                'North East',
                "Bono East",
                'Oti',
                'Ahafo',
                'Bono',
                'Western North',
                'Northen'
            ]
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            },
        },
    },
    methods: {
        action() { },
        addProfessionalExpert() {
            this.form.professionalExperts.push({
                id: this.form.professionalExperts[this.form.professionalExperts.length - 1].id + 1,
                name: "",
                role: ""
            })
        },
        addPartners() {
            this.form.partners.push({
                id: this.form.partners[this.form.partners.length - 1].id + 1,
                name: "",
                role: ""
            })
        }
    }
}
</script>

<style scoped>
</style>