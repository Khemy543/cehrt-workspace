<template>
  <b-modal
    :visible="show"
    title="Deliverable name"
    title-class="font-18"
    hide-footer
    cancel-disabled
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
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
    show: {
      type: Boolean,
      required: true
    },
    action: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      form: {},
    }
  },
}
</script>

<style scoped></style>
