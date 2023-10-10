<template>
  <b-modal
    v-model="show"
    :title="formTitle"
    title-class="font-18"
    hide-footer
    size="lg"
    :cancel-disabled="loading"
    :hide-header-close="loading"
    :no-close-on-backdrop="loading"
    :no-close-on-esc="loading"
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
            v-for="mytype in projectTypes"
            :key="mytype.id"
            :value="mytype.id"
            >{{ mytype.name }}</option
          >
        </b-form-select>
      </b-form-group>

      <div class="row">
        <div class="col-md-6">
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
        </div>
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Project Coordinator"
            label-for="input-1"
          >
            <b-form-select v-model="form.coordinator_id" class="mb-2" required>
              <option value="" disabled>Select project coordinator</option>
              <option v-for="user in staff" :key="user.id" :value="user.id">{{
                user.name
              }}</option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>

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
          <b-form-checkbox
            id="checkbox-1"
            v-model="form.export_to_library"
            name="checkbox-1"
            style="margin-top: 35px;"
          >
            Export to library
          </b-form-checkbox>
        </div>
      </div>
      <button v-if="!loading" type="submit" class="btn btn-primary"
        >Submit</button
      >
      <button v-else class="btn btn-primary" disabled
        ><b-spinner small variant="white"></b-spinner> Uploading...</button
      >
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
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
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        export_to_library: false,
        project_type_id: '',
        project_sector_id: '',
        coordinator_id: '',
        ...this.project,
      },
      projectTypes: [],
      sectors: [],
      staff: [],
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
    project(newValue) {
      this.form = {
        ...newValue,
        name: newValue.name || newValue.title || '',
        project_type_id: newValue.project_type.id || '',
        project_sector_id: newValue.project_sector.id || '',
        coordinator_id: newValue.coordinator.id || '',
        start_date: newValue.raw_start_date,
        end_date: newValue.raw_end_date,
      }
    },
  },
  /* mounted() {
    this.form = {
    ...this.project,
      name: this.project.name || this.project.title || "",
      project_type_id: this.project.project_type  && this.project.project_type.id || '',
      project_sector_id: this.project.project_sector && this.project.project_sector.id || '',
      coordinator_id: this.project.coordinator && this.project.coordinator.id || '',
      start_date: this.project.raw_start_date,
      end_date: this.project.raw_end_date,
    }
  }, */
  created() {
    this.getSectors()
    this.getProjectTypes()
    this.getStaff()
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
    async getStaff() {
      try {
        const response = await this.$http.get(`/fetch/all-staff`)

        if (response) {
          this.staff = response.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style lang="css" scoped></style>
