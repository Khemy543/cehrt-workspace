<template>
  <b-modal
    v-model="show"
    title="Reject project deletion request"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="rejectProjectDeletionRequest">
      <b-form-group label="Reason for rejecting request">
        <b-form-textarea
          id="input-1"
          v-model="form.reason_for_rejection"
          placeholder="Provide reason for rejecting request"
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
    request: {
        type: Object,
        default: () => ({})
    },
    value: {
      type: Boolean,
      default: false,
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
      },
    },
  },
  methods: {
    async rejectProjectDeletionRequest() {
      try {
        const response = await this.$http.patch(
          `/admin/update/project/${this.request.id}/deletion-request`,
          {
              ...this.form,
              status: 'rejected'
              
          }
        )

        if (response) {
          this.form = {}
           this.$emit('deleteRequest', this.request)
          this.$bvToast.toast('Request rejected successfully', {
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
