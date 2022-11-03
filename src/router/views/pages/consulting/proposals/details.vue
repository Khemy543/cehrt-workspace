<template>
  <div>
    <Layout>
      <PageHeader :title="title" :items="items" />
      <div v-if="loading" class="d-flex justify-content-center">
        <b-spinner type="grow" variant="primary"></b-spinner>
      </div>
      <div v-else class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-12">
                  <div class="mt-4 mt-lg-0">
                    <div class="row align-items-center">
                      <div class="col-md-6">
                        <h5 class="mt-0 mb-1 font-weight-bold">
                          {{ proposal.title }}
                        </h5>
                      </div>
                      <div class="col-md-6 d-flex justify-content-end">
                        <div>
                          <b-dropdown
                            class="d-inline"
                            variant="link"
                            toggle-class="font-weight-bold p-0 align-middle"
                          >
                            <template v-slot:button-content>
                              <button
                                id="btn-new-event"
                                class="btn btn-primary mr-3"
                              >
                                <i class="uil-plus-circle"></i> Create New
                                Proposal
                              </button>
                            </template>
                            <b-dropdown-item
                              v-for="report in vReportTypes"
                              :key="report.id"
                              href="javascript: void(0);"
                              variant="seconday"
                              @click="openModal(report)"
                              >{{ report.report_title }}</b-dropdown-item
                            >
                          </b-dropdown>
                        </div>

                        <div>
                          <button
                            class="btn btn-danger mr-3"
                            @click="showCreateProject = true"
                          >
                            Create Project
                          </button>
                        </div>
                        <div>
                          <button
                            class="btn btn-white"
                            @click="exportToLibrary"
                          >
                            Export To Library
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="row mt-5">
                      <div class="col-xl-4 col-sm-6">
                        <p class="mb-1">
                          <i class="uil-user text-danger"></i> Client
                        </p>
                        <h5 class="font-size-16">{{ proposal.client }}</h5>
                      </div>

                      <div class="col-xl-4 col-sm-6">
                        <p class="mb-1">
                          <i class="uil-user text-danger"></i> Project Type
                        </p>
                        <h5 class="font-size-16">{{
                          proposal.project_type && proposal.project_type.name
                        }}</h5>
                      </div>

                      <div class="col-xl-4 col-sm-6">
                        <p class="mb-1">
                          <i class="uil-user text-danger"></i> Funding
                        </p>
                        <h5 class="font-size-16">{{
                          proposal.funding_option
                        }}</h5>
                      </div>
                    </div>

                    <hr />

                    <div class="row">
                      <!-- Widget -->

                      <div class="col-xl-3 col-sm-6">
                        <!-- stat 1 -->
                        <div class="media p-3">
                          <feather
                            type="grid"
                            class="align-self-center icon-dual icon-lg mr-4"
                          ></feather>
                          <div class="media-body">
                            <h4 class="mt-0 mb-0">0</h4>
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
                              0
                            </h4>
                            <span class="text-muted"
                              >Total Tasks Completed</span
                            >
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
                              0
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
                            <h4 class="mt-0 mb-0">0</h4>
                            <span class="text-muted">Total Assignees</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
          <!-- end card -->
        </div>

        <div class="col-12 mt-2">
          <div class="row">
            <div class="col-md-7">
              <div v-if="!loading && reports.length > 0">
                <!-- <div> </div> -->
                <div class="card">
                  <div class="card-body py-0 px-5">
                    <ul class="list-unstyled activity-widget row">
                      <li
                        v-for="report in reports"
                        :key="report.id"
                        class="activity-list col-md-12"
                      >
                        <div
                          class="media d-flex justify-content-between align-items-center"
                        >
                          <router-link
                            :to="
                              `/proposal/${$route.params.id}/report/${report.id}`
                            "
                            class="text-dark"
                          >
                            <div class="media-body overflow-hidden">
                              <h5 class="font-size-15 mb-3">
                                {{
                                  report.proposal_type &&
                                    report.proposal_type.report_title
                                }}
                              </h5>
                              <div class="d-flex">
                                <div>
                                  <router-link
                                    :id="`task-tooltip-${report.id}`"
                                    :to="
                                      `/proposal/${$route.params.id}/report/${report.id}`
                                    "
                                    class="text-muted d-inline-block bg-transparent"
                                  >
                                    <b-tooltip
                                      :target="`task-tooltip-${report.id}`"
                                      triggers="hover"
                                      placement="top"
                                      >Tasks
                                    </b-tooltip>
                                    <i
                                      class="uil uil-bars mr-1 text-primary"
                                    ></i>
                                    {{ report.tasks_count || 0 }} task(s)
                                  </router-link>
                                </div>
                                <div class=" mx-2">
                                  <router-link
                                    :id="`deadline-tooltip-${report.id}`"
                                    :to="
                                      `/proposal/${$route.params.id}/report/${report.id}`
                                    "
                                    class="text-muted d-inline-block bg-transparent"
                                  >
                                    <b-tooltip
                                      :target="`deadline-tooltip-${report.id}`"
                                      triggers="hover"
                                      placement="top"
                                      >Due Date
                                    </b-tooltip>
                                    <i
                                      class="uil-calendar-slash mr-1 text-danger"
                                    ></i>
                                    {{ report.deadline }}
                                  </router-link>
                                </div>
                              </div>
                            </div>
                          </router-link>

                          <div>
                            <File
                              :name="
                                report.proposal_type &&
                                  report.proposal_type.report_title
                              "
                              type="word"
                              :path="report.report_path"
                            />
                          </div>
                          <div class="d-flex">
                            <button
                              type="button"
                              class="btn btn-soft-secondary btn-sm"
                              @click="showUpdateReport(report)"
                            >
                              <i class="uil uil-edit"></i>
                            </button>

                            <button
                              type="button"
                              class="btn btn-soft-danger ml-2 btn-sm"
                              @click="deleteReport(report)"
                            >
                              <i class="uil uil-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div
                v-if="!loading && reports.length <= 0"
                class=" w-100 d-flex justify-content-center"
              >
                <img
                  :src="require('@assets/svgs/empty.svg')"
                  alt="no projects"
                  style="width:30%"
                />
              </div>
            </div>
            <div class="col-md-5">
              <div class="card">
                <div class="card-body">
                  <b-tabs pills class="navtab-bg">
                    <b-tab title="Renumeration Calculator" active>
                      <div>
                        <File
                          type="excel"
                          name="Renumeration Calulator"
                          :path="proposal.proposal_path"
                        />
                      </div>
                    </b-tab>
                    <b-tab title="Proposal Request">
                      <div class="row">
                        <div v-if="proposal.request_for_eol" class="col-md-4">
                          <File
                            type="pdf"
                            name="Request For EOI"
                            :path="proposal.request_for_eol"
                          />
                        </div>
                        <div
                          v-if="proposal.request_for_proposal"
                          class="col-md-4"
                        >
                          <File
                            type="pdf"
                            name="Request For Proposal"
                            :path="proposal.request_for_proposal"
                          />
                        </div>
                      </div>
                    </b-tab>
                  </b-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateDeliverable
          :value="show"
          :action="handleSubmit"
          :deliverable="vReport"
          :editting="editting"
          @input="setShow"
        />

        <CreateProjectModal
          :value="showCreateProject"
          :action="createProjectFromProposal"
          :project="proposal"
          form-title="Create Project"
          @input="showCreateProject = $event"
        />
      </div>
    </Layout>
  </div>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateDeliverable from '@/src/components/CreateDeliverable.vue'
import CreateProjectModal from '@/src/components/CreateProjectModal.vue'
import graph from '@/src/msalConfig/graph'
import File from '@/src/components/file.vue'
export default {
  page: {
    title: 'Proposal',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateDeliverable,
    CreateProjectModal,
    File,
  },
  data() {
    return {
      title: 'Proposal',
      items: [
        {
          text: 'Cehrt',
          href: '/',
        },
        {
          text: 'Proposals',
          href: '/proposal',
        },
        {
          text: 'Proposal',
          active: true,
        },
      ],
      proposal: {},
      loading: false,
      reportTypes: [],
      reports: [],
      vReport: null,
      show: false,
      editting: false,
      showCreateProject: false,
    }
  },
  computed: {
    vReportTypes() {
      return this.reportTypes.filter(
        (item) =>
          !this.reports.some(
            (report) =>
              report.proposal_type && report.proposal_type.id === item.id
          )
      )
    },
  },
  created() {
    this.getProposal()
    this.getReportTypes()
    this.getProposalReports()
  },
  methods: {
    setShow(value) {
      this.vReport = null
      this.show = value
    },
    handleSubmit(form) {
      if (this.editting) {
        return this.updateReport(form)
      }
      return this.createReport(form)
    },
    extension(file) {
      return file.name.split('.').pop()
    },
    exportToLibrary() {
      this.$swal({
        title: 'Export proposal to library?',
        showDenyButton: true,
        confirmButtonText: 'Export',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(
              `/export/${this.$route.params.id}}/proposal`
            )

            if (response) {
              await graph.moveProposalToLibrary({
                onedriveId: this.proposal.onedrive_id,
                name: this.proposal.title,
              })
              this.$bvToast.toast('Project exported to library successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
              setTimeout(() => {
                this.$router.push('/proposals/view-proposals')
              }, 2000)
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
    async getProposal() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/${this.$route.params.id}/proposal`
        )

        if (response) {
          this.proposal = response.data
          this.items[2].text = response.data.title
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

    async getReportTypes() {
      try {
        const response = await this.$http.get(`/fetch/proposal/report/types`)

        if (response) {
          this.reportTypes = response.data
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

    async getProposalReports() {
      try {
        const response = await this.$http.get(
          `/fetch/proposal/${this.$route.params.id}/reports`
        )

        if (response) {
          this.reports = response.data
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
    openModal(report) {
      this.vReport = report
      this.editting = false
      this.show = true
    },

    showUpdateReport(report) {
      this.vReport = report
      this.editting = true
      this.show = true
    },
    async createProjectFromProposal(form) {
      try {
        const response = await this.$http.post(`/create/project`, {
          ...form,
          proposal_id: this.$route.params.id,
        })

        if (response) {
          this.$bvToast.toast('Project deliverable created successfully', {
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
    async deleteReport(report) {
      this.$swal({
        title: 'Delete Deliverable',
        text: `Delete ${report.proposal_type &&
          report.proposal_type.report_title}`,
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${report.id}/proposal-report`
            )

            if (response) {
            }
          } catch (error) {}
        }
      })
    },
    async createReport(report) {
      try {
        const data = await graph.uploadProposalFile({
          fileName: `${report.report_title}.${this.extension(report.file)}`,
          fileContent: report.file,
          folder: this.proposal.title,
        })

        const uploadData = await graph.uploadFileInChunk({
          fileName: `${report.report_title}.${this.extension(report.file)}`,
          fileContent: report.file,
          uploadUrl: data.uploadUrl,
        })

        const response = await this.$http.post(
          `/create/${this.$route.params.id}/proposal-report`,
          {
            report_path: uploadData.webUrl,
            proposal_report_type_id: report.id,
            deadline: report.deadline,
          }
        )

        if (response) {
          this.reports.push(response.data.report)
          this.$bvToast.toast('Project report created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.show = false
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

    async updateReport(report) {
      try {
        let uploadData = null
        if (report.file) {
          const data = await graph.uploadProposalFile({
            fileName: `${report.proposal_type.report_title}.${this.extension(
              report.file
            )}`,
            fileContent: report.file,
            folder: this.proposal.title,
          })

          uploadData = await graph.uploadFileInChunk({
            fileName: `${report.proposal_type.report_title}.${this.extension(
              report.file
            )}`,
            fileContent: report.file,
            uploadUrl: data.uploadUrl,
          })
        }

        const response = await this.$http.put(
          `/update/${report.id}/proposal-report`,
          {
            report_path: uploadData ? uploadData.webUrl : report.report_path,
            proposal_report_type_id: report.proposal_type.id,
            deadline: report.deadline,
          }
        )

        if (response) {
          if (response) {
            const index = this.reports.findIndex(
              (item) => item.id === report.id
            )

            this.$set(this.reports, index, response.data.report)

            this.$bvToast.toast('Proposal report updated successfully', {
              title: 'Success',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'success',
            })

            this.show = false
          }
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

<style scoped></style>
