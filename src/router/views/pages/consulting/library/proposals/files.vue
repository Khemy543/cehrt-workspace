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
                    <div class="row align-items-center justify-content-between">
                      <div class="col-md-6">
                        <h5 class="mt-0 mb-1 font-weight-bold">
                          {{ proposal.title }}
                        </h5>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-danger mr-4 mb-3 mb-sm-0"
                          @click="openModal"
                        >
                          <i class="uil-plus mr-1"></i> Add File
                        </button>
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
                  </div>
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
          <!-- end card -->
        </div>

        <div class="col-12 mt-2">
          <div class="card">
            <div class="card-body">
              <div v-if="combindedFiles.length > 0">
                <div class="row">
                  <div class="col d-flex flex-wrap">
                    <File
                      v-for="report in combindedFiles"
                      :key="report.id"
                      :name="report.name"
                      :path="report.path"
                    />
                  </div>
                </div>
              </div>

              <div v-else class="w-100 d-flex justify-content-center mt-4">
                <img
                  :src="require('@assets/svgs/empty.svg')"
                  alt="no projects"
                  style="width:30%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>

    <AddFileToLibrary
      :action="addFile"
      :deliverables="formattedReportFiles"
      :admin-files="formattedAdminFiles"
      :value="show"
      :loading="uploading"
      title="Add Proposal File"
      @input="show = $event"
    />
  </div>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import File from '@/src/components/file.vue'
import PageHeader from '@components/page-header'
import AddFileToLibrary from '@/src/components/AddFileToLibrary.vue'
import graph from '@/src/msalConfig/graph'
import { v4 as uuidv4 } from 'uuid'
export default {
  page: {
    title: 'Proposal',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    File,
    AddFileToLibrary,
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
      uploading: false,
      adminFiles: [
        {
          id: 'award_of_contract',
          name: 'Award of Contract',
        },
        {
          id: 'request_for_eol',
          name: 'Request of EOl',
        },
        {
          id: 'request_for_proposal',
          name: 'Request For Proposal',
        },
        {
          id: 'corespondents',
          name: 'Corespondents',
        },
      ],
      vReport: null,
      show: false,
      showCreateProject: false,
      correspondents: [],
    }
  },
  computed: {
    combindedFiles() {
      return [...this.reports, ...this.correspondents]
    },
    isConsulting() {
      return this.$store.state.auth.userDepartment.name === 'Consultancy'
    },
    isAdmin() {
      return this.$store.state.auth.userDepartment.name === 'Administration'
    },
    isFinance() {
      return this.$store.state.auth.userDepartment.name === 'Finance'
    },
    formattedReportFiles() {
      if (this.isConsulting) {
        return this.reportTypes.filter(
          (item) =>
            !this.reports.some((report) => report.proposal_type.id === item.id)
        )
      }
      return []
    },
    formattedAdminFiles() {
      if (this.isAdmin) {
        return this.adminFiles.filter(
          (item) => !this.reports.some((report) => report.name === item.name)
        )
      }
      return []
    },
  },
  created() {
    this.getProposal()
    this.getProposalReports()
    this.getReportTypes()
  },
  methods: {
    openModal() {
      this.show = true
    },
    async addFile(form) {
      try {
        this.uploading = true
        const report = this.formattedReportFiles.find(
          (item) => item.id === form.project_type_deliverable_id
        )

        const fileName = form.file_key
          .split('_')
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          .join(' ')

        const extension = form.file.name.split('.').pop()

        const data = await graph.createProposalUploadSession({
          fileName: `${(report && report.report_title) ||
            fileName}.${extension}`,
          fileContent: form.file,
          folder: this.proposal.title,
        })
        const uploadData = await graph.uploadFileInChunk({
          fileName: `${(report && report.report_title) ||
            fileName}.${extension}`,
          fileContent: form.file,
          uploadUrl: data.uploadUrl,
        })

        let requestData = {}
        let method = 'POST'
        let url = `/create/${this.$route.params.id}/proposal-report`
        if (form.file_key) {
          if (form.file_key === 'corespondents') {
            requestData[form.file_key] = [uploadData.webUrl]
          } else {
            requestData[form.file_key] = uploadData.webUrl
          }
        }

        if (this.isAdmin) {
          method = 'PATCH'
          url = `/admin/update/${this.$route.params.id}/proposal`
        }

        const response = await this.$http({
          method,
          url,
          data: {
            ...form,
            report_path: uploadData.webUrl,
            proposal_report_type_id: form.project_type_deliverable_id,
            deadline: new Date(),
            ...requestData,
          },
        })

        if (response) {
          if (this.isConsulting) {
            const file = response.data.report
            this.reports.push({
              ...file,
              name: file.proposal_type.report_title,
              path: file.report_path,
            })
          }

          if (this.isAdmin) {
            this.correspondents = []
            const { corespondent } = response.data
            const awardOfContractFile = {
              id: uuidv4(),
              path: corespondent.award_of_contract,
              name: 'Award Of Contract',
            }
            const requestForEol = {
              id: uuidv4(),
              path: corespondent.request_for_eol,
              name: 'Request For EOL',
            }
            const requestForProposal = {
              id: uuidv4(),
              path: corespondent.request_for_proposal,
              name: 'Request For Proposal',
            }
            if (corespondent.award_of_contract) {
              this.reports.push(awardOfContractFile)
            }
            if (corespondent.request_for_eol) {
              this.reports.push(requestForEol)
            }

            if (corespondent.request_for_proposal) {
              this.reports.push(requestForProposal)
            }
            corespondent.corespondents.forEach((file, index) => {
              this.correspondents.push({
                id: uuidv4(),
                name: `Correspondent (${index + 1})`,
                path: file.corespondent_path,
              })
            })
          }
          this.$bvToast.toast('Project file created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })

          this.show = false
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
      } finally {
        this.uploading = false
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
            : `/fetch/proposal/${this.$route.params.id}/reports`
        const response = await this.$http.get(url)

        if (response) {
          if (department.name === 'Consultancy') {
            this.reports = response.data.map((item) => ({
              ...item,
              path: item.report_path,
              name: item.proposal_type && item.proposal_type.report_title
            }))
          }

          if (department.name === 'Administration') {
            const awardofcontract = {
              id: uuidv4(),
              name: 'Award of contract',
              path: response.data.award_of_contract,
            }

            const requestforeol = {
              id: uuidv4(),
              name: 'Request for EOL',
              path: response.data.request_for_eol,
            }

            const requestforproposal = {
              id: uuidv4(),
              name: 'Request for Proposal',
              path: response.data.request_for_proposal,
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
            
            response.data.correspondents.forEach((file, index) => {
              this.correspondents.push({
                id: file.id,
                name: `Correspondent (${index + 1})`,
                path: file.corespondent_path,
              })
            })

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
