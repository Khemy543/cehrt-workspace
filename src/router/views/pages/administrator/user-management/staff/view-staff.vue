<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Multiselect from 'vue-multiselect';
import { dateFormate } from '@utils/format-date'

export default {
  page: {
    title: 'View Staff',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'View Staff',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'User Management',
          to: '/user-management/staff',
        },
        {
          text: 'View Staff',
          to: '/',
          active: true,
        },
      ],
      staff: {},
      form: {},
      loading: false,
      titles: ['Mr', 'Mrs', 'Miss', 'Ing', 'Dr', 'Prof', 'other'],
      departmentsOptions: [],
      staffOptions: [],
      roles: []
    }
  },
  computed: {
    fullname() {
      return `${this.staff.firstname} ${this.staff.lastname}`
    },
    adiminId() {
      const roles = this.departmentsOptions.find(item => item.name === 'Administration');
      return roles && roles.id || null;
    },
    consultingId() {
      const roles = this.departmentsOptions.find(item => item.name === 'Consultancy');
      return roles && roles.id || null;
    },
    financeId() {
      const roles = this.departmentsOptions.find(item => item.name === 'Finance');
      return roles && roles.id || null;
    },
    adminRoles() {
      return this.roles.filter(role => role.department.id === this.adiminId);
    },
    consultingRoles() {
      return this.roles.filter(role => role.department.id === this.consultingId);
    },
    financeRoles() {
      return this.roles.filter(role => role.department.id === this.financeId)
    }
  },
  created() {
    this.fetchDepartments();
    this.fetchRoles();
    this.fetchSuperviosrs();
  },
  methods: {
    getIds(departments) {
      return departments.map((items) => items.id)
    },
    async fetchSingleStaff() {
      this.loading = true
      try {
        const response = await this.$http.get(`/admin/fetch/${this.id}/staff`)

        if (response && response.data) {
          this.staff = response.data;
          this.form = {
            ...response.data,
            consultingRoleId: response.data.position.find(item => item.department.id === this.consultingId) && response.data.position.find(item => item.department.id === this.consultingId).id || "",
            financeRoleId: response.data.position.find(item => item.department.id === this.financeId) && response.data.position.find(item => item.department.id === this.financeId).id || "",
            adminRoleId: response.data.position.find(item => item.department.id === this.adiminId) && response.data.position.find(item => item.department.id === this.adiminId).id || "",
            supervisor_id: response.data.supervisor && response.data.supervisor && response.data.supervisor.id || '',
            dob: dateFormate(response.data.dob),
            start_date: dateFormate(response.data.start_date)
          }
          const { firstname, lastname } = response.data
          this.items[2].text = `${firstname} ${lastname}`
          this.title = `${firstname} ${lastname}`
          this.loading = false
        }
      } catch (error) {
        this.$bvToast.toast('Something happend, please try again', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
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
    async fetchRoles() {
      try {
        this.loading = true;
        const response = await this.$http.get('/admin/department/positions');

        if (response) {
          this.roles = response.data;
          this.fetchSingleStaff();
        }
      } catch (error) {

      }
    },

    async handleSubmit() {
      try {
        const positionIds = [];

        if(this.form.financeRoleId) {
          positionIds.push(this.form.financeRoleId);
        }

        if(this.form.adminRoleId) {
          positionIds.push(this.form.adminRoleId)
        }

        if(this.form.consultingRoleId) {
          positionIds.push(this.form.consultingRoleId)
        }
        const response = await this.$http.put(`/admin/update/${this.form.id}/staff`, {
          ...this.form,
          position_ids: positionIds,
          department_ids: this.getIds(this.form.department)
        });

        if (response) {
          this.$bvToast.toast('User updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        let message = 'Something happend, Please try again later'
        if (error.response) {
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }
        }
        this.$bvToast.toast(message,{
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <form class="col-lg-12" @submit.prevent="handleSubmit">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mt-0 mb-1">{{ fullname }}</h4>
            <div class="row">
              <div class="col-md-6">
                <div>
                  <p class="sub-header">
                    {{ staff.email }}
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h4>Edit Details</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="firstname" label="First name" label-for="firstname">
                  <b-form-input id="firstname" v-model="form.firstname" type="text" placeholder="First name">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="lastname" label="Last name" label-for="lastname">
                  <b-form-input id="lastname" v-model="form.lastname" type="text" placeholder="Last name">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="preferred_name" label="Preferred name" label-for="preferred_name">
                  <b-form-input id="preferred_name" v-model="form.preferred_name" type="text"
                    placeholder="Preferred name"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="email" label="Email address" label-for="email">
                  <b-form-input id="email" v-model="form.email" type="email" placeholder="Email address"></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="preferred_name" label="Phone number" label-for="phone_number">
                  <b-form-input id="phone_number" v-model="form.phone_number" type="text" placeholder="Phone number">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="alternate_phone_number" label="Alternate phone number" label-for="email">
                  <b-form-input id="alternate_phone_number" v-model="form.alternate_phone_number" type="text"
                    placeholder="Alternate phone number"></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="address" label="Address" label-for="address">
                  <b-form-input id="address" v-model="form.address" type="text" placeholder="Address"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="dob" label="Date of birth" label-for="dob">
                  <b-form-input id="dob" v-model="form.dob" type="date" placeholder="Date of birth"></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="Ghana_Card_number" label="Ghana Card ID" label-for="Ghana_Card_number">
                  <b-form-input id="Ghana_Card_number" v-model="form.ghana_card_number" type="text" placeholder="Ghana Card ID">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="NHIA_number" label="NHIA Number" label-for="NHIA_number">
                  <b-form-input id="NHIA_number" v-model="form.NHIA_number" type="text" placeholder="NHIA Number">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="marital_status" label="Marital status" label-for="input-1">
                  <b-form-select id="marital_status" v-model="form.marital_status" class="mb-2">
                    <option value="" disabled>Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </b-form-select>
                </b-form-group>
              </div>
              <div v-if="form.marital_status === 'married'" class="col-md-6">
                <b-form-group id="spouse_name" label="Spouse name" label-for="spouse_name">
                  <b-form-input id="spouse_name" v-model="form.spouse_name" type="text" placeholder="Spouse Name">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div v-if="form.marital_status === 'married'" class="row">
              <div class="col-md-6">
                <b-form-group id="spouse_employer" label="Spouse employer" label-for="spouse_employer">
                  <b-form-input id="spouse_employer" v-model="form.spouse_employer" type="text"
                    placeholder="Spouse employer"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="spouse_work_phone" label="Spouse work phone" label-for="spouse_work_phone">
                  <b-form-input id="spouse_work_phone" v-model="form.spouse_work_phone" type="text"
                    placeholder="Spouse work phone"></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="next_of_king_name" label="Name of Next of Kin" label-for="next_of_king_name">
                  <b-form-input id="next_of_king_name" v-model="form.next_of_king_name" type="text"
                    placeholder="Name of next of kin">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="next_of_king_relation" label="Relationship (Next of kin)"
                  label-for="next_of_king_relation">
                  <b-form-input id="next_of_king_relation" v-model="form.next_of_king_relation" type="text"
                    placeholder="Relationship">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="next_of_king_house_address" label="Address (Next of kin)"
                  label-for="next_of_king_house_address">
                  <b-form-input id="next_of_king_house_address" v-model="form.next_of_king_house_address" type="text"
                    placeholder="Address">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="next_of_king_email" label="Email (Next of kin)" label-for="next_of_king_email">
                  <b-form-input id="next_of_king_email" v-model="form.next_of_king_email" type="text"
                    placeholder="Email (Next of kin)">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="next_of_king_phone_number" label="Phone number(Next of kin)"
                  label-for="next_of_king_phone_number">
                  <b-form-input id="next_of_king_phone_number" v-model="form.next_of_king_phone_number" type="text"
                    placeholder="Phone number">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="next_of_king_postal_address" label="Postal Address (Next of kin)"
                  label-for="next_of_king_postal_address">
                  <b-form-input id="next_of_king_postal_address" v-model="form.next_of_king_postal_address" type="text"
                    placeholder="Postal address">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="title" label="Title" label-for="title">
                  <b-form-select id="title" v-model="form.title" class="mb-2">
                    <option value="" disabled>Select title</option>
                    <option v-for="tit in titles" :key="tit" :value="tit">{{ tit }}</option>
                  </b-form-select>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Departments</label>
                  <div class="col-md-12">
                    <multiselect v-model="form.department" :options="departmentsOptions" :multiple="true" label="name"
                      track-by="id"></multiselect>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Consulting Role</label>
                  <div class="col-md-12">
                    <select v-model="form.consultingRoleId" class="form-control">
                      <option disabled value>Select Consulting Role</option>
                      <option v-for="option in consultingRoles" :key="option.id" :value="option.id">{{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Adminstration Role</label>
                  <div class="col-md-12">
                    <select v-model="form.adminRoleId" class="form-control">
                      <option disabled value>Select Adminstration Role</option>
                      <option v-for="option in adminRoles" :key="option.id" :value="option.id">{{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Finance Role</label>
                  <div class="col-md-12">
                    <select v-model="form.financeRoleId" class="form-control">
                      <option disabled value>Select Finance Role</option>
                      <option v-for="option in financeRoles" :key="option.id" :value="option.id">{{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Supervisor</label>
                  <div class="col-md-12">
                    <select v-model="form.supervisor_id" class="form-control">
                      <option disabled value>Select supervisor</option>
                      <option v-for="option in staffOptions" :key="option.id" :value="option.id">{{ option.firstname }}
                        {{ option.lastname }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <b-form-group id="work_phone_number" label="Work phone number" label-for="work_phone_number">
                  <b-form-input id="work_phone_number" v-model="form.work_phone_number" type="text"
                    placeholder="Work phone number">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="work_location" label="Work location" label-for="work_location">
                  <b-form-input id="work_location" v-model="form.work_location" type="text" placeholder="Work location">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="start_date" label="Start Date" label-for="start_date">
                  <b-form-input id="start_date" v-model="form.start_date" type="date" placeholder="Start Date">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <b-form-group id="staff_id" label="Staff ID" label-for="staff_id">
                  <b-form-input id="staff_id" v-model="form.staff_id" type="text" placeholder="Staff ID">
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group id="rate" label="Rate" label-for="rate">
                  <b-form-input id="rate" v-model="form.rate" type="text" placeholder="Rate">
                  </b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="col-md-12 col-form-label">Rate Currency</label>
                  <div class="col-md-12">
                    <select v-model="form.rate_currency" class="form-control">
                      <option disabled value>Select Currency</option>
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <button type="submit" class="btn btn-primary w-100">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </Layout>
</template>
<style scoped>
.sub-header span {
  font-size: medium;
  font-weight: 800;
}
</style>
