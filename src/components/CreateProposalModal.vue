<template>
  <b-modal v-model="show" :title="formTitle" title-class="font-18" hide-footer>
    <form @submit.prevent="action(form)">
      <b-form-group
        id="input-group-1"
        label="Name of Project"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.title"
          type="text"
          required
          placeholder="Enter project name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="Client" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.client"
          type="text"
          required
          placeholder="Project client"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="Project Type" label-for="input-1">
        <b-form-select v-model="form.project_type_id" class="mb-2">
          <option value="" disabled>Select project type</option>
          <option
            v-for="type in projectTypes"
            :key="type.id"
            :value="type.id"
            >{{ type.name }}</option
          >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Funding Option"
        label-for="input-1"
      >
        <b-form-select v-model="form.funding_option" class="mb-2">
          <option value="" disabled>Select funding option</option>
          <option
            v-for="fund in ['World Bank', 'IFC', 'Private']"
            :key="fund"
            :value="fund"
            >{{ fund }}</option
          >
        </b-form-select>
      </b-form-group>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <b-spinner v-if="loading" small variant="white"></b-spinner
        >Submit</button
      >
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    proposal: {
      type: Object,
      default: () => {},
    },
    action: {
      type: Function,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        project_type_id: '',
        funding_option: '',
      },
      projectTypes: [],
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
  watch: {
    proposal(newValue) {
      this.form = {
        ...newValue,
        project_type_id:
          (newValue.project_type && newValue.project_type.id) || '',
        funding_option: newValue.funding_option || '',
      }
    },
  },
  created() {
    this.getProjectTypes()
  },
  methods: {
    async getProjectTypes() {
      try {
        const response = await this.$http.get('/fetch/project/types')

        if (response) {
          this.projectTypes = response.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style scoped></style>
