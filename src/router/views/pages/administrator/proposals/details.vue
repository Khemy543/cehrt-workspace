<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Proposals',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      loading: true,
      project: {},
      proposal: {},
      title: 'Proposal Overview',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Proposal',
          to: '/',
        },
        {
          text: 'Project Name',
          active: true,
        },
      ],
      awardOfContractFile: null,
      requestForEol: null,
      requestForProposal: null,
      correspondents: [
        {
          id: 1,
          correspondent_path: null,
        },
      ],
    }
  },
  computed: {
    initials() {
      return 'AB'
    },
  },
  created() {
    this.getProposalDetails()
  },
  methods: {
    handleContractChange({ target }) {
      this.awardOfContractFile = target.files[0]
    },
    handleRequestForEolChange({ target }) {
      this.requestForEol = target.files[0]
    },
    handleRequestForProposalChange({ target }) {
      this.requestForProposal = target.files[0]
    },
    handleChangeCorrespondent(e, corresItem) {
      const index = this.correspondents.findIndex(
        (item) => item.id === corresItem.id
      )

      this.$set(this.correspondents, index, {
        ...corresItem,
        correspondent_path: e.target.files[0],
      })
    },
    async saveProjectData() {
      try {
        const formData = new FormData()
        if (
          this.awardOfContractFile &&
          typeof this.awardOfContractFile !== 'string'
        ) {
          formData.append('award_of_contract', this.awardOfContractFile)
        }
        if (this.requestForEol && typeof this.requestForEol !== 'string') {
          formData.append('request_for_eol', this.requestForEol)
        }
        if (
          this.requestForProposal &&
          typeof this.requestForProposal !== 'string'
        ) {
          formData.append('request_for_proposal', this.requestForProposal)
        }
        this.correspondents.forEach((file) => {
          if (
            file.correspondent_path &&
            typeof file.correspondent_path !== 'string'
          ) {
            formData.append('correspondents[]', file.correspondent_path)
          }
        })
        formData.append('_method', 'PATCH')

        const response = await this.$http.post(
          `/admin/update/${this.$route.params.id}/proposal`,
          formData
        )

        if (response) {
          const { corespondent } = response.data
          this.awardOfContractFile = corespondent.award_of_contract
          this.requestForEol = corespondent.request_for_eol
          this.requestForProposal = corespondent.request_for_proposal
          this.correspondents =
            corespondent.correspondents.length > 0
              ? corespondent.correspondents
              : [
                  {
                    id: 1,
                    correspondent_path: null,
                  },
                ]
          this.$bvToast.toast('File saved successfully', {
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

    async getProposalDetails() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/admin/fetch/${this.$route.params.id}/proposal`
        )

        if (response && response.data) {
          this.proposal = response.data
          this.awardOfContractFile = response.data.award_of_contract
          this.requestForEol = response.data.request_for_eol
          this.requestForProposal = response.data.request_for_proposal
          this.correspondents =
            response.data.correspondents.length > 0
              ? response.data.correspondents
              : [
                  {
                    id: 1,
                    correspondent_path: null,
                  },
                ]
          this.items[2].text = response.data.name
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
    createUrl(file) {
      if (file && typeof file === 'object') {
        return window.URL.createObjectURL(file)
      }

      if (file && typeof file === 'string') {
        return `${process.env.API_BASE_URL}${file.replace('/', '')}`
      }
      return null
    },
    addNewCorrespondant() {
      this.correspondents.push({
        id: this.correspondents[this.correspondents.length - 1].id + 1,
        file: null,
      })
    },
    async deleteProposalFile(key) {
      try {
        const response = await this.$http.post(
          `/admin/delete/proposal/${this.$route.params.id}/files`,
          {
            file_to_delete: key,
            _method: 'DELETE',
          }
        )

        if (response) {
          return response
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
    async deleteAwardOfContractFile() {
      try {
        if (typeof this.awardOfContractFile === 'object') {
          this.awardOfContractFile = null
          return
        }

        const response = await this.deleteProposalFile('award_of_contract')

        if (response) {
          this.awardOfContractFile = null
          this.$bvToast.toast('File deleted successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
            toastClass: 'text-white',
          })
        }
      } catch (error) {}
    },
    async deleteRequestForProposal() {
      try {
        if (typeof this.requestForProposal === 'object') {
          this.requestForProposal = null
          return
        }

        const response = await this.deleteProposalFile('request_for_proposal')

        if (response) {
          this.requestForProposal = null
          this.$bvToast.toast('File deleted successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
            toastClass: 'text-white',
          })
        }
      } catch (error) {}
    },
    async deleteRequestForEol() {
      try {
        if (typeof this.requestForEol === 'object') {
          this.requestForEol = null
          return
        }

        const response = await this.deleteProposalFile('request_for_eol')

        if (response) {
          this.requestForEol = null
          this.$bvToast.toast('File deleted successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
            toastClass: 'text-white',
          })
        }
      } catch (error) {}
    },
    async deleteCorrespondent(id) {
      try {
        const response = await this.$http.post(
          `/admin/delete/proposal/${this.$route.params.id}/files`,
          {
            correspondent_id: id,
            _method: 'DELETE',
          }
        )
        if (response) {
          return response
        }
      } catch (error) {}
    },
    async removeCorrespondent(correspondent) {
      try {
        const length = this.correspondents.length
        if (typeof correspondent.correspondent_path === 'string') {
          const response = await this.deleteCorrespondent(correspondent.id)

          if (response) {
            if (length > 1) {
              this.correspondents = this.correspondents.filter(
                (item) => item.id !== correspondent.id
              )
              return
            }
            this.$set(this.correspondents, 0, {
              id: 1,
              correspondent_path: null,
            })
          }
        } else {
          if (length > 1) {
            this.correspondents = this.correspondents.filter(
              (item) => item.id !== correspondent.id
            )
            return
          }
          this.$set(this.correspondents, 0, {
            id: 1,
            correspondent_path: null,
          })
        }
      } catch (error) {}
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div
                class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="page-title" style="padding:0">
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
                        >
                          {{ proposal.funding_option }}</div
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
                <div>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="saveProjectData"
                    >Save Changes</button
                  >
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
        </div>
        <!-- end card -->
      </div>
      <div class="row d-flex">
        <div class="col-xl-8">
          <div class="card">
            <div class="card-body">
              <h6 class="mt-0 header-title">Project Documents</h6>

              <ul class="list-unstyled activity-widget">
                <li class="activity-list">
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-16 mt-2 mb-1">
                        Award of Contract
                      </h5>
                      <div v-if="createUrl(awardOfContractFile)" class="row">
                        <a
                          :href="createUrl(awardOfContractFile)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
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
                                  >Award-of-contract.docx</div
                                >
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>

                      <div v-else>
                        <input
                          ref="contract"
                          type="file"
                          @change="handleContractChange"
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="awardOfContractFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="deleteAwardOfContractFile"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>

                <li class="activity-list">
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-16 mt-2 mb-1">
                        Request for EOl
                      </h5>
                      <div v-if="createUrl(requestForEol)" class="row">
                        <a
                          :href="createUrl(requestForEol)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
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
                                  >Request-for-EOL.docx</div
                                >
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div v-else>
                        <input
                          type="file"
                          @change="handleRequestForEolChange"
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="requestForEol"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="deleteRequestForEol"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>

                <li class="activity-list">
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-16 mt-2 mb-1">
                        Request For Proposal
                      </h5>
                      <div v-if="createUrl(requestForProposal)" class="row">
                        <a
                          :href="createUrl(requestForProposal)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
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
                                  >Request-For-Proposal.docx</div
                                >
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div v-else>
                        <input
                          type="file"
                          @change="handleRequestForProposalChange"
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="requestForProposal"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="deleteRequestForProposal"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>

                <li class="activity-list">
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <div class=" d-flex">
                        <h5 class="font-size-16 mt-2 mb-1">
                          Correspondent
                        </h5>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm mx-4"
                          @click="addNewCorrespondant"
                        >
                          <i class="uil-plus font-size-10"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="(deliverable, index) in correspondents"
                    :key="deliverable.id"
                    class="media d-flex justify-content-between align-items-center mb-2"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-14 mt-2 mb-1">
                        {{ deliverable.name }}
                      </h5>
                      <div
                        v-if="
                          createUrl(correspondents[index].correspondent_path)
                        "
                        class="row"
                      >
                        <a
                          :href="
                            createUrl(correspondents[index].correspondent_path)
                          "
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
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
                                  >correspondent.docx
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div v-else>
                        <input
                          ref="contract"
                          type="file"
                          @change="
                            (e) =>
                              handleChangeCorrespondent(
                                e,
                                correspondents[index]
                              )
                          "
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeCorrespondent(deliverable)"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
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
<style scoped>
.hidden {
  display: hidden;
}
</style>
