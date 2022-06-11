<template>
  <b-modal v-model="show" :title="title" title-class="font-18" hide-footer>
    <form @submit.prevent="action({ ...form, file, filename })">
      <b-form-group id="input-group-1" label="Project File Name" label-for="input-1">
        <b-form-select v-model="form.project_type_deliverable_id" class="mb-2">
          <option value="" disabled>Select file name</option>
          <option v-for="dev in deliverables" :key="dev.id" :value="dev.id">{{
            dev.deliverable_name
          }}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        id="input-group-1"
        label="Upload File"
        label-for="input-1"
      >
        <input id="input-1" type="file" @change="onFileChange" />
      </b-form-group>
      <button type="submit" class="btn btn-primary">Submit</button>
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
    title: {
      type: String,
      default: 'Add Project File',
    },
  },
  data() {
    return {
      form: {
        project_type_deliverable_id: '',
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
