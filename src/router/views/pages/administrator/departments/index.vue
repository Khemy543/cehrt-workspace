<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'View Departments',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'View Departments',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'View Departments',
          to: '/user-management/staff',
          active: true,
        },
      ],
      departments: [],
      loading: false,
      show: false,
      form: {},
      formtitle: 'Add Department',
    }
  },
  created() {
    this.fetchDepartments()
  },
  methods: {
    async fetchDepartments() {
      this.loading = true
      try {
        const response = await this.$http.get(`/admin/fetch/departments`)

        if (response && response.data) {
          this.departments = response.data
          this.loading = false
        }
      } catch (error) {}
    },

    async createDepartment() {
      try {
        const response = await this.$http.post(
          '/admin/add/department',
          this.form
        )

        if (response && response.data) {
          this.departments.push(response.data)
          this.show = false
          this.form = {}
          this.$bvToast.toast('new department added successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
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

    async updateDepartment(id) {
      try {
        const response = await this.$http.put(
          `/admin/update/${id}/department`,
          this.form
        )

        if (response && response.data) {
          const index = this.departments.findIndex((item) => item.id === id)
          this.departments[index] = response.data
          this.show = false
          this.form = {}
          this.$bvToast.toast('Department updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        this.$bvToast.toast('Something happend, please try again', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      } finally {
        this.formtitle = 'Add Department'
      }
    },

    handleSubmit() {
      if (this.form.id) {
        return this.updateDepartment(this.form.id)
      }
      return this.createDepartment()
    },

    openModal(id) {
      this.form = this.departments.find((item) => item.id === id)
      this.formtitle = 'Edit Department'
      this.show = true
    },

    async deleteDepartment(id) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/${id}/department`
        )

        if (response && response.data) {
          this.departments = this.departments.filter((item) => item.id !== id)
        }
      } catch (error) {}
    },
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
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class=" d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">View Departments</h4>
                <p class="sub-header">
                  view, add and edit details of all department
                </p>
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="show = true"
                >
                  <i class="uil-plus mr-1"></i> Add Department
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col" class=" text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(department, index) in departments"
                    :key="department.id"
                    :title="department.description"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ department.name }}</td>
                    <td>{{ department.description }}</td>
                    <td class=" d-flex justify-content-center">
                      <div class="col-sm-4 col-xl-6 text-sm-right">
                        <div class="btn-group ml-2 d-none d-sm-inline-block">
                          <button
                            type="button"
                            class="btn btn-soft-primary btn-sm"
                            @click="openModal(department.id)"
                          >
                            <i class="uil uil-edit mr-1"></i>
                          </button>
                        </div>
                        <div class="btn-group d-none d-sm-inline-block ml-3">
                          <button
                            type="button"
                            class="btn btn-soft-danger btn-sm"
                            @click="deleteDepartment(department.id)"
                          >
                            <i class="uil uil-trash-alt mr-1"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="show"
      :title="formtitle"
      title-class="font-18"
      hide-footer
    >
      <form @submit.prevent="handleSubmit">
        <b-form-group
          id="input-group-1"
          label="Name of Department"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.name"
            type="text"
            required
            placeholder="Department name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description">
          <b-form-textarea
            id="example-textarea"
            v-model="form.description"
            placeholder="description of department"
            rows="4"
          ></b-form-textarea>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </b-modal>
  </Layout>
</template>
