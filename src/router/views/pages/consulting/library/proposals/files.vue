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
                <div class="col-xl-12 col-lg-12">
                  <div class="mt-4 mt-lg-0">
                    <h5 class="mt-0 mb-1 font-weight-bold">
                      {{
                          proposal.title
                      }}
                    </h5>

                    <div class="d-flex items-align-center mt-4">
                      <div>
                        <div class="badge badge-soft-primary font-size-13 font-weight-normal">
                          {{
                              proposal.project_type && proposal.project_type.name
                          }}
                        </div>
                      </div>
                      <div>
                        <div class="badge badge-soft-success font-size-13 font-weight-normal ml-5">{{
                            proposal.funding_option
                        }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Client
                          </p>
                          <h5 class="font-size-16">{{ proposal.client }}</h5>
                        </div>
                      </div><!-- 

                      <div class="col-md-2">
                        <b-dropdown class="d-inline" variant="link" toggle-class="font-weight-bold p-0 align-middle">
                          <template v-slot:button-content>
                            <button id="btn-new-event" class="btn btn-primary mt-4 mr-3">
                              <i class="uil-plus-circle"></i> Create New Report
                            </button>
                          </template>
                          <b-dropdown-item v-for="report in vReportTypes" :key="report.id" href="javascript: void(0);"
                            variant="seconday" @click="openModal(report)">{{ report.report_title }}</b-dropdown-item>
                        </b-dropdown>
                      </div>

                      <div class="col-md-2">
                        <button class="btn btn-white mt-4" @click="showCreateProject = true">
                          <i class="uil-sync"></i> Create Project
                        </button>
                      </div>
                      <div class="col-md-2">
                        <button class="btn btn-white mt-4" @click="exportToLibrary">
                          <i class="uil-sync"></i> Export To Library
                        </button>
                      </div> -->
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
          <h5>Proposal Reports</h5>
          <div class="row mt-4">
            <router-link v-for="report in reports" :key="report.id" :to="`/proposal/${proposal.id}/report/${report.id}`"
              class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <div class="p-2 border rounded mb-3">
                    <div class="media">
                      <div class="avatar-sm font-weight-bold mr-3">
                        <span class="avatar-title rounded bg-soft-primary text-primary">
                          <i class="uil-file-plus-alt font-size-18"></i>
                        </span>
                      </div>
                      <div class="media-body">
                        <div class="d-inline-block mt-2">{{
                            report.proposal_type && report.proposal_type.report_title
                        }}.docx</div>
                      </div>
                      <!-- <div class="float-right mt-1">
                        <div class="p-2">
                          <i class="uil-download-alt font-size-18"></i>
                        </div>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <CreateDeliverable :value="show" :action="createReport" :deliverable="vReport" @input="show = $event" />

        <CreateProjectModal :value="showCreateProject" :action="createProjectFromDeliverable" :project="proposal"
          form-title="Create Project" @input="showCreateProject = $event" />
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
export default {
  page: {
    title: 'Proposal',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateDeliverable,
    CreateProjectModal
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
      showCreateProject: false
    }
  },
  computed: {
    vReportTypes() {
      return this.reportTypes.filter(item => !this.reports.some((report) => report.proposal_type && report.proposal_type.id === item.id));
    }
  },
  created() {
    this.getProposal()
    this.getReportTypes()
    this.getProposalReports();
  },
  methods: {
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
            const response = await this.$http.patch(`/export/${this.$route.params.id}}/proposal`);

            if (response) {

            }
          } catch (error) {

          }
        }
      }
      )
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
        const response = await this.$http.get(`/fetch/proposal/report/types`);

        if (response) {
          this.reportTypes = response.data;
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
        const response = await this.$http.get(`/fetch/proposal/${this.$route.params.id}/reports`);

        if (response) {
          this.reports = response.data;
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
      this.vReport = report;
      this.show = true;
    },
    async createProjectFromDeliverable(form) {
      try {
        const response = await this.$http.post(`/create/project`, { ...form, proposal_id: this.$route.params.id });

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
        const response = await this.$http.post(`/create/${this.$route.params.id}/proposal-report`, {
          report_path: '/root/path',
          proposal_report_type_id: report.id,
          deadline: report.deadline
        });

        if (response) {
          this.reports.push(response.data.report);
          this.$bvToast.toast('Project report created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.show = false;
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
    }
  },
}
</script>

<style scoped>
</style>
