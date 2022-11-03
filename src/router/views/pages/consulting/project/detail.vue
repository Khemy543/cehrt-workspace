<script>
import appConfig from '@src/app.config'
import graph from '@/src/msalConfig/graph'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateProjectModal from '@components/CreateProjectModal.vue'
import CreateDeliverable from '@components/CreateDeliverable'
import ProjectDeletionModal from '../../../../../components/ProjectDeletionModal.vue'
import ExportProjectForm from '@/src/components/ExportProjectForm.vue'
import File from '@/src/components/file.vue'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateProjectModal,
    CreateDeliverable,
    ProjectDeletionModal,
    ExportProjectForm,
    File
},
  data() {
    return {
      show: false,
      showExport: false,
      formtitle: 'Edit Project',
      showCreateDeliverable: false,
      loading: true,
      project: {},
      title: 'Project Overview',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Projects',
          to: '/',
        },
        {
          text: 'Project Name',
          active: true,
        },
      ],
      vloading: false,
      projectDeliverables: [],
      vDeliverable: null,
      editting: false,
      showProjectDeletionModal: false,
      comment: '',
      comments: [],
      selectedStatus: {},
      projectStatuses: [
        {
          id: 1,
          name: 'Pending',
          api: 'pending',
        },
        {
          id: 2,
          name: 'On going',
          api: 'active',
        },
        {
          id: 3,
          name: 'On hold',
          api: 'hold',
        },
      ],
    }
  },
  computed: {
    assignees() {
      const uniqueIds = []
      const unique =
        this.project.assignees &&
        this.project.assignees.filter((element) => {
          const isDuplicate = uniqueIds.includes(element.id)

          if (!isDuplicate) {
            uniqueIds.push(element.id)

            return true
          }

          return false
        })

      return unique || []
    },
    assigneesCount() {
      return this.assignees.length
    },
    isCoordinator() {
      return (
        this.project.coordinator.id === this.$store.state.auth.currentUser.id
      )
    },
  },
  created() {
    this.getProjectDetials()
    this.getProjectDeliverables()
    this.getComments()
  },
  methods: {
    extension(file) {
      return file.name.split('.').pop()
    },
    async updateDeliverableWithPathName(item) {
      try {
        const response = await this.$http.patch(
          `/update/${item.id}/deliverable/path`,
          {
            document_path: item.document_path,
          }
        )

        if (response) {
          const index = this.projectDeliverables.findIndex(
            (element) => element.id === item.id
          )

          this.$set(this.projectDeliverables, index, response.data.deliverable)
        }
      } catch (error) {}
    },
    showUpdateDeliverable(deliverable) {
      this.vDeliverable = deliverable
      this.editting = true
      this.showCreateDeliverable = true
    },
    getIds(regions) {
      return regions.map((items) => items.id)
    },
    getInitials(name) {
      return name
        .match(/\b(\w)/g)
        .join('')
        .toUpperCase()
    },
    async getComments() {
      try {
        const response = await this.$http.get(
          `/fetch/project/${this.$route.params.id}/comments`
        )

        if (response) {
          this.comments = response.data
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
    async sendComment() {
      try {
        const response = await this.$http.post(
          `/add/project/${this.$route.params.id}/comment`,
          {
            comment: this.comment,
          }
        )

        if (response) {
          this.comments.push(response.data.comment)
          this.comment = ''
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    showDeliverable(deliverable) {
      return !this.projectDeliverables.some(
        (item) => item.project_type_deliverable.id === deliverable.id
      )
    },
    async getProjectDetials() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/${this.$route.params.id}/project`
        )

        if (response && response.data) {
          this.project = response.data
          this.items[2].text = response.data.name
          this.selectedStatus = this.projectStatuses.find(
            (status) => status.api === this.project.status
          )
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

    async getProjectDeliverables() {
      try {
        const response = await this.$http.get(
          `fetch/${this.$route.params.id}/deliverables`
        )

        if (response) {
          this.projectDeliverables = response.data
        }
      } catch (error) {}
    },
    async editProject(form) {
      try {
        const response = await this.$http.put(
          `/update/${this.project.id}/project`,
          form
        )

        if (response) {
          await graph.updateProjectName({
            name: form.name,
            onedriveId: form.onedrive_id,
          })
          this.project = response.data.project

          this.show = false

          this.$bvToast.toast('Project edited successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },

    deleteProject() {
      this.$swal({
        title: 'Send project deletion request?',
        showDenyButton: true,
        confirmButtonText: 'Send',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${this.project.id}/project`
            )

            if (response) {
              this.$bvToast.toast('Project deleted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
                toastClass: 'text-white',
              })
              this.$router.push('/project/list')
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },

    openCreateDeliverable(deliverable) {
      this.vDeliverable = deliverable
      this.showCreateDeliverable = true
    },
    async createDeliverable(form) {
      try {
        this.vloading = true
        const data = await graph.uploadProjectFile({
          fileName: `${form.deliverable_name}.${this.extension(form.file)}`,
          fileContent: form.file,
          folder: this.project.name,
        })

        const uploadData = await graph.uploadFileInChunk({
          fileName: `${form.deliverable_name}.${this.extension(form.file)}`,
          fileContent: form.file,
          uploadUrl: data.uploadUrl,
        })

        const response = await this.$http.post(
          `/project/${this.$route.params.id}/create-deliverable`,
          {
            ...form,
            project_type_deliverable_id: form.id,
            document_path: uploadData.webUrl,
          }
        )

        if (response) {
          this.projectDeliverables.push(response.data.deliverable)
          this.$bvToast.toast('Project deliverable created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })

          this.showCreateDeliverable = false

          this.vDeliverable = null
          this.vloading = false
        }
      } catch (error) {
        console.log(error)
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.showCreateDeliverable = false
        this.vDeliverable = null
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
      this.vloading = false
    },

    async EditDeliverable(form) {
      try {
        let uploadData = null;

        if (form.file) {
          const data = await graph.uploadProjectFile({
            fileName: `${form.project_type_deliverable.deliverable_name}.${this.extension(form.file)}`,
            fileContent: form.file,
            folder: this.project.name,
          })
  
          uploadData = await graph.uploadFileInChunk({
            fileName: `${form.project_type_deliverable.deliverable_name}.${this.extension(form.file)}`,
            fileContent: form.file,
            uploadUrl: data.uploadUrl,
          })
        }

        const response = await this.$http.put(
          `/update/${form.id}/deliverable`,
          {
            ...form,
            project_type_deliverable_id: form.project_type_deliverable.id,
            document_path: uploadData ? uploadData.webUrl : form.document_path
          }
        )

        if (response) {
          const index = this.projectDeliverables.findIndex(
            (item) => item.id === form.id
          )

          this.$set(this.projectDeliverables, index, response.data.deliverable)

          this.$bvToast.toast('Project deliverable updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })

          this.showCreateDeliverable = false
        }
      } catch (error) {
        this.showCreateDeliverable = false
        this.vDeliverable = null
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },

    deleteDeliverable(deliverable) {
      this.$swal({
        title: 'Delete Deliverable',
        text: `Delete ${deliverable.project_type_deliverable.deliverable_name}`,
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${deliverable.id}/deliverable`
            )

            if (response) {
              this.$bvToast.toast('Deliverable deleted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
              this.projectDeliverables = this.projectDeliverables.filter(
                (item) => item.id !== deliverable.id
              )
            }
          } catch (error) {
            let message = 'Something happened, Please try again later'
            if (error.response) {
              const { status, data } = error.response
              if (status === 422) {
                message = data.message
              }
            }
            this.$bvToast.toast(message, {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },

    action(form) {
      if (this.editting) {
        return this.EditDeliverable(form)
      }
      return this.createDeliverable(form)
    },

    async changeStatus(status) {
      try {
        const response = await this.$http.patch(
          `/update/${this.project.id}/project-status`,
          {
            status: status.api,
          }
        )
        if (response) {
          this.project = { ...this.project, status: status.api }
          this.selectedStatus = status
        }
      } catch (e) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    showExportToLibrary() {
      if (this.project.no_of_completed_tasks !== this.project.tasks) {
        return this.$bvToast.toast(
          'Please complete all tasks before exporting to library',
          {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          }
        )
      }
      this.showExport = true
    },
    async exportToLibrary(form) {
      try {
        const { associated_consultants: consultants } = form

        let newFormData = { ...form }

        if (consultants[0].name === '') {
          newFormData.associated_consultants = []
        }
        const response = await this.$http.patch(
          `/export/${this.$route.params.id}/project`,
          { ...newFormData, regionIds: this.getIds(form.regionIds) }
        )

        if (response) {
          await graph.moveProjectToLibrary({
            onedriveId: this.project.onedrive_id,
            name: this.project.name,
          })
          this.$bvToast.toast('Project export successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.$router.push('/project/list')
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
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

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <CreateProjectModal
      :value="show"
      :form-title="formtitle"
      :action="editProject"
      :project="project"
      @input="show = $event"
    />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body p-0">
              <div
                class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="row page-title" style="padding:0">
                  <div class="col-sm-12 col-xl-12 d-flex">
                    <div>
                      <h4 class="mt-0">
                        {{ project.name }}
                      </h4>
                      <div v-if="isCoordinator">
                        <b-dropdown
                          class="d-inline"
                          variant="link"
                          toggle-class="font-weight-bold p-0 align-middle"
                        >
                          <template v-slot:button-content>
                            {{ selectedStatus.name }}
                            <i
                              class="uil uil-angle-down font-size-16 align-middle"
                            ></i>
                          </template>
                          <b-dropdown-item
                            v-for="status in projectStatuses"
                            :key="status.id"
                            href="javascript: void(0);"
                            variant="seconday"
                            @click="changeStatus(status)"
                          >
                            {{ status.name }}
                          </b-dropdown-item>
                        </b-dropdown>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="isCoordinator"
                  class="col-sm-4 col-xl-6 text-sm-right"
                >
                  <router-link
                    :to="`/project/${project.id}/project-plan`"
                    class="btn-group ml-2 d-none d-sm-inline-block"
                  >
                    <button type="button" class="btn btn-soft-info btn-sm">
                      <i class="uil uil-edit mr-1"></i>View Project Plan
                    </button>
                  </router-link>
                  <div class="btn-group ml-2 d-none d-sm-inline-block">
                    <button
                      type="button"
                      class="btn btn-soft-success btn-sm"
                      @click="showExportToLibrary"
                    >
                      <i class="uil uil-edit mr-1"></i>Export to Library
                    </button>
                  </div>
                  <div class="btn-group ml-2 d-none d-sm-inline-block">
                    <button
                      type="button"
                      class="btn btn-soft-primary btn-sm"
                      @click="show = true"
                    >
                      <i class="uil uil-edit mr-1"></i>Edit
                    </button>
                  </div>
                  <div class="btn-group d-none d-sm-inline-block ml-1">
                    <button
                      type="button"
                      class="btn btn-soft-danger btn-sm"
                      @click="showProjectDeletionModal = true"
                    >
                      <i class="uil uil-trash-alt mr-1"></i>Delete
                    </button>
                  </div>
                </div>
                <div v-else class="col-sm-4 col-xl-6 text-sm-right"></div>
              </div>
              <div class="row py-1">
                <!-- Widget -->

                <div class="col-xl-3 col-sm-6">
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="grid"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">{{ project.tasks }}</h4>
                      <span class="text-muted">Total Task</span>
                    </div>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6">
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="check-square"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">
                        {{ project.no_of_completed_tasks }}
                      </h4>
                      <span class="text-muted">Total Tasks Completed</span>
                    </div>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6">
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="clock"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">
                        {{ project.no_of_pending_tasks }}
                      </h4>
                      <span class="text-muted">Total Pending Task</span>
                    </div>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6">
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="users"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">{{ assigneesCount }}</h4>
                      <span class="text-muted">Total Assignees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- details-->
      <div class="row">
        <div class="col-xl-8">
          <div class="card">
            <div class="card-body">
              <h6 class="mt-0 header-title">About Project</h6>

              <div class="text-muted mt-3">
                <p>{{ project.description }}</p>
                <div
                  class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
                >
                  {{ project.project_sector && project.project_sector.name }}
                </div>

                <div
                  class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                  >{{ project.project_type && project.project_type.name }}</div
                >

                <div class="row">
                  <div class="col-lg-4 col-md-6">
                    <div class="mt-4">
                      <p class="mb-2">
                        <i class="uil-user text-danger"></i> Coordinator
                      </p>
                      <h5 class="font-size-16">{{
                        project.coordinator.name || 'N/A'
                      }}</h5>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6">
                    <div class="mt-4">
                      <p class="mb-2">
                        <i class="uil-calender text-danger"></i> Start Date
                      </p>
                      <h5 class="font-size-16">{{ project.start_date }}</h5>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6">
                    <div class="mt-4">
                      <p class="mb-2">
                        <i class="uil-user text-danger"></i> Client
                      </p>
                      <h5 class="font-size-16">{{ project.client }}</h5>
                    </div>
                  </div>
                </div>

                <div class="assign team mt-4">
                  <h6 class="font-weight-bold">Assign To</h6>
                  <div v-if="assignees.length > 0" class="route d-flex">
                    <div
                      v-for="user in assignees"
                      :id="`${user.id}-assignee`"
                      :key="user.id"
                      class="rounded-circle default-avatar member-overlap-item d-flex justify-content-center align-items-center"
                      style="cursor: pointer;"
                    >
                      <b-tooltip
                        :target="`${user.id}-assignee`"
                        triggers="hover"
                        placement="bottom"
                        >{{ user.name }}</b-tooltip
                      >
                      {{ getInitials(user.name) }}
                    </div>
                  </div>
                  <h5 v-else>No Assignees</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- end card -->
          <!-- end card -->
          <div class="card">
            <div class="card-body">
              <b-tabs pills class="navtab-bg">
                <b-tab title="Discussion" active>
                  <h5 class="mb-4 pb-1 header-title"
                    >Comments ({{ comments.length }})</h5
                  >
                  <div
                    v-for="com in comments"
                    :key="com.id"
                    class="media mb-4 font-size-14"
                  >
                    <div class="mr-3">
                      <a href="#">
                        <div
                          class="avatar-sm rounded-circle mr-2 bg-primary mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                        >
                          {{ getInitials(com.user) }}</div
                        >
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">{{ com.user }}</h5>
                      <p class="text-muted mb-1">
                        {{ com.comment }}
                      </p>
                    </div>
                  </div>

                  <form class="media" @submit.prevent="sendComment">
                    <div class="media-body">
                      <input
                        v-model="comment"
                        type="text"
                        class="form-control input-sm"
                        placeholder="Some text value..."
                      />
                    </div>
                  </form>
                </b-tab>
                <b-tab title="Files/Resources">
                  <h5 class="mb-3 header-title">Attached Files</h5>
                  <div class="d-flex align-items-center mt-2">
                    <div v-for="dev in projectDeliverables" :key="dev.id">
                      <File 
                        :path="dev.document_path"
                        :name="dev.project_type_deliverable.deliverable_name"
                        type="word"
                      />
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Review Comment">
                  <h5 class="mb-3 header-title">Review Comment</h5>
                  <div v-if="project.review_comment" class="row">
                    <div class="col-md-4">
                      <a :href="project.review_comment" target="_blank">
                        <div class="p-2 border rounded mb-3">
                          <div class="media">
                            <div class="avatar-sm font-weight-bold mr-3">
                              <span
                                class="avatar-title rounded bg-soft-primary text-primary"
                              >
                                <i class="uil-file-plus-alt font-size-18"></i>
                              </span>
                            </div>
                            <div class="media-body">
                              <div href="#" class="d-inline-block mt-2"
                                >Review Comment</div
                              >
                            </div>
                            <div class="float-right mt-1">
                              <a :href="project.review_comment" target="_blank">
                                <feather
                                  type="log-in"
                                  class="icons-xs"
                                ></feather>
                              </a>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body">
              <h6 class="mt-0 header-title">Project Deliverables</h6>

              <ul class="list-unstyled activity-widget">
                <li
                  v-for="deliverable in projectDeliverables"
                  :key="deliverable.id"
                  class="activity-list"
                >
                  <div class="media d-flex justify-content-between">
                    <router-link
                      :to="
                        `/project/${$route.params.id}/deliverable/${deliverable.id}`
                      "
                      class="text-dark"
                    >
                      <div class="media-body overflow-hidden">
                        <h5 class="font-size-15 mt-2 mb-1">
                          {{
                            deliverable.project_type_deliverable &&
                              deliverable.project_type_deliverable
                                .deliverable_name
                          }}
                        </h5>
                        <div class="d-flex">
                          <div>
                            <router-link
                              :id="`task-tooltip-${deliverable.id}`"
                              :to="
                                `/project/${$route.params.id}/deliverable/${deliverable.id}`
                              "
                              class="text-muted d-inline-block bg-transparent"
                            >
                              <b-tooltip
                                :target="`task-tooltip-${deliverable.id}`"
                                triggers="hover"
                                placement="top"
                                >Tasks
                              </b-tooltip>
                              <i class="uil uil-bars mr-1 text-primary"></i>
                              {{ deliverable.tasks_count || 0 }} task(s)
                            </router-link>
                          </div>
                          <div class=" mx-2">
                            <router-link
                              :id="`deadline-tooltip-${deliverable.id}`"
                              :to="
                                `/project/${$route.params.id}/deliverable/${deliverable.id}`
                              "
                              class="text-muted d-inline-block bg-transparent"
                            >
                              <b-tooltip
                                :target="`deadline-tooltip-${deliverable.id}`"
                                triggers="hover"
                                placement="top"
                                >Due Date
                              </b-tooltip>
                              <i
                                class="uil-calendar-slash mr-1 text-danger"
                              ></i>
                              {{ deliverable.deadline }}
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </router-link>
                    <div class="d-flex">
                      <button
                        type="button"
                        class="btn btn-soft-secondary btn-sm"
                        @click="showUpdateDeliverable(deliverable)"
                      >
                        <i class="uil uil-edit"></i>
                      </button>

                      <button
                        type="button"
                        class="btn btn-soft-danger ml-2 btn-sm"
                        @click="deleteDeliverable(deliverable)"
                      >
                        <i class="uil uil-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-for="deliver in project.project_type &&
                    project.project_type.deliverables"
                  :key="deliver.name"
                >
                  <div v-if="showDeliverable(deliver)" class="activity-list">
                    <div class="media d-flex justify-content-between">
                      <div class="media-body overflow-hidden">
                        <h5 class="font-size-15 mt-2 mb-1">
                          <div class="text-dark">
                            {{ deliver.deliverable_name }}
                          </div>
                        </h5>
                      </div>
                      <button
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                        @click="openCreateDeliverable(deliver)"
                      >
                        <i class="uil uil-plus"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h6 class="mt-0 header-title">View and upload project media and documents</h6>

              <div class="wrapper">
                <a
                  target="_blank"
                  :href="project.images_path"
                  class="image-wrapper"
                >
                  <img src="@assets/images/photos.png" alt="" class="image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateDeliverable
      :action="action"
      :value="showCreateDeliverable"
      :deliverable="vDeliverable"
      :editting="editting"
      :loading="vloading"
      @input="($event) => { 
        showCreateDeliverable = $event;
        vDeliverable = null
      }"
    />

    <ProjectDeletionModal
      :close="() => (showProjectDeletionModal = false)"
      :value="showProjectDeletionModal"
      @input="showProjectDeletionModal = $event"
    />

    <ExportProjectForm
      :value="showExport"
      :action="exportToLibrary"
      :project="project"
      @input="showExport = $event"
    />
  </Layout>
</template>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.image-wrapper {
  cursor: pointer;
  width: 80%;
  margin-top: 10px;
}
.image {
  width: 100%;
  height: auto;
}
#grid_groups_wrapper {
  max-width: 800px;
}

.default-avatar {
  background-color: #5369f8;
  font-weight: 500;
  color: #fff;
  font-size: 16px;
}

.default-avatar,
.member-overlap-item {
  height: 50px;
  width: 50px;
}

.table td,
.table th {
  padding: 0.75rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
}

.member-overlap-item {
  margin-right: -10px;
  border: 2px solid #fff;
}

.group {
  min-height: 40px;
  height: auto;
  line-height: 1.6rem;
}

.grid-icon {
  vertical-align: middle;
  line-height: 1;
}

.group-class {
  height: 1rem;
  line-height: 4rem;
  vertical-align: middle;
}
</style>
