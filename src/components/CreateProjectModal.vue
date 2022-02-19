<template>
  <b-modal
    v-model="show"
    :title="formTitle"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action(form)">
      <b-form-group
        id="input-group-1"
        label="Project Title"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Title of Project"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Project Description">
        <b-form-textarea
          id="input-1"
          v-model="form.description"
          placeholder="Pescription of project"
          rows="4"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-group-1" label="Client Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.client"
          type="text"
          required
          placeholder="Name of Client"
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
        label="Project Sector"
        label-for="input-1"
      >
        <b-form-select v-model="form.project_sector_id" class="mb-2">
          <option value="" disabled>Select project sector</option>
          <option
            v-for="sector in sectors"
            :key="sector.id"
            :value="sector.id"
            >{{ sector.name }}</option
          >
        </b-form-select>
      </b-form-group>
      <div class="row">
        <div class="col-6">
          <b-form-group
            id="input-group-1"
            label="Start Date"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.start_date"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-6">
          <b-form-group id="input-group-1" label="Date Due" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.end_date"
              type="date"
              required
            ></b-form-input>
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
    close: {
      type: Function,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    action: {
      type: Function,
      required: true,
    },
    project: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        project_type_id: '',
        project_sector_id: '',
        ...this.project,
      },
      projectTypes: [],
      sectors: [],
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    project(newValue) {
      this.form = {
        ...newValue,
        project_type_id: newValue.project_type.id || '',
        project_sector_id: newValue.project_sector.id || '',
        start_date: newValue.raw_start_date,
        end_date: newValue.raw_end_date,
      }
    },
  },
  created() {
    this.getSectors()
    this.getProjectTypes()
  },
  methods: {
    async getSectors() {
      try {
        const response = await this.$http.get('/fetch/project/sectors')

        if (response) {
          this.sectors = response.data
        }
      } catch (error) {}
    },
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

<style lang="css" scoped></style>
