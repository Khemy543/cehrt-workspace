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
                      {{ proposal.title }}
                    </h5>

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
                      <div class="col-md-6">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Client
                          </p>
                          <h5 class="font-size-16">{{ proposal.client }}</h5>
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
          <h5>Proposal Reports</h5>
          <div class="row mt-4">
            <router-link
              v-for="report in reports"
              :key="report.id"
              :to="`/proposal/${proposal.id}/report/${report.id}`"
              class="col-md-4"
            >
              <div class="card">
                <div class="card-body">
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
                        <div class="d-inline-block mt-2"
                          >{{
                            report.name
                          }}</div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
export default {
  page: {
    title: 'Proposal',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
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
  created() {
    this.getProposal()
    this.getProposalReports()
  },
  methods: {
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

    async getProposalReports() {
      try {
        const rawDepartment = window.localStorage.getItem('user.department')
        const department = JSON.parse(rawDepartment)
        const url =
          department.name === 'Administration'
            ? `/admin/fetch/${this.$route.params.id}/proposal`
            : department.name === 'Finance'
            ? `/finance/fetch/${this.$route.params.id}/project`
            : `/fetch/proposal/${this.$route.params.id}/reports`
        const response = await this.$http.get(url)

        if (response) {
          if (department.name === 'Consultancy') {
            this.reports = response.data.map((item) => ({
              ...item,
              name: item.proposal_type && item.proposal_type.report_title
            }))
          }

          if (department.name === 'Administration') {
            this.awardOfContractFile = response.data.award_of_contract
            this.requestForEol = response.data.request_for_eol
            this.requestForProposal = response.data.request_for_proposal
            const awardofcontract = {
              id: 1,
              name: 'Award of contract',
              file: response.data.award_of_contract,
            }

            const requestforeol = {
              id: 2,
              name: 'Request for EOL',
              file: response.data.request_for_eol,
            }

            const requestforproposal = {
              id: 3,
              name: 'Request for Proposal',
              file: response.data.request_for_proposal,
            }
            if (response.data.award_of_contract) {
              this.reports.push(awardofcontract)
            }
            if (response.data.request_for_eol) {
              this.reports.push(requestforeol)
            }
            if (response.data.request_for_proposal) {
              this.reports.push(requestforproposal)
            }
          }
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
  },
}
</script>

<style scoped></style>
