<template>
  <b-modal
    v-model="show"
    :title="title"
    title-class="font-18"
    hide-footer
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
      <b-form-group
        v-if="!editting"
        id="input-group-1"
        label="Upload Deliverable File"
        label-for="input-1"
      >
        <input
          id="input-1"
          type="file"
          @change="onFileChange"
        />
      </b-form-group>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
import { dateFormate } from '@utils/format-date'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    action: {
      type: Function,
      required: true,
    },
    deliverable: {
      type: Object,
      default: () =>{}
    },
    editting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      file: "",
      filename: ''
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
    },
    title() {
      return this.deliverable && this.deliverable.deliverable_name ||
      this.deliverable && this.deliverable.report_title ||
      this.deliverable && this.deliverable.project_type_deliverable && this.deliverable.project_type_deliverable.deliverable_name
    }
  },
  watch: {
    deliverable(newValue) {
      this.form = {
        ...newValue,
        deadline: newValue.deadline ? dateFormate(newValue.deadline) : ''
      }
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
      this.filename = e.target.files[0].name;
    },
  },
}
</script>

<style scoped></style>
