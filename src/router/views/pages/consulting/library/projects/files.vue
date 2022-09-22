<!-- eslint-disable vue/no-v-html -->
<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import AddFileToLibrary from '@/src/components/AddFileToLibrary.vue'
import graph from '@/src/msalConfig/graph'
import { v4 as uuidv4 } from 'uuid'

export default {
  page: {
    title: 'Project Library',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    AddFileToLibrary,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Library',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Library',
          to: '',
          active: true,
        },
      ],
      loading: false,
      uploading: false,
      project: {},
      library: [],
      correspondents: [],
      invoice: [],
      timeSheet: [],
      show: false,
      adminFiles: [
        {
          id: 'contract',
          name: 'Contract',
        },
        {
          id: 'insurance',
          name: 'Insurance',
        },
        {
          id: 'permit',
          name: 'Permit',
        },
        {
          id: 'review_comment',
          name: 'Review Comments',
        },
        {
          id: 'corespondents',
          name: 'Corespondents',
        },
      ],
      financeFiles: [
        {
          id: 'contract',
          name: 'Contract',
        },
        {
          id: 'insurance',
          name: 'Insurance',
        },
      ],
    }
  },
  computed: {
    isConsulting() {
      return this.$store.state.auth.userDepartment.name === 'Consultancy'
    },
    isAdmin() {
      return this.$store.state.auth.userDepartment.name === 'Administration'
    },
    isFinance() {
      return this.$store.state.auth.userDepartment.name === 'Finance'
    },
    deliverables() {
      return (
        (this.project.project_type && this.project.project_type.deliverables) ||
        []
      )
    },
    combindedFiles() {
      return [...this.library, ...this.correspondents]
    },
    formattedDeliverables() {
      if (this.isConsulting) {
        return this.deliverables.filter(
          (item) =>
            !this.library.some(
              (library) => library.project_type_deliverable.id === item.id
            )
        )
      }
      return []
    },

    formattedAdminFiles() {
      if (this.isAdmin) {
        return this.adminFiles.filter(
          (item) => !this.library.some((library) => library.name === item.name)
        )
      }
      return []
    },

    formattedFinanceFiles() {
      if (this.isFinance) {
        return this.financeFiles.filter(
          (item) => !this.library.some((library) => library.name === item.name)
        )
      }
      return []
    },
    department() {
      return this.$store ? this.$store.state.auth.userDepartment : {} || {}
    },
  },
  created() {
    this.getProjectsLibrary()
    this.getProjectDeliverables()
  },
  methods: {
    async addFile(form) {
      try {
        this.uploading = true
        const deliverable = this.formattedDeliverables.find(
          (item) => item.id === form.project_type_deliverable_id
        )

        const fileName = form.file_key
          .split('_')
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          .join(' ')

        const extension = form.file.name.split('.').pop()

        const data = await graph.createUploadSession({
          fileName: `${(deliverable && deliverable.deliverable_name) ||
            fileName}.${extension}`,
          fileContent: form.file,
          folder: this.project.name,
        })
        const uploadData = await graph.uploadFileInChunk({
          fileName: `${(deliverable && deliverable.deliverable_name) ||
            fileName}.${extension}`,
          fileContent: form.file,
          uploadUrl: data.uploadUrl,
        })

        let requestData = {}
        let method = 'POST'
        let url = `/project/${this.$route.params.id}/create-deliverable`
        if (form.file_key) {
          if (form.file_key === 'corespondents') {
            requestData[form.file_key] = [uploadData.webUrl]
          } else {
            requestData[form.file_key] = uploadData.webUrl
          }
        }

        if (this.isAdmin) {
          method = 'PATCH'
          url = `/admin/add/project/${this.$route.params.id}/corespondents`
        }

        if (this.isFinance) {
          method = 'PATCH'
          url = `/finance/update/${this.$route.params.id}/project`
        }

        const response = await this.$http({
          method,
          url,
          data: { ...form, document_path: uploadData.webUrl, ...requestData },
        })

        if (response) {
          if (this.isConsulting) {
            const file = response.data.deliverable
            this.library.push({
              id: file.id,
              name:
                file.project_type_deliverable &&
                file.project_type_deliverable.deliverable_name,
              file: file.document_path,
              project_type_deliverable: file.project_type_deliverable,
              document_path: file.document_path,
            })
          }

          if (this.isFinance) {
            const { project } = response.data;
            this.library = []
            const contract = {
              id: 1,
              name: 'Contract',
              document_path: project.contract,
            }

            const insurance = {
              id: 2,
              name: 'Insurance',
              document_path: project.insurance,
            }

            if (project.contract) {
              this.library.push(contract)
            }

            if (project.insurance) {
              this.library.push(insurance)
            }
            project.deliverables.forEach((item) => {
              this.library.push({
                id: uuidv4(),
                name: `Invoice (${item.name})`,
                document_path: item.invoice,
              })

              this.library.push({
                id: uuidv4(),
                name: `Time Sheet (${item.name})`,
                document_path: item.timesheet,
              })
            })
          }

          if (this.isAdmin) {
            this.correspondents = []
            const { corespondent } = response.data
            const contract = {
              id: 1,
              name: 'Contract',
              document_path: corespondent.contract,
            }
            const insurance = {
              id: 2,
              name: 'Insurance',
              document_path: corespondent.insurance,
            }
            const permit = {
              id: 3,
              name: 'Permit',
              document_path: corespondent.permit,
            }
            const reviewComment = {
              id: 4,
              name: 'Review Comments',
              document_path: corespondent.review_comment,
            }

            if (response.data.contract) {
              this.library.push(contract)
            }

            if (response.data.insurance) {
              this.library.push(insurance)
            }
            if (response.data.permit) {
              this.library.push(permit)
            }
            if (response.data.review_comment) {
              this.library.push(reviewComment)
            }

            // this.library = [contract, insurance, permit, reviewComment];

            corespondent.corespondents.forEach((file, index) => {
              this.correspondents.push({
                id: uuidv4(),
                name: `Correspondent (${index + 1})`,
                document_path: file.corespondent_path,
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

    async getProjectDeliverables() {
      try {
        const rawDepartment = window.localStorage.getItem('user.department')
        const department = JSON.parse(rawDepartment)
        const url =
          department.name === 'Administration'
            ? `/admin/fetch/project/${this.$route.params.id}/corespondents`
            : department.name === 'Finance'
            ? `/finance/fetch/${this.$route.params.id}/project`
            : `fetch/${this.$route.params.id}/deliverables`
        const response = await this.$http.get(url)

        if (response) {
          if (department.name === 'Administration') {
            const contract = {
              id: 1,
              name: 'Contract',
              document_path: response.data.contract,
            }
            const insurance = {
              id: 2,
              name: 'Insurance',
              document_path: response.data.insurance,
            }
            const permit = {
              id: 3,
              name: 'Permit',
              document_path: response.data.permit,
            }
            const reviewComment = {
              id: 4,
              name: 'Review Comments',
              document_path: response.data.review_comment,
            }

            if (response.data.contract) {
              this.library.push(contract)
            }

            if (response.data.insurance) {
              this.library.push(insurance)
            }
            if (response.data.permit) {
              this.library.push(permit)
            }
            if (response.data.review_comment) {
              this.library.push(reviewComment)
            }

            // this.library = [contract, insurance, permit, reviewComment];

            response.data.corespondents.forEach((file, index) => {
              this.correspondents.push({
                id: uuidv4(),
                name: `Correspondent (${index + 1})`,
                document_path: file.corespondent_path,
              })
            })
          }

          if (department.name === 'Finance') {
            const contract = {
              id: 1,
              name: 'Contract',
              document_path: response.data.contract,
            }

            const insurance = {
              id: 2,
              name: 'Insurance',
              document_path: response.data.insurance,
            }

            if (response.data.contract) {
              this.library.push(contract)
            }

            if (response.data.insurance) {
              this.library.push(insurance)
            }
            response.data.deliverables.forEach((item) => {
              this.library.push({
                id: uuidv4(),
                name: `Invoice (${item.name})`,
                document_path: item.invoice,
              })

              this.library.push({
                id: uuidv4(),
                name: `Time Sheet (${item.name})`,
                document_path: item.timesheet,
              })
            })
          }

          if (department.name === 'Consultancy') {
            response.data.forEach((file) => {
              this.library.push({
                id: file.id,
                name:
                  file.project_type_deliverable &&
                  file.project_type_deliverable.deliverable_name,
                file: file.document_path,
                project_type_deliverable: file.project_type_deliverable,
                document_path: file.document_path,
              })
            })
          }
        }
      } catch (error) {}
    },
    async getProjectsLibrary() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/library/${this.$route.params.id}/project`
        )

        if (response) {
          this.project = response.data
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
    openModal() {
      this.show = true
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mt-0">
                  Project: {{ project.name }}
                  <div
                    class="badge font-size-13 font-weight-normal ml-3"
                    :class="
                      project.status === 'pending'
                        ? ' badge-warning'
                        : project.status === 'ongoing'
                        ? 'badge-primary'
                        : project.status === 'overdue'
                        ? 'badge-danger'
                        : 'badge-success'
                    "
                    >{{ project.status }}</div
                  >
                </h4>
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

            <h6 class="mt-0 header-title">Project description</h6>

            <p class=" mt-1">{{ project.description }}</p>

            <h6 class="mt-3 header-title">Service description</h6>

            <p class=" mt-1" v-html="project.service_description"/>

            <div class="text-muted">
              <div
                class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
              >
                {{ project.project_sector && project.project_sector.name }}
              </div>

              <div
                class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                >{{ project.project_type && project.project_type.name }}</div
              >
            </div>

            <div class="row">
              <div class="col-lg-3 col-md-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-user text-danger"></i> Coordinator
                  </p>
                  <h5 class="font-size-16">{{
                    (project.coordinator && project.coordinator.name) || 'N/A'
                  }}</h5>
                </div>
              </div>
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
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="combindedFiles.length > 0" class="mt-5">
              <div class="row mt-4">
                <a
                  v-for="n in combindedFiles"
                  :key="n.id"
                  :href="n.document_path"
                  target="_blank"
                  class="col-md-3"
                >
                  <div class="p-2 border rounded mb-4">
                    <div class="media align-items-center">
                      <div class="avatar-sm font-weight-bold mr-3">
                        <span
                          class="avatar-title rounded bg-soft-primary text-primary"
                        >
                          <i class="uil-file-plus-alt font-size-18"></i>
                        </span>
                      </div>
                      <div class="media-body">
                        <div class="d-inline-block">{{ n.name }}</div>
                      </div>
                      <div class="float-right">
                        <feather type="log-in" class="icons-xs"></feather>
                      </div>
                    </div>
                  </div>
                </a>
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
      <AddFileToLibrary
        :action="addFile"
        :deliverables="formattedDeliverables"
        :admin-files="formattedAdminFiles"
        :finance-files="formattedFinanceFiles"
        :value="show"
        :loading="uploading"
        @input="show = $event"
      />
    </div>
  </Layout>
</template>
<style scoped></style>
