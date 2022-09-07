<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateProjectTypeModal from '@components/CreateProjectTypeModal.vue'
import ViewProjectTypesModal from '@/src/components/ViewProjectTypesModal.vue'

export default {
  page: {
    title: 'Project Types',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateProjectTypeModal,
    ViewProjectTypesModal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Project Types',
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
      projectTypes: [],
      searchkey: '',
      projectType: null,
      loading: false,
      show: false,
      formTitle: 'Add New Project Type',
      viewShow: false,
    }
  },
  computed: {
    filteredList() {
      return this.projectTypes.filter(item => {
        return item.name.toLowerCase().includes(this.searchkey.toLowerCase())
      })
    }
  },
  created() {
    this.fetchProjectTypes()
  },
  methods: {
    openCreateWorkFlow() {
      this.projectType = null
      this.formTitle = 'Add New Project Type'
      this.show = true
    },
    async fetchProjectTypes() {
      this.loading = true
      try {
        const response = await this.$http.get(`/fetch/project/types`)

        if (response && response.data) {
          this.projectTypes = response.data || []
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
            name: dev.deliverable_name,
          })),
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

    editProjectType(pType) {
      this.projectType = pType
      this.formTitle = 'Edit Project Type'
      this.show = true
    },

    action(pType) {
      if (this.projectType) {
        return this.updateProjectType(pType)
      }
      return this.createProjectType(pType)
    },

    async updateProjectType(pType) {
      try {
        const response = await this.$http.put(
          `/update/${this.projectType.id}/project/type`,
          {
            name: pType.name,
            deliverable_names: pType.deliverables.map((item) => ({
              id: item.id,
              name: item.deliverable_name,
            })),
          }
        )

        if (response) {
          const index = this.projectTypes.findIndex(
            (item) => item.id === this.projectType.id
          )
          this.projectType = null
          this.formTitle = 'Create Project Type'
          this.show = false
          this.$set(this.projectTypes, index, response.data.projectType)

          this.$bvToast.toast('Project type updated successfully', {
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

    viewProjectType(pType) {
      this.projectType = pType
      this.viewShow = true
    },

    deleteProjectType(pType) {
      this.$swal({
        title: 'Do you want to delete this project type?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${pType.id}/project/type`
            )

            if (response) {
              this.projectTypes = this.projectTypes.filter(
                (item) => item.id !== pType.id
              )
              this.$bvToast.toast('Project type deleted successfully', {
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
            <div class=" d-flex justify-content-between w-100">
              <div style="width: 40%">
                <h4 class="header-title mt-0 mb-1">Project Types</h4>
                <p class="sub-header">
                  view, add and edit details of all project types
                </p>
              </div>
              <div style="width: 30%">
                <b-form-input
                  id="input-1"
                  v-model="searchkey"
                  type="search"
                  placeholder="Search project type..."
                />
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="openCreateWorkFlow"
                >
                  <i class="uil-plus mr-1"></i> Add Project Type
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number of Deliverables</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pType, index) in filteredList" :key="pType.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ pType.name }}</td>
                    <td>{{ pType.deliverables.length || 'N/A' }}</td>
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
                          @click="viewProjectType(pType)"
                          ><i class="uil uil-exit mr-2"></i
                          >View</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="editProjectType(pType)"
                        >
                          <i class="uil uil-edit mr-2"></i>Edit
                        </b-dropdown-item>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deleteProjectType(pType)"
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
      v-if="!loading && projectTypes.length <= 0"
      class=" w-100 d-flex justify-content-center"
    >
      <img
        :src="require('@assets/svgs/empty.svg')"
        alt="no projects"
        style="width:50%"
      />
    </div>
    <CreateProjectTypeModal
      :action="action"
      :value="show"
      :project-type="projectType"
      :form-title="formTitle"
      @input="show = $event"
    />

    <ViewProjectTypesModal
      :value="viewShow"
      :project-type="projectType"
      @input="viewShow = $event"
    />
  </Layout>
</template>
