<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import UpdateDepartment from '@components/UpdateDepartment.vue'
import ViewPositions from '@/src/components/ViewPositions.vue'

export default {
  page: {
    title: 'Departments & Positions',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    UpdateDepartment,
    ViewPositions
},
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Departments & Positions',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Project Types',
          to: '',
          active: true,
        },
      ],
      departments: [],
      department: null,
      loading: false,
      show: false,
      formTitle: 'Add New Project Type',
      viewShow: false,
    }
  },
  created() {
    this.fetchDepartments()
  },
  methods: {
    openCreateWorkFlow() {
      this.department = null
      this.formTitle = 'Add New Project Type'
      this.show = true
    },
    async fetchDepartments() {
      this.loading = true
      try {
        const response = await this.$http.get(`/admin/fetch/departments`)

        if (response && response.data) {
          this.departments = response.data || []
          this.loading = false
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

    async createProjectType(form) {
      try {
        const respoonse = await this.$http.post('/create/project/type', {
          ...form,
          deliverable_names: form.deliverables.map((dev) => ({
            name: dev.deliverable_name
          }))
        })

        if (respoonse) {
          this.workFlows.push(respoonse.data.workflow)
          this.show = false
          this.$bvToast.toast('Work flow created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
      }
    },

    editDepartment(department) {
      this.department = department;
      this.formTitle = 'Edit Department'
      this.show = true
    },

    /* action(pType) {
      if (this.projectType) {
        return this.updatePosition(pType)
      }
      return this.createProjectType(pType)
    }, */

    async updatePosition(department) {
      try {
        const response = await this.$http.put(
          `/admin/update/${this.department.id}/department`,
          department
        )

        if (response) {
          const index = this.departments.findIndex(
            (item) => item.id === response.data.id
          );

          this.$set(this.departments, index, response.data)
          // this.departments[index] = response.data
          this.department = null
          this.formTitle = 'Create Department'
          this.show = false

          this.$bvToast.toast('Department updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
      }
    },

    viewPositioin(department) {
      this.department = department
      this.viewShow = true
    },

    /* deleteWorkFlow(workflow) {
      this.$swal({
        title: 'Do you want to delete this work flow?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${workflow.id}/workflow`
            )

            if (response) {
              this.workFlows = this.workFlows.filter(
                (item) => item.id !== workflow.id
              )
              this.$bvToast.toast('Work flow deleted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
                toastClass: 'text-white',
              })
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
              toastClass: 'text-white',
            })
          }
        }
      })
    }, */
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
                <h4 class="header-title mt-0 mb-1">Departments & Positions</h4>
                <p class="sub-header">
                  view, add and edit details of all departments and positions
                </p>
              </div>
              <!-- <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="openCreateWorkFlow"
                >
                  <i class="uil-plus mr-1"></i> Add  Type
                </button>
              </div> -->
            </div>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number of Positions</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(depart, index) in departments" :key="depart.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ depart.name }}</td>
                    <td>{{ depart.positions.length || 'N/A' }}</td>
                    <td class=" d-flex">
                      <b-dropdown
                        variant="link"
                        class=" position-absolute"
                        toggle-class="p-0 text-muted arrow-none"
                      >
                        <template v-slot:button-content>
                          <i class="uil uil-ellipsis-v font-size-14"></i>
                        </template>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="viewPositioin(depart)"
                          ><i class="uil uil-exit mr-2"></i
                          >View</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="editDepartment(depart)"
                        >
                          <i class="uil uil-edit mr-2"></i>Edit
                        </b-dropdown-item>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deleteWorkFlow(depart)"
                        >
                          <i class="uil uil-trash-alt mr-2"></i>Delete
                        </b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && departments.length <= 0"
      class=" w-100 d-flex justify-content-center"
    >
      <img
        :src="require('@assets/svgs/empty.svg')"
        alt="no projects"
        style="width:50%"
      />
    </div>
    <UpdateDepartment
      :action="updatePosition"
      :value="show"
      :department="department"
      :form-title="formTitle"
      @input="show = $event"
    />

    <ViewPositions
      :value="viewShow"
      :department="department"
      @input="viewShow = $event"
    />
  </Layout>
</template>
