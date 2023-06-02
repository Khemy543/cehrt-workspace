<template>
  <b-modal
    v-model="show"
    title="Add Correspondent"
    title-class="font-18"
    hide-footer
    :cancel-disabled="loading"
    :hide-header-close="loading"
    :no-close-on-backdrop="loading"
    :no-close-on-esc="loading"
  >
    <form @submit.prevent="action(form)">
      <b-form-group id="input-group-1" label="File name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.filename"
          type="text"
          required
          placeholder="File name"
        >
        </b-form-input>
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        file: '',
        fileName: '',
        key: 'corespondents',
      },
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.form = { file: '', fileName: '', key: 'corespondents' }
      },
    },
  },
  methods: {
    onFileChange(e) {
      this.form.file = e.target.files[0]
    },
  },
}
</script>

<style scoped></style>
