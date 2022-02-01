<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      title: '',
      supervisor: '',
      workLocation: '',
      workPhone:'',
      startDate: ''
    }
  },
  validations: {
    title: {
      required,
    },
    supervisor: {
      required
    },
    workLocation: {
      required
    },
    workPhone: {
      required
    },
    startDate: {
      required
    },
    form: ['title', 'supervisor', 'workLocation', 'workPhone', 'startDate'],
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
          :class="{ 'has-error': $v.title.$error }"
        >
          <label class="col-md-3 col-form-label">Title</label>
          <div class="col-md-12">
            <input
              v-model.trim="title"
              class="form-control"
              :class="{ 'is-invalid': $v.title.$error }"
              placeholder="Title"
            />
            <span
              v-if="$v.title.$error && !$v.title.required"
              class="help-block invalid-feedback"
              >title is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.supervisor.$error }"
        >
          <label class="col-md-3 col-form-label">Supervisor</label>
          <div class="col-md-12">
            <select
              v-model.trim="supervisor"
              class="form-control"
              :class="{ 'is-invalid': $v.supervisor.$error }"
            >
              <option disabled value="">Select supervisor</option>
              <option value="emefa">Mrs. Emefa</option>
            </select>
            <span
              v-if="$v.supervisor.$error && !$v.supervisor.required"
              class="help-block invalid-feedback"
              >supervisor is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.workLocation.$error }"
        >
          <label class="col-md-12 col-form-label">Work Location</label>
          <div class="col-md-12">
            <input
              v-model.trim="workLocation"
              class="form-control"
              :class="{ 'is-invalid': $v.workLocation.$error }"
              placeholder="Work location"
            />
            <span
              v-if="$v.workLocation.$error && !$v.workLocation.required"
              class="help-block invalid-feedback"
              >work location is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.workPhone.$error }"
        >
          <label class="col-md-12 col-form-label">Work Phone</label>
          <div class="col-md-12">
            <input
              v-model.trim="workPhone"
              class="form-control"
              :class="{ 'is-invalid': $v.workPhone.$error }"
              placeholder="Work phone"
            />
            <span
              v-if="$v.workPhone.$error && !$v.workPhone.required"
              class="help-block invalid-feedback"
              >work phone is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.startDate.$error }"
        >
          <label class="col-md-12 col-form-label">Start Date</label>
          <div class="col-md-12">
            <input
              v-model.trim="startDate"
              class="form-control"
              :class="{ 'is-invalid': $v.startDate.$error }"
              type="date"
            />
            <span
              v-if="$v.startDate.$error && !$v.startDate.required"
              class="help-block invalid-feedback"
              >start date is required</span
            >
          </div>
        </div>
      </div>
      <!-- <div class="col-md-6">
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
      </div> -->
    </div>
  </div>
</template>
