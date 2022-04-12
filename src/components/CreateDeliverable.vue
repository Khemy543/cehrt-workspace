<template>
  <b-modal
    v-model="show"
    :title="title"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action({ ...form, ...deliverable })">
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
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
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
    }
  },
  data() {
    return {
      form: {},
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
      return this.deliverable && this.deliverable.deliverable_name || this.deliverable && this.deliverable.report_title;
    }
  },
  watch: {
    deliverable(newValue) {
      this.form = newValue
    }
  },
}
</script>

<style scoped></style>
