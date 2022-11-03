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
    <form @submit.prevent="action({ ...deliverable, ...form, file, filename })">
      <b-form-group
        id="input-group-1"
        label="Deliverable deadline"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.deadline"
          type="date"
          required
        ></b-form-input>
      </b-form-group>

      <File
        v-if="editting && path"
        :name="title"
        :path="path"
        :deletable="true"
        @delete="deleteFile"
      />
      <b-form-group
        v-else
        id="input-group-1"
        label="Upload Deliverable File"
        label-for="input-1"
        required
      >
        <input id="input-1" type="file" @change="onFileChange" />
      </b-form-group>

      <button
        v-if="!loading"
        type="submit"
        class="btn btn-primary"
        :class="editting ? 'mt-4' : ''"
        >Submit</button
      >
      <button v-else class="btn btn-primary" disabled
        ><b-spinner small variant="white"></b-spinner> Uploading...</button
      >
    </form>
  </b-modal>
</template>

<script>
import { dateFormate } from '@utils/format-date'
import File from './file.vue'
export default {
  components: { File },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    action: {
      type: Function,
      required: true,
    },
    deliverable: {
      type: Object,
      default: () => {},
    },
    editting: {
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
      form: {},
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
    title() {
      return (
        (this.deliverable && this.deliverable.deliverable_name) ||
        (this.deliverable && this.deliverable.report_title) ||
        (this.deliverable &&
          this.deliverable.project_type_deliverable &&
          this.deliverable.project_type_deliverable.deliverable_name) ||
        (this.deliverable && this.deliverable.proposal_type.report_title)
      )
    },
    path() {
      return this.form.document_path || this.form.report_path || ''
    },
  },
  watch: {
    deliverable(newValue) {
      this.form = {
        ...newValue,
        deadline: newValue && newValue.deadline ? dateFormate(newValue.deadline) : '',
        delete_file_url: newValue && newValue.document_path || newValue && newValue.report_path || ''
      }
    },
  },
  methods: {
    deleteFile(file) {
      this.file = null
      this.filename = ''
      this.form.report_path = ''
      this.form.document_path = ''
    },
    onFileChange(e) {
      this.file = e.target.files[0]
      this.filename = e.target.files[0].name
    },
  },
}
</script>

<style scoped></style>
