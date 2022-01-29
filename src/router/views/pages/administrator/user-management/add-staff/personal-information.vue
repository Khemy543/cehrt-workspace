<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
    }
  },
  validations: {
    username: {
      required,
    },
    form: ['username'],
  },
  methods: {
    validate() {
      this.$v.form.$touch()
      var isValid = !this.$v.form.$invalid
      this.$emit('on-validate', this.$data, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-3 col-form-label">First Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-3 col-form-label">Last Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Other Names (optional)</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Preferred Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Address Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Email Address</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Phone Number</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.username.$error }"
        >
          <label class="col-md-12 col-form-label">Alternate Phone Number(Optional)</label>
          <div class="col-md-12">
            <input
              v-model.trim="username"
              class="form-control"
              :class="{ 'is-invalid': $v.username.$error }"
            />
            <span
              v-if="$v.username.$error && !$v.username.required"
              class="help-block invalid-feedback"
              >Username is required</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
