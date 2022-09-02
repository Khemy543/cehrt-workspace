<script>
import { required } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      title: '',
      supervisor: '',
      workLocation: '',
      workPhone: '',
      startDate: '',
      departments: [],
      departmentsOptions: [],
      staffOptions: [],
      roles: [],
      staffId: null,
      rate: '',
      rateCurrency: 'GHS',
      consultingRoleId: '',
      adminRoleId: '',
      financeRoleId: '',
    }
  },
  computed: {
    adiminId() {
      const roles = this.departmentsOptions.find(
        (item) => item.name === 'Administration'
      )
      return (roles && roles.id) || null
    },
    consultingId() {
      const roles = this.departmentsOptions.find(
        (item) => item.name === 'Consultancy'
      )
      return (roles && roles.id) || null
    },
    financeId() {
      const roles = this.departmentsOptions.find(
        (item) => item.name === 'Finance'
      )
      return (roles && roles.id) || null
    },
    adminRoles() {
      return this.roles.filter((role) => role.department.id === this.adiminId)
    },
    consultingRoles() {
      return this.roles.filter(
        (role) => role.department.id === this.consultingId
      )
    },
    financeRoles() {
      return this.roles.filter((role) => role.department.id === this.financeId)
    },
    showFinaceRole() {
      return this.departments.some((item) => item.id === this.financeId)
    },
    showAdminRole() {
      return this.departments.some((item) => item.id === this.adiminId)
    },
    showConsultingRole() {
      return this.departments.some((item) => item.id === this.consultingId)
    },
  },
  created() {
    this.fetchDepartments()
    this.fetchSuperviosrs()
    this.fetchRoles()
  },
  validations: {
    title: {
      required,
    },
    supervisor: {
      required: false,
    },
    workLocation: {
      required: false,
    },
    workPhone: {
      required: false,
    },
    startDate: {
      required,
    },
    departments: {
      required,
    },
    staffId: {
      required,
    },
    rate: {
      required: false,
    },
    rateCurrency: {
      required: false,
    },
    consultingRoleId: {
      required: false,
    },
    adminRoleId: {
      required: false,
    },
    financeRoleId: {
      required: false,
    },

    form: [
      'title',
      'supervisor',
      'workLocation',
      'workPhone',
      'startDate',
      'departments',
      'staffId',
      'rate',
      'rateCurrency',
      'consultingRoleId',
      'adminRoleId',
      'financeRoleId',
    ],
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$http.get('/admin/fetch/departments')

        if (response && response.data) {
          this.departmentsOptions = response.data
        }
      } catch (error) {}
    },
    async fetchSuperviosrs() {
      try {
        const response = await this.$http.get('/admin/fetch/staff')

        if (response && response.data) {
          this.staffOptions = response.data
        }
      } catch (error) {}
    },
    async fetchRoles() {
      try {
        const response = await this.$http.get('/admin/department/positions')

        if (response) {
          this.roles = response.data
        }
      } catch (error) {}
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
          <label class="col-md-12 col-form-label"
            >Title <span class=" text-danger">*</span></label
          >
          <div class="col-md-12">
            <multiselect
              v-model="title"
              :options="['Mr', 'Mrs', 'Miss', 'Ing', 'Dr', 'Prof', 'other']"
            ></multiselect>
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
          :class="{ 'has-error': $v.departments.$error }"
        >
          <label class="col-md-12 col-form-label"
            >Departments <span class=" text-danger">*</span></label
          >
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
              >departments is required</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="showConsultingRole" class="col-md-6">
        <div class="form-group mb-3">
          <label class="col-md-12 col-form-label">Consulting Role</label>
          <div class="col-md-12">
            <select v-model.trim="consultingRoleId" class="form-control">
              <option disabled value>Select Consulting Role</option>
              <option
                v-for="option in consultingRoles"
                :key="option.id"
                :value="option.id"
                >{{ option.name }}</option
              >
            </select>
          </div>
        </div>
      </div>

      <div v-if="showAdminRole" class="col-md-6">
        <div class="form-group mb-3">
          <label class="col-md-12 col-form-label">Adminstration Role</label>
          <div class="col-md-12">
            <select v-model.trim="adminRoleId" class="form-control">
              <option disabled value>Select Adminstration Role</option>
              <option
                v-for="option in adminRoles"
                :key="option.id"
                :value="option.id"
                >{{ option.name }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div v-if="showFinaceRole" class="col-md-6">
        <div class="form-group mb-3">
          <label class="col-md-12 col-form-label">Finance Role</label>
          <div class="col-md-12">
            <select v-model.trim="financeRoleId" class="form-control">
              <option disabled value>Select Finance Role</option>
              <option
                v-for="option in financeRoles"
                :key="option.id"
                :value="option.id"
                >{{ option.name }}</option
              >
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.supervisor.$error }"
        >
          <label class="col-md-12 col-form-label">Supervisor</label>
          <div class="col-md-12">
            <select
              v-model.trim="supervisor"
              class="form-control"
              :class="{ 'is-invalid': $v.supervisor.$error }"
            >
              <option value="">Select supervisor</option>
              <option
                v-for="option in staffOptions"
                :key="option.id"
                :value="option.id"
                >{{ option.firstname }} {{ option.lastname }}</option
              >
            </select>
            <span
              v-if="$v.supervisor.$error && !$v.supervisor.required"
              class="help-block invalid-feedback"
              >supervisor is required</span
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

    <div class="row">
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
          :class="{ 'has-error': $v.startDate.$error }"
        >
          <label class="col-md-12 col-form-label"
            >Start Date <span class=" text-danger">*</span></label
          >
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
    </div>

    <div class="row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.staffId.$error }"
        >
          <label class="col-md-12 col-form-label"
            >Staff Identification Number
            <span class=" text-danger">*</span></label
          >
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
              >Staff identification number is required</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="showConsultingRole" class="row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.rate.$error }">
          <label class="col-md-12 col-form-label">Staff Rate</label>
          <div class="col-md-12">
            <input
              v-model.trim="rate"
              class="form-control"
              :class="{ 'is-invalid': $v.rate.$error }"
              placeholder="Rate"
            />
          </div>
        </div>
      </div>
      <!--      <div class="col-md-6">-->
      <!--        <div class="form-group mb-3" :class="{ 'has-error': $v.rateCurrency.$error }">-->
      <!--          <label class="col-md-12 col-form-label">Rate Currency</label>-->
      <!--          <div class="col-md-12">-->
      <!--            <select-->
      <!--              v-model.trim="rateCurrency"-->
      <!--              class="form-control"-->
      <!--              :class="{ 'is-invalid': $v.rateCurrency.$error }"-->
      <!--            >-->
      <!--              <option disabled value>Select Currency</option>-->
      <!--              <option value="GHS">GHS</option>-->
      <!--              <option value="USD">USD</option>-->
      <!--            </select>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>
