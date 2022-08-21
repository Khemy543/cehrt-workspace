<template>
  <b-modal
    v-model="show"
    title="Request Project Deletion"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="requestProjectDeletion">
      <b-form-group label="Reason for deleting project">
        <b-form-textarea
          id="input-1"
          v-model="form.reason"
          placeholder="Provide reason for deleting project"
          rows="4"
        ></b-form-textarea>
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
      default: false,
    },
    close: {
      type: Function,
      required: true,
    },
    projectId : {
      type: Number,
      default: null
    },
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
      },
    },
  },
  methods: {
    async requestProjectDeletion() {
      try {
        const response = await this.$http.post(
          `/request/project/${this.projectId || this.$route.params.id}/delete`,
          this.form
        )

        if (response) {
          this.form = {}
          this.close()
          this.$bvToast.toast('Request sent successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
  },
}
</script>

<style lang="css" scoped></style>
