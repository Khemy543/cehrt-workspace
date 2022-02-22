<template>
  <b-modal
    v-model="show"
    :title="deliverable.deliverable_name"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action(form)">
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
