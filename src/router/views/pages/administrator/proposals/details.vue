<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import graph from '@/src/msalConfig/graph'
import File from '@/src/components/file.vue'

export default {
  page: {
    title: 'Proposals',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, File },
  data() {
    return {
      loading: true,
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
    extension(file) {
      return file.name.split('.').pop()
    },
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

    async handleFileUpload({ fileName, file, key }) {
      const data = await graph.uploadProposalFile({
        fileName,
        fileContent: file,
        folder: this.proposal.title,
      })

      const uploadData = await graph.uploadFileInChunk({
        fileName,
        fileContent: file,
        uploadUrl: data.uploadUrl,
      })

      await this.saveProjectData({
        apiKey: key,
        value: uploadData.webUrl,
      })
    },

    async saveProjectData({ apiKey, value }) {
      try {
        let requestData = {}
        if (apiKey === 'correspondents') {
          requestData[apiKey] = [value]
        } else {
          requestData[apiKey] = value
        }
        const response = await this.$http.patch(
          `/admin/update/${this.$route.params.id}/proposal`,
          requestData
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
        return file
      }
      return null
    },
    addNewCorrespondant() {
      this.correspondents.push({
        id: this.correspondents[this.correspondents.length - 1].id + 1,
        file: null,
      })
    },

    async removeFile(key) {
      try {
        let requestData = {}
        requestData[key] = null
        const response = await this.$http.patch(
          `/admin/update/${this.$route.params.id}/proposal`,
          requestData
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
          this.$bvToast.toast('File deleted successfully', {
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
        })
      }
    },
    async deleteCorrespondent(id) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/proposal/${id}/files`
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
              <div class="row align-items-center">
                <div class="col-12">
                  <div class="mt-4 mt-lg-0">
                    <div class="row align-items-center">
                      <div class="col-md-6">
                        <h5 class="mt-0 mb-1 font-weight-bold">
                          {{ proposal.title }}
                        </h5>
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
                      <div v-if="createUrl(awardOfContractFile)">
                        <File
                          name="Award of Contract"
                          :path="createUrl(awardOfContractFile)"
                        />
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
                        v-if="
                          awardOfContractFile &&
                            typeof awardOfContractFile === 'object'
                        "
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Award of contract.${extension(
                              awardOfContractFile
                            )}`,
                            file: awardOfContractFile,
                            key: 'award_of_contract',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="awardOfContractFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeFile('award_of_contract')"
                      >
                        Delete
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
                      <div v-if="createUrl(requestForEol)">
                        <File
                          name="Request for EOl"
                          :path="createUrl(requestForEol)"
                        />
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
                        v-if="
                          requestForEol && typeof requestForEol === 'object'
                        "
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Request for EOI.${extension(
                              requestForEol
                            )}`,
                            file: requestForEol,
                            key: 'request_for_eol',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="requestForEol"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeFile('request_for_eol')"
                      >
                        Delete
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
                      <div v-if="createUrl(requestForProposal)">
                        <File
                          name="Request For Proposal"
                          :path="createUrl(requestForProposal)"
                        />
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
                        v-if="
                          requestForProposal &&
                            typeof requestForProposal === 'object'
                        "
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Request for Proposal.${extension(
                              requestForProposal
                            )}`,
                            file: requestForProposal,
                            key: 'request_for_proposal',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="requestForProposal"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeFile('request_for_proposal')"
                      >
                        Delete
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
                      >
                        <File
                          :name="`Correspondent-${index + 1}`"
                          :path="createUrl(correspondents[index].correspondent_path)"
                        />
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
                        v-if="
                          correspondents[index].correspondent_path &&
                            typeof correspondents[index].correspondent_path ===
                              'object'
                        "
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Correspondent${index + 1}.${extension(
                              correspondents[index].correspondent_path
                            )}`,
                            file: correspondents[index].correspondent_path,
                            key: 'correspondents',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="correspondents[index].correspondent_path"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeCorrespondent(deliverable)"
                      >
                        Delete
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
