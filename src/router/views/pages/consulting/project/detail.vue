<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateProjectModal from '@components/CreateProjectModal.vue'

import { widgetData, projectActivity } from './data-projectdetail'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, CreateProjectModal },
  data() {
    return {
      widgetData: widgetData,
      show: false,
      formtitle: 'Edit Project',
      projectActivity: projectActivity,
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
    }
  },
  created() {
    this.getProjectDetials()
  },
  methods: {
    async getProjectDetials() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/${this.$route.params.id}/project`
        )

        if (response && response.data) {
          this.project = response.data
          this.items[2].text = response.data.name
          this.loading = false
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
          const { project } = response.data

          this.project = project

          this.closeModal()

          this.$bvToast.toast('Project edited successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
            toastClass: 'text-white',
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
          toastClass: 'text-white',
        })
      }
    },

    deleteProject() {
      this.$swal({
        title: 'Do you want to delete this project?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
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
              toastClass: 'text-white',
            })
          }
        }
      })
    },
    closeModal() {
      this.show = false
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <CreateProjectModal
      :show="show"
      :form-title="formtitle"
      :close="closeModal"
      :action="editProject"
      :project="project"
    />
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else>
      <div class=" row">
        <div class="col">
          <div class="card">
            <div class="card-body p-0">
              <div
                class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="row page-title" style="padding:0">
                  <div class="col-sm-12 col-xl-12">
                    <h4 class="mt-0">
                      Project: {{ project.name }}
                      <div
                        class="badge font-size-13 font-weight-normal ml-3"
                        :class="
                          project.status === 'pending'
                            ? ' badge-danger'
                            : project.status === 'ongoing'
                            ? 'badge-warning'
                            : 'badge-success'
                        "
                        >{{ project.status }}</div
                      >
                    </h4>
                  </div>
                </div>

                <div class="col-sm-4 col-xl-6 text-sm-right">
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
                      @click="deleteProject"
                    >
                      <i class="uil uil-trash-alt mr-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
              <div class="row py-1">
                <!-- Widget -->

                <div
                  class="col-xl-3 col-sm-6"
                >
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

                <div
                  class="col-xl-3 col-sm-6"
                >
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="check-square"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">{{ project.no_of_completed_tasks }}</h4>
                      <span class="text-muted">Total Tasks Completed</span>
                    </div>
                  </div>
                </div>

                <div
                  class="col-xl-3 col-sm-6"
                >
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="clock"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">{{ project.no_of_pending_tasks }}</h4>
                      <span class="text-muted">Total Pending Task</span>
                    </div>
                  </div>
                </div>

                <div
                  class="col-xl-3 col-sm-6"
                >
                  <!-- stat 1 -->
                  <div class="media p-3">
                    <feather
                      type="users"
                      class="align-self-center icon-dual icon-lg mr-4"
                    ></feather>
                    <div class="media-body">
                      <h4 class="mt-0 mb-0">{{ project.assignees }}</h4>
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
                <p>
                  {{ project.description }}
                </p>
                <div
                  class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
                  >{{
                    project.project_sector && project.project_sector.name
                  }}</div
                >

                <div
                  class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                  >{{ project.project_type && project.project_type.name }}</div
                >

                <div class="row">
                  <div class="col-lg-3 col-md-6">
                    <div class="mt-4">
                      <p class="mb-2">
                        <i class="uil-calender text-danger"></i> Start Date
                      </p>
                      <h5 class="font-size-16">{{ project.start_date }}</h5>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <div class="mt-4">
                      <p class="mb-2">
                        <i class="uil-calendar-slash text-danger"></i> Due Date
                      </p>
                      <h5 class="font-size-16">{{ project.end_date }}</h5>
                    </div>
                  </div>

                  <div class="col-lg-3 col-md-6">
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
                  <div v-if="project.assignees !== 0">
                    <a href="javascript: void(0);">
                      <img
                        src="@assets/images/users/avatar-2.jpg"
                        alt
                        class="avatar-sm m-1 rounded-circle"
                      />
                    </a>
                    <a href="javascript: void(0);">
                      <img
                        src="@assets/images/users/avatar-3.jpg"
                        alt
                        class="avatar-sm m-1 rounded-circle"
                      />
                    </a>
                    <a href="javascript: void(0);">
                      <img
                        src="@assets/images/users/avatar-9.jpg"
                        alt
                        class="avatar-sm m-1 rounded-circle"
                      />
                    </a>
                    <a href="javascript: void(0);">
                      <img
                        src="@assets/images/users/avatar-10.jpg"
                        alt
                        class="avatar-sm m-1 rounded-circle"
                      />
                    </a>
                  </div>
                  <h5>No Assignees</h5>
                </div>

                <!-- <div class="mt-4">
                  <h6 class="font-weight-bold">Attached Files</h6>

                  <div class="row">
                    <div class="col-xl-4 col-md-6">
                      <div class="p-2 border rounded mb-2">
                        <div class="media">
                          <div class="avatar-sm font-weight-bold mr-3">
                            <span
                              class="avatar-title rounded bg-soft-primary text-primary"
                            >
                              <i class="uil-file-plus-alt font-size-18"></i>
                            </span>
                          </div>
                          <div class="media-body">
                            <a
                              href="javascript: void(0);"
                              class="d-inline-block mt-2"
                              >Landing 1.psd</a
                            >
                          </div>
                          <div class="float-right mt-1">
                            <a href="javascript: void(0);" class="p-2">
                              <i class="uil-download-alt font-size-18"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4 col-md-6">
                      <div class="p-2 border rounded mb-2">
                        <div class="media">
                          <div class="avatar-sm font-weight-bold mr-3">
                            <span
                              class="avatar-title rounded bg-soft-primary text-primary"
                            >
                              <i class="uil-file-plus-alt font-size-18"></i>
                            </span>
                          </div>
                          <div class="media-body">
                            <a
                              href="javascript: void(0);"
                              class="d-inline-block mt-2"
                              >Landing 2.psd</a
                            >
                          </div>
                          <div class="float-right mt-1">
                            <a href="javascript: void(0);" class="p-2">
                              <i class="uil-download-alt font-size-18"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <!-- end card -->
          <!-- end card -->
          <div class="card">
            <div class="card-body">
              <b-tabs pills class="navtab-bg">
                <b-tab title="Discussion" active>
                  <h5 class="mb-4 pb-1 header-title">Comments (6)</h5>
                  <div class="media mb-4 font-size-14">
                    <div class="mr-3">
                      <a href="#">
                        <img
                          class="media-object rounded-circle avatar-sm"
                          alt
                          src="@assets/images/users/avatar-2.jpg"
                        />
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">John Cooks</h5>
                      <p class="text-muted mb-1">
                        <a href class="text-danger">@Rick Perry</a>
                        Their separate existence is a myth.
                      </p>
                      <a href class="text-primary">Reply</a>
                    </div>
                  </div>
                  <div class="media mb-4 font-size-14">
                    <div class="mr-3">
                      <a href="#">
                        <img
                          class="media-object rounded-circle avatar-sm"
                          alt
                          src="@assets/images/users/avatar-3.jpg"
                        />
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">Jayden Dowie</h5>
                      <p class="text-muted mb-1">
                        <a href class="text-danger">@Rick Perry</a>
                        It will be as simple as occidental in fact be Occidental
                        will seem like simplified.
                      </p>
                      <a href class="text-primary">Reply</a>

                      <div class="media mt-3 font-size-14">
                        <div class="d-flex mr-3">
                          <a href="#">
                            <div
                              class="avatar-sm font-weight-bold d-inline-block m-1"
                            >
                              <span
                                class="avatar-title rounded-circle bg-soft-primary text-primary"
                                >R</span
                              >
                            </div>
                          </a>
                        </div>
                        <div class="media-body">
                          <h5 class="mt-0 font-size-15">Ray Roberts</h5>
                          <p class="text-muted mb-0">
                            <a href class="text-danger">@Rick Perry</a>
                            Cras sit amet nibh libero.
                          </p>
                          <a href class="text-primary">Reply</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="media mb-4 font-size-14">
                    <div class="mr-3">
                      <a href="#">
                        <img
                          class="media-object rounded-circle avatar-sm"
                          alt
                          src="@assets/images/users/avatar-2.jpg"
                        />
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">John Cooks</h5>
                      <p class="text-muted">
                        <a href class="text-danger">@Rick Perry</a>
                        Itaque earum rerum hic
                      </p>
                      <div class="p-2 border rounded mb-2">
                        <div class="media">
                          <div class="avatar-sm font-weight-bold mr-3">
                            <span
                              class="avatar-title rounded bg-soft-primary text-primary"
                            >
                              <i class="uil-file-plus-alt font-size-18"></i>
                            </span>
                          </div>
                          <div class="media-body">
                            <a href="#" class="d-inline-block mt-2">
                              Landing 1.psd
                            </a>
                          </div>
                          <div class="float-right mt-1">
                            <a href="#" class="p-2">
                              <i class="uil-download-alt font-size-18"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <a href class="text-primary">Reply</a>
                    </div>
                  </div>
                  <div class="media">
                    <div class="d-flex mr-3">
                      <a href="#">
                        <img
                          class="media-object rounded-circle avatar-sm"
                          alt
                          src="@assets/images/users/avatar-1.jpg"
                        />
                      </a>
                    </div>
                    <div class="media-body">
                      <input
                        type="text"
                        class="form-control input-sm"
                        placeholder="Some text value..."
                      />
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Files/Resources">
                  <h5 class="mb-3 header-title">Attached Files</h5>
                  <div>
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
                          <a href="#" class="d-inline-block mt-2">
                            Landing 1.psd
                          </a>
                        </div>
                        <div class="float-right mt-1">
                          <a href="#" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
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
                          <a href="#" class="d-inline-block mt-2">
                            Landing 2.psd
                          </a>
                        </div>
                        <div class="float-right mt-1">
                          <a href="#" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="p-2 border rounded mb-3">
                      <div>
                        <a href="#" class="d-inline-block m-1">
                          <img
                            src="@assets/images/small/img-2.jpg"
                            alt
                            class="avatar-lg rounded"
                          />
                        </a>
                        <a href="#" class="d-inline-block m-1">
                          <img
                            src="@assets/images/small/img-3.jpg"
                            alt
                            class="avatar-lg rounded"
                          />
                        </a>
                        <a href="#" class="d-inline-block m-1">
                          <img
                            src="@assets/images/small/img-4.jpg"
                            alt
                            class="avatar-lg rounded"
                          />
                        </a>
                      </div>
                    </div>

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
                          <a href="#" class="d-inline-block mt-2">Logo.psd</a>
                        </div>
                        <div class="float-right mt-1">
                          <a href="#" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="p-2 border rounded mb-3">
                      <div>
                        <a href="#" class="d-inline-block m-1">
                          <img
                            src="@assets/images/small/img-7.jpg"
                            alt
                            class="avatar-lg rounded"
                          />
                        </a>
                        <a href="#" class="d-inline-block m-1">
                          <img
                            src="@assets/images/small/img-6.jpg"
                            alt
                            class="avatar-lg rounded"
                          />
                        </a>
                      </div>
                    </div>

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
                          <a href="#" class="d-inline-block mt-2"
                            >Clients.psd</a
                          >
                        </div>
                        <div class="float-right mt-1">
                          <a href="#" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
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
                  v-for="deliverable in project.project_type && project.project_type.deliverables"
                  :key="deliverable.id"
                  class="activity-list"
                >
                  <div class="media">
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-2 mb-1">
                        <router-link
                          :to="`/project/deliverable/${deliverable.id}`"
                          class="text-dark"
                          >{{ deliverable.deliverable_name }}</router-link
                        >
                      </h5>
                      <div class=" d-flex justify-content-between">
                        <div>
                          <a
                            :id="`task-tooltip-${deliverable.id}`"
                            href="javascript: void(0)"
                            class="text-muted d-inline-block bg-transparent"
                          >
                            <b-tooltip
                              :target="`task-tooltip-${deliverable.id}`"
                              triggers="hover"
                              placement="top"
                              >Tasks</b-tooltip
                            >
                            <i class="uil uil-bars mr-1"></i>
                            {{ deliverable.task || 0 }} task(s)
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class=""> </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
