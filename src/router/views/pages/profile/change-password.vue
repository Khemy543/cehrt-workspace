<script>
import { authMethods } from '../../../../state/helpers'
/**
 * Projects
 */
export default {
  data() {
    return {
      form: {},
    }
  },
  methods: {
    ...authMethods,
    tryChangePassword() {
      const { newPassword, confirmPassword } = this.form

      if (newPassword !== confirmPassword) {
        return this.$bvToast.toast('Password must be the same', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
      return this.changePassword({ ...this.form, firstTime: false })
        .then((data) => {
          this.$bvToast.toast('Password changed successful', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.form = {}
        })
        .catch((error) => {
          let message = 'Something happened, please try agian later'

          if (error.response) {
            const { status, data } = error.response

            if(status === 422) {
                message = data.errors[Object.keys(data.errors)[0]]
            }
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        })
    },
  },
}
</script>

<template>
  <form @submit.prevent="tryChangePassword">
    <div class="row mt-3 f">
      <div class="col-8">
        <b-form-group
          id="password"
          label="Current password"
          label-for="password"
        >
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter current password"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="newpassword"
          label="New Password"
          label-for="newpassword"
        >
          <b-form-input
            id="newpassword"
            v-model="form.newPassword"
            type="password"
            required
            placeholder="Enter new password"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="confirmpassword"
          label="Confirm password"
          label-for="confirmpassword"
        >
          <b-form-input
            id="confirmpassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Retype Password"
          ></b-form-input>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </form>
</template>
