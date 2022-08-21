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
                    <div class="row">
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

                    <div class="d-flex items-align-center mt-4">
                      <div>
                        <div
                          class="badge badge-soft-primary font-size-13 font-weight-normal"
                        >
                          {{
                            proposal.project_type && proposal.project_type.name
                          }}
                        </div>
                      </div>
                      <div>
                        <div
                          class="badge badge-soft-success font-size-13 font-weight-normal ml-5"
                          >{{ proposal.funding_option }}</div
                        >
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 d-flex mt-4">
                        <div class="">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Client
                          </p>
                          <h5 class="font-size-16">{{ proposal.client }}</h5>
                        </div>
                        <div>
                        <div class="shadow-none border ml-5">
                          <div
                            class="p-1 px-2"
                            style="cursor: pointer;"
                            @click="openFile"
                          >
                            <div class="row align-items-center">
                              <div class="col-auto">
                                <div class="avatar-sm font-weight-bold mr-3">
                                  <span
                                    class="avatar-title rounded bg-soft-success text-success"
                                  >
                                    <i
                                      class="uil-file-plus-alt font-size-18"
                                    ></i>
                                  </span>
                                </div>
                              </div>
                              <div class="col pl-0">
                                <div class="text-muted font-weight-bold">World bank renumeration calculator.xlsx</div>
                              </div>
                            </div>
                          </div>
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
          <h5>Proposal Types</h5>
          <div v-if="!loading && reports.length > 0" class="row mt-4">
            <router-link
              v-for="report in reports"
              :key="report.id"
              :to="`/proposal/${proposal.id}/report/${report.id}`"
              class="col-md-3"
            >
              <div class="card" style="min-height: 180px;">
                <div class="card-body position-relative">
                  <div class="p-2  rounded mb-3">
                    <div class="">
                      <div class="">
                        <div class="d-inline-block mt-2 font-size-15">{{
                          report.proposal_type &&
                            report.proposal_type.report_title
                        }}</div>
                      </div>
                    </div>
                  </div>
                  <div class=" position-absolute" style="bottom: 5px;">
                    <ul class="list-inline">
                      <li class="list-inline-item pr-1">
                        <a
                          :id="`date-tooltip-${report.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`date-tooltip-${report.id}`"
                            triggers="hover"
                            placement="top"
                            >Due date
                          </b-tooltip>
                          <i class="uil uil-calender mr-1"></i>
                          {{ report.deadline }}
                        </a>
                      </li>
                      <li class="list-inline-item pr-1">
                        <a
                          :id="`task-tooltip-${report.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`task-tooltip-${report.id}`"
                            triggers="hover"
                            placement="top"
                            >Tasks
                          </b-tooltip>
                          <i class="uil uil-bars mr-1"></i>
                          {{ report.tasks || 0 }}
                        </a>
                      </li>
                      <li class="list-inline-item">
                        <a
                          :id="`comment-tooltip-${report.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`comment-tooltip-${report.id}`"
                            triggers="hover"
                            placement="top"
                          >
                            Comments</b-tooltip
                          >
                          <i class="uil uil-comments-alt mr-1"></i>
                          {{ report.comments || 0 }}
                        </a>
                      </li>
                      <li class="list-inline-item pr-2">
                        <a
                          :id="`date-tooltip-${report.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`date-tooltip-${report.progress}`"
                            triggers="hover"
                            placement="top"
                          >
                          </b-tooltip>
                          <i class="uil uil-check-square mr-1"></i>
                          {{ report.progress || 0 }}%
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </router-link>
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

        <CreateDeliverable
          :value="show"
          :action="createReport"
          :deliverable="vReport"
          @input="show = $event"
        />

        <CreateProjectModal
          :value="showCreateProject"
          :action="createProjectFromDeliverable"
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
    openFile() {
     window.open(this.proposal.proposal_path,'_blank');
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
      this.show = true
    },
    async createProjectFromDeliverable(form) {
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
    async createReport(report) {
      try {
        const data = await graph.uploadProposalFile({
          fileName: `${report.report_title}.docx`,
          fileContent: report.file,
          folder: this.proposal.title,
        })

        const uploadData = await graph.uploadFileInChunk({
          fileName: `${report.report_title}.docx`,
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
  },
}
</script>

<style scoped></style>
