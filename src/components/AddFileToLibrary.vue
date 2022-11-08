<template>
  <b-modal
    v-model="show"
    :title="title"
    title-class="font-18"
    hide-footer
    :cancel-disabled="loading"
    :hide-header-close="loading"
    :no-close-on-backdrop="loading"
    :no-close-on-esc="loading"
  >
    <form @submit.prevent="action({ ...form, file, filename })">
      <b-form-group
        id="input-group-1"
        label="File Name"
        label-for="input-1"
      >
        <b-form-select
          v-if="isConsulting"
          v-model="form.project_type_deliverable_id"
          class="mb-2"
        >
          <option value="" disabled>Select file name</option>
          <option v-for="dev in deliverables" :key="dev.id" :value="dev.id">{{
            dev.deliverable_name || dev.report_title
          }}</option>
        </b-form-select>

        <b-form-select v-if="isAdmin" v-model="form.file_key" class="mb-2">
          <option value="" disabled>Select file name</option>
          <option
            v-for="vfile in adminFiles"
            :key="vfile.id"
            :value="vfile.id"
            >{{ vfile.name }}</option
          >
        </b-form-select>
        <b-form-select v-if="isFinance" v-model="form.file_key" class="mb-2">
          <option value="" disabled>Select file name</option>
          <option
            v-for="vfile in financeFiles"
            :key="vfile.id"
            :value="vfile.id"
            >{{ vfile.name }}</option
          >
        </b-form-select>
      </b-form-group>
      <b-form-group id="input-group-1" label="Upload File" label-for="input-1">
        <input id="input-1" type="file" @change="onFileChange" />
      </b-form-group>
      <button v-if="!loading" type="submit" class="btn btn-primary"
        >Submit</button
      >
      <button v-else class="btn btn-primary" disabled
        ><b-spinner small variant="white"></b-spinner> uploading...</button
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
    action: {
      type: Function,
      required: true,
    },
    deliverables: {
      type: Array,
      default: () => [],
    },
    adminFiles: {
      type: Array,
      default: () => [],
    },
    financeFiles: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Add Project File',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        project_type_deliverable_id: '',
        file_key: '',
      },
      file: '',
      filename: '',
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
    isConsulting() {
      return this.$store.state.auth.userDepartment.name === 'Consultancy'
    },
    isAdmin() {
      return this.$store.state.auth.userDepartment.name === 'Administration'
    },
    isFinance() {
      return this.$store.state.auth.userDepartment.name === 'Finance'
    },
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0]
      this.filename = e.target.files[0].name
    },
  },
}
</script>

<style scoped></style>
