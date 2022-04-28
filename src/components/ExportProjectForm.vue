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
                    <b-form-group id="input-group-1" label="Project Region" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.region" type="text" required
                            placeholder="Project Region">
                        </b-form-input>
                    </b-form-group>
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
                        <b-form-input id="input-1" v-model="form.year" type="text" required
                            placeholder="Project year">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>

            <b-form-group label="Project Summary / Narrative description">
                <b-form-textarea id="input-1" v-model="form.description" placeholder="Description of project" rows="4">
                </b-form-textarea>
            </b-form-group>

            <b-form-group id="input-group-1" label="Client Name" label-for="input-1">
                <b-form-input id="input-1" v-model="form.client" type="text" required placeholder="Name of Client">
                </b-form-input>
            </b-form-group>

            <div class="row">
                <div class="col-6">
                    <b-form-group id="input-group-1" label="Start Date" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.start_date" type="date" required></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-6">
                    <b-form-group id="input-group-1" label="Date Due" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.end_date" type="date" required></b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Project Country" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.contract" type="text" required
                            placeholder="Project country">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Project Region" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.region" type="text" required
                            placeholder="Project Region">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Name of Associate consultant" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.assocaite" type="text" required
                            placeholder="Name of associate consultant">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group id="input-group-1" label="Role of associate consultant" label-for="input-1">
                        <b-form-input id="input-1" v-model="form.region" type="text" required
                            placeholder="Role of associate consultant">
                        </b-form-input>
                    </b-form-group>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </b-modal>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {}
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
        action() { }
    }
}
</script>

<style scoped>
</style>