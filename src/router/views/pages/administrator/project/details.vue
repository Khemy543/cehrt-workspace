<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import graph from '@/src/msalConfig/graph'
import File from '@/src/components/file.vue'
import AddCorrespondentModal from '@/src/components/Admin/AddCorrespondentModal.vue'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, File, AddCorrespondentModal },
  data() {
    return {
      loading: true,
      project: {},
      contractForm: {},
      title: 'Project Overview',
      show: false,
      uploadLoading: false,
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
      contractFile: null,
      insuranceFile: null,
      permitFile: null,
      reviewFile: null,
      correspondents: [
        {
          id: 1,
          corespondent_path: null,
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
    this.getProjectDetials()
  },
  methods: {
    extension(file) {
      return file.name.split('.').pop()
    },
    handleContractChange({ target }) {
      this.contractFile = target.files[0]
    },
    handleInsuranceChange({ target }) {
      this.insuranceFile = target.files[0]
    },
    handlePermitChange({ target }) {
      this.permitFile = target.files[0]
    },
    handleReveiwCommentChange({ target }) {
      this.reviewFile = target.files[0]
    },
    handleChangeCorrespondent(e, corresItem) {
      const index = this.correspondents.findIndex(
        (item) => item.id === corresItem.id
      )

      this.$set(this.correspondents, index, {
        ...corresItem,
        corespondent_path: e.target.files[0],
      })
    },

    async handleFileUpload({ fileName, file, key }) {
      this.uploadLoading = true;
      const data = await graph.uploadProjectFile({
        fileName,
        fileContent: file,
        folder: this.project.name,
      })

      const uploadData = await graph.uploadFileInChunk({
        fileName,
        fileContent: file,
        uploadUrl: data.uploadUrl,
      })

      await this.saveProjectData({
        apiKey: key,
        value: uploadData.webUrl,
        fileName
      })
      this.uploadLoading = false;
      this.show = false;
    },
    async saveProjectData({ apiKey, value, fileName }) {
      let requestData = {}
      if (apiKey === 'corespondents') {
        requestData[apiKey] = [
          {
            name: fileName,
            corespondent_path: value,
          },
        ]
      } else {
        requestData[apiKey] = value
      }
      try {
        const response = await this.$http.patch(
          `/admin/add/project/${this.$route.params.id}/corespondents`,
          requestData
        )

        if (response) {
          const {
            contract,
            insurance,
            permit,
            review_comment: reviewComment,
            corespondents,
          } = response.data.corespondent
          this.contractFile = contract
          this.insuranceFile = insurance
          this.permitFile = permit
          this.reviewFile = reviewComment
          this.correspondents = corespondents
          this.$bvToast.toast('File uploaded successful', {
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
          toastClass: 'text-white',
        })
      }
    },

    async getProjectDetials() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/admin/fetch/project/${this.$route.params.id}/corespondents`
        )

        if (response && response.data) {
          this.project = response.data
          this.contractFile = response.data.contract
          this.insuranceFile = response.data.insurance
          this.permitFile = response.data.permit
          this.reviewFile = response.data.review_comment
          this.correspondents =
            response.data.corespondents.length > 0
              ? response.data.corespondents
              : [
                  {
                    id: 1,
                    corespondent_path: null,
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
    async removeInsuranceFile() {
      try {
        if (typeof this.insuranceFile === 'object') {
          this.insuranceFile = null
          return
        }
        const response = await this.deletProjectFile('insurance')
        if (response) {
          this.insuranceFile = null
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
    async removeContractFile() {
      try {
        if (typeof this.contractFile === 'object') {
          this.contractFile = null
          return
        }

        const response = await this.deletProjectFile('contract')

        if (response) {
          this.contractFile = null
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
    async removePermitFile() {
      try {
        if (typeof this.permitFile === 'object') {
          this.permitFile = null
          return
        }

        const response = await this.deletProjectFile('permit')

        if (response) {
          this.permitFile = null
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
    async removeReviewComment() {
      try {
        if (typeof this.reviewFile === 'object') {
          this.reviewFile = null
          return
        }

        const response = await this.deletProjectFile('review_comment')

        if (response) {
          this.reviewFile = null
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
    async deletProjectFile(key) {
      try {
        let requestData = {}
        requestData[key] = null
        const response = await this.$http.patch(
          `/admin/add/project/${this.$route.params.id}/corespondents`,
          requestData
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
      this.show = true;
    },
    async deleteCorrespondent(id) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/project/${id}/files`
        )
        if (response) {
          return response
        }
      } catch (error) {}
    },
    async removeCorrespondent(correspondent) {
      try {
        const length = this.correspondents.length
        if (typeof correspondent.corespondent_path === 'string') {
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
              corespondent_path: null,
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
            corespondent_path: null,
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
        <div class="col">
          <div class="card">
            <div class="card-body p-0">
              <div
                class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="page-title" style="padding:0; max-width: 60%;">
                  <h4 class="mt-0">
                    {{ project.name }}
                  </h4>
                  <div
                    class="badge font-size-13 font-weight-normal"
                    :class="
                      project.status === 'overdue'
                        ? ' badge-danger'
                        : project.status === 'ongoing'
                        ? 'badge-primary'
                        : 'badge-success'
                    "
                    >{{ project.status }}</div
                  >
                </div>
              </div>
              <div class="row py-1">
                <div class="card-body">
                  <h6 class="mt-0 header-title">About Project</h6>

                  <div class="text-muted mt-3">
                    <p>{{ project.description }}</p>
                    <div
                      class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
                    >
                      {{
                        project.project_sector && project.project_sector.name
                      }}
                    </div>

                    <div
                      class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                      >{{
                        project.project_type && project.project_type.name
                      }}</div
                    >

                    <div class="row">
                      <div class="col-lg-4 col-md-6">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Coordinator
                          </p>
                          <h5 class="font-size-16">{{
                            (project.coordinator && project.coordinator.name) ||
                              'N/A'
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                        Contract
                      </h5>
                      <div v-if="createUrl(contractFile)">
                        <File
                          name="Contract"
                          type="pdf"
                          :path="createUrl(contractFile)"
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
                        v-if="contractFile && typeof contractFile === 'object'"
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Contract.${extension(contractFile)}`,
                            file: contractFile,
                            key: 'contract',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="contractFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeContractFile"
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
                        Insurance
                      </h5>
                      <div v-if="createUrl(insuranceFile)">
                        <File
                          type="pdf"
                          name="Insurance"
                          :path="createUrl(insuranceFile)"
                        />
                      </div>
                      <div v-else>
                        <input type="file" @change="handleInsuranceChange" />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="
                          insuranceFile && typeof insuranceFile === 'object'
                        "
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Insurance.${extension(insuranceFile)}`,
                            file: insuranceFile,
                            key: 'insurance',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="insuranceFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeInsuranceFile"
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
                          Correspondence
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
                      
                      <div
                        v-if="
                          createUrl(correspondents[index].corespondent_path)
                        "
                      >
                        <File
                          :name="correspondents[index].name || `Correspondent (${index + 1})`"
                          type="pdf"
                          :path="
                            createUrl(correspondents[index].corespondent_path)
                          "
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="correspondents[index].corespondent_path"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeCorrespondent(deliverable)"
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
                        Permit
                      </h5>
                      <div v-if="createUrl(permitFile)">
                        <File
                          name="Permit"
                          type="pdf"
                          :path="createUrl(permitFile)"
                        />
                      </div>
                      <div v-else>
                        <input type="file" @change="handlePermitChange" />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="permitFile && typeof permitFile === 'object'"
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Permit.${extension(permitFile)}`,
                            file: permitFile,
                            key: 'permit',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="permitFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removePermitFile"
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
                        Review Comment
                      </h5>
                      <div v-if="createUrl(reviewFile)">
                        <File
                          name="Review-comment"
                          type="word"
                          :path="createUrl(reviewFile)"
                        />
                      </div>
                      <div v-else>
                        <input
                          type="file"
                          @change="handleReveiwCommentChange"
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        v-if="reviewFile && typeof reviewFile === 'object'"
                        type="button"
                        class="btn btn-soft-primary btn-sm mx-2"
                        @click="
                          handleFileUpload({
                            fileName: `Review Comments.${extension(
                              reviewFile
                            )}`,
                            file: reviewFile,
                            key: 'review_comment',
                          })
                        "
                        >Save</button
                      >
                      <button
                        v-if="reviewFile"
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeReviewComment"
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
    <AddCorrespondentModal
      :action="handleFileUpload"
      :value="show"
      :loading="uploadLoading"
      @input="show = $event"
    />
  </Layout>
</template>
<style scoped>
.hidden {
  display: hidden;
}
</style>
