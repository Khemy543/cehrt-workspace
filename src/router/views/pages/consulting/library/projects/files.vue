<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import AddFileToLibrary from '@/src/components/AddFileToLibrary.vue'
import graph from '@/src/msalConfig/graph'

export default {
  page: {
    title: 'Proposal Library',
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
      project: {},
      library: [],
      invoice: [],
      timeSheet: [],
      show: false,
    }
  },
  computed: {
    deliverables() {
      return (
        (this.project.project_type && this.project.project_type.deliverables) ||
        []
      )
    },
    formattedDeliverables() {
      return this.deliverables.filter((item) =>
        !this.library.some(
          (library) => library.project_type_deliverable.id === item.id
        )
      )
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
      console.log(form)
      try {
        const deliverable = this.formattedDeliverables.find(
          (item) => item.id === form.project_type_deliverable_id
        )

        const data = await graph.uploadProjectLibraryFile({
          fileName: `${deliverable.deliverable_name}.docx`,
          fileContent: form.file,
          folder: this.project.name,
        })

        const response = await this.$http.post(
          `/project/${this.$route.params.id}/create-deliverable`,
          { ...form, document_path: data.webUrl }
        )

        if (response) {
          this.library.push(response.data.deliverable)
          this.$bvToast.toast('Project deliverable created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })

          this.show = false

          /* await this.updateDeliverableWithPathName({
            ...response.data.deliverable,
            document_path: data.webUrl,
          }) */
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
        this.showCreateDeliverable = false
        this.vDeliverable = null
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
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
              file: response.data.contract,
            }
            const insurance = {
              id: 2,
              name: 'insurance',
              file: response.data.insurance,
            }
            const permit = {
              id: 3,
              name: 'Permit',
              file: response.data.permit,
            }
            const reviewComment = {
              id: 4,
              name: 'Review Comments',
              file: response.data.review_comment,
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

            response.data.correspondents.forEach((file) => {
              this.library.push({
                id: this.library[this.library.length - 1].id + 1,
                name: 'Correspondent',
                file: file.corespondent_path,
              })
            })
          }

          if (department.name === 'Finance') {
            const contract = {
              id: 1,
              name: 'Contract',
              file: response.data.contract,
            }

            const insurance = {
              id: 2,
              name: 'insurance',
              file: response.data.insurance,
            }

            if (response.data.contract) {
              this.library.push(contract)
            }

            if (response.data.insurance) {
              this.library.push(insurance)
            }
            response.data.deliverables.forEach((item) => {
              this.invoice.push({
                invoice: item.invoice,
                invoice_status: item.invoice_status || 'unpaid',
                invoice_days: item.invoice_days,
                name: item.name,
                id: item.id,
              })

              this.timeSheet.push({
                timesheet: item.timesheet,
                name: item.name,
                id: item.id,
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
                  v-if="department.name === 'Consultancy'"
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="openModal"
                >
                  <i class="uil-plus mr-1"></i> Add File
                </button>
              </div>
            </div>

            <h6 class="mt-0 header-title">About Project</h6>

            <div class="text-muted mt-3">
              <p>{{ project.description }}</p>
              <div
                class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
              >
                {{ project.project_sector && project.project_sector.name }}
              </div>

              <div
                class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                >{{ project.project_type && project.project_type.name }}</div
              >

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
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="library.length > 0" class="mt-5">
              <div class="row mt-4">
                <a
                  v-for="n in library"
                  :key="n.id"
                  :href="n.document_path"
                  target="_blank"
                  class="col-md-3"
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
                        <div class="d-inline-block mt-2">{{ n.name }}</div>
                      </div>
                      <div class="float-right mt-1">
                        <div class="p-2">
                          <feather type="log-in" class="icons-xs"></feather>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div v-if="invoice.length > 0" class=" mt-4">
                <h6 class="mt-0">Deliverable Invoice</h6>

                <div class="row mt-2">
                  <router-link
                    v-for="n in invoice"
                    :key="n.id"
                    to=""
                    class="col-md-3"
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
                          <div class="d-inline-block mt-2">{{ n.name }}</div>
                        </div>
                        <div class="float-right mt-1">
                          <div class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
              <div v-if="timeSheet.length > 0" class=" mt-4">
                <h6 class="mt-0">Deliverable Time Sheets</h6>
                <div class="row mt-4">
                  <router-link
                    v-for="n in timeSheet"
                    :key="n.id"
                    to=""
                    class="col-md-3"
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
                          <div class="d-inline-block mt-2">{{ n.name }}</div>
                        </div>
                        <div class="float-right mt-1">
                          <div class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </router-link>
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
      <AddFileToLibrary
        :action="addFile"
        :deliverables="formattedDeliverables"
        :value="show"
        @input="show = $event"
      />
    </div>
  </Layout>
</template>
<style scoped></style>
