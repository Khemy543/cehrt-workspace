<template>
     <b-modal
      :visible="show"
      :title="formtitle"
      :hide="close"
      title-class="font-18"
      hide-footer
    >
      <form @submit.prevent="handleSubmit">
        <b-form-group
          id="input-group-1"
          label="Project Title"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.title"
            type="text"
            required
            placeholder="Title of Project"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description">
          <b-form-textarea
            id="example-textarea"
            v-model="form.description"
            placeholder="description of project"
            rows="4"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Client Name"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.client"
            type="text"
            required
            placeholder="Name of Client"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Project Type"
          label-for="input-1"
        >
          <b-form-select v-model="form.projectType" class="mb-2">
            <option value="" disabled>Select project type</option>
            <option value="2">One</option>
            <option value="3">Two</option>
            <option value="4">Three</option>
          </b-form-select>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Project Sector"
          label-for="input-1"
        >
          <b-form-select v-model="form.sector" class="mb-2">
            <option value="" disabled>Select project sector</option>
            <option value="2">One</option>
            <option value="3">Two</option>
            <option value="4">Three</option>
          </b-form-select>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </b-modal>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            close: {
                type: Function,
                required: true
            },
            formtitle: {
                type: String,
                default: "Create New Project"
            }
        },
        data(){
            return{
                form: {
                    projectType: '',
				    sector: '',
                }
            }
        },
        methods: {
            handleSubmit() {

            }
        }
    }
</script>

<style lang="css" scoped>

</style>