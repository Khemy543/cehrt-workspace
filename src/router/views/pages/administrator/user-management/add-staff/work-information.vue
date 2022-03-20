<script>
import { required } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      title: '',
      supervisor: '',
      workLocation: '',
      workPhone: '',
      startDate: '',
      departments: null,
      departmentsOptions: [],
      staffOptions: [],
      staffId: null,
      rate: "",
      rateCurrency: ''
    }
  },
  created() {
    this.fetchDepartments();
    this.fetchSuperviosrs()
  },
  validations: {
    title: {
      required,
    },
    supervisor: {
      required: false
    },
    workLocation: {
      required
    },
    workPhone: {
      required: false
    },
    startDate: {
      required
    },
    departments: {
      required
    },
    staffId: {
      required
    },
    rate: {
      required: false
    },
    rateCurrency: {
      required: false
    },

    form: ['title', 'supervisor', 'workLocation', 'workPhone', 'startDate', 'departments', 'staffId', 'rate', 'rateCurrency'],
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$http.get('/admin/fetch/departments');

        if (response && response.data) {
          this.departmentsOptions = response.data;
        }
      } catch (error) {

      }
    },
    async fetchSuperviosrs() {
      try {
        const response = await this.$http.get('/admin/fetch/staff');

        if (response && response.data) {
          this.staffOptions = response.data
        }
      } catch (error) {

      }
    },
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
    <div class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.title.$error }">
          <label class="col-md-3 col-form-label">Title</label>
          <div class="col-md-12">
            <multiselect
              v-model="title"
              :options="['Mr', 'Mrs', 'Miss', 'Ing', 'Dr', 'Prof', 'other']"
            ></multiselect>
            <span
              v-if="$v.title.$error && !$v.title.required"
              class="help-block invalid-feedback"
            >title is required</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.departments.$error }">
          <label class="col-md-3 col-form-label">Deparatments</label>
          <div class="col-md-12">
            <multiselect
              v-model="departments"
              :options="departmentsOptions"
              :multiple="true"
              label="name"
              track-by="id"
            ></multiselect>
            <span
              v-if="$v.departments.$error && !$v.departments.required"
              class="help-block invalid-feedback"
            >departments is required</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.supervisor.$error }">
          <label class="col-md-3 col-form-label">Supervisor</label>
          <div class="col-md-12">
            <select
              v-model.trim="supervisor"
              class="form-control"
              :class="{ 'is-invalid': $v.supervisor.$error }"
            >
              <option disabled value>Select supervisor</option>
              <option
                v-for="option in staffOptions"
                :key="option.id"
                :value="option.id"
              >{{ option.firstname }} {{ option.lastname }}</option>
            </select>
            <span
              v-if="$v.supervisor.$error && !$v.supervisor.required"
              class="help-block invalid-feedback"
            >supervisor is required</span>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.workPhone.$error }">
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
            >work phone is required</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.workLocation.$error }">
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
            >work location is required</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.startDate.$error }">
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
            >start date is required</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.staffId.$error }">
          <label class="col-md-12 col-form-label">Staff Identification Number</label>
          <div class="col-md-12">
            <input
              v-model.trim="staffId"
              class="form-control"
              :class="{ 'is-invalid': $v.staffId.$error }"
              placeholder="Enter staff Identification number"
            />
            <span
              v-if="$v.staffId.$error && !$v.staffId.required"
              class="help-block invalid-feedback"
            >Staff identification number is required</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.rate.$error }">
          <label class="col-md-12 col-form-label">Staff Rate</label>
          <div class="col-md-12">
            <input
              v-model.trim="rate"
              class="form-control"
              :class="{ 'is-invalid': $v.rate.$error }"
              placeholder="Work location"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.rateCurrency.$error }">
          <label class="col-md-12 col-form-label">Rate Currency</label>
          <div class="col-md-12">
            <select
              v-model.trim="rateCurrency"
              class="form-control"
              :class="{ 'is-invalid': $v.rateCurrency.$error }"
            >
              <option disabled value>Select Currency</option>
              <option value="GHS">GHS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
