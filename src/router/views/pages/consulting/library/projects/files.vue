<!-- eslint-disable vue/no-v-html -->
<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import AddFileToLibrary from '@/src/components/AddFileToLibrary.vue'
import graph from '@/src/msalConfig/graph'
import { v4 as uuidv4 } from 'uuid'
import File from '@/src/components/file.vue'
import { slashDateFormate } from '@/src/utils/format-date.js'
import formateAmount from '@src/utils/formate-money.js'

export default {
  page: {
    title: 'Project Library',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    AddFileToLibrary,
    File,
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
    regions() {
      return this.project.regions.map((region) => region.region).join(', ')
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
    deleteFile(file) {
      this.$swal({
        title: 'Are you sure you want to delete file?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(`/delete/${file.id}/deliverable`);

            if(response) {
              
            }
          } catch (error) {
            
          }
        }
      })
    },
    slashDateFormate,
    formateAmount,
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
            const { project } = response.data
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

            <div class="text-muted">
              <div
                class="badge badge-soft-primary font-size-13 font-weight-normal"
              >
                {{ project.project_sector && project.project_sector.name }}
              </div>

              <div
                class="badge badge-soft-success font-size-13 font-weight-normal ml-1"
                >{{ project.project_type && project.project_type.name }}</div
              >

              <div
                class="badge badge-soft-danger font-size-13 font-weight-normal ml-1"
                ><i class="uil-user text-danger"></i> Client :
                {{ project.client }}</div
              >
            </div>
            <div class="mt-4 d-flex justify-content-between">
              <h6 class="header-title">Project Summary</h6>
              <h6 v-if="isAdmin || isFinance" class="header-title"
                >Contract Amount: GHS
                {{ formateAmount(project.contract_amount) }}</h6
              >
            </div>

            <p class=" mt-1">{{ project.description }}</p>

            <h6 class="mt-3 header-title">Service Description</h6>

            <p class=" mt-1" v-html="project.service_description" />

            <div class="d-flex justify-content-between">
              <div class="">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-globe text-danger"></i> Country
                  </p>
                  <h5 class="font-size-16">{{ project.country || 'N/A' }}</h5>
                </div>
              </div>
              <div class="">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-user text-danger"></i> Regions
                  </p>
                  <h5 class="font-size-16">{{ regions }}</h5>
                </div>
              </div>
              <div class="">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-globe text-danger"></i> District
                  </p>
                  <h5 class="font-size-16">{{ project.district || 'N/A' }}</h5>
                </div>
              </div>
              <div class="">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-calender text-danger"></i> Start Date
                  </p>
                  <h5 class="font-size-16">{{
                    slashDateFormate(project.start_date)
                  }}</h5>
                </div>
              </div>
              <div class="">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-calendar-slash text-danger"></i> End Date
                  </p>
                  <h5 class="font-size-16">{{
                    slashDateFormate(project.end_date)
                  }}</h5>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-md-12">
                <table class="table mb-0">
                  <thead class="thead-light table-bordered">
                    <tr>
                      <th scope="col">CLIENT DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Name - {{ project.client_name }}</td>
                    </tr>
                    <tr>
                      <td>Address - {{ project.client_address }}</td>
                    </tr>
                    <tr>
                      <td>Contact - {{ project.client_contact }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="row mt-4">
              <div
                v-if="project.professional_expects.length > 0"
                class="col-md-6"
              >
                <table class="table mb-0">
                  <thead class="thead-light table-bordered">
                    <tr>
                      <th scope="col" colspan="3">PROFESSIONAL EXPERTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="user in project.professional_expects"
                      :key="user.id"
                    >
                      <td>{{ user.name }}</td>
                      <td>{{ user.role }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                v-if="project.associated_consultants.length > 0"
                class="col-md-6"
              >
                <table class="table mb-0">
                  <thead class="thead-light table-bordered">
                    <tr>
                      <th scope="col" colspan="3">ASSOCIATED CONSULTANTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="user in project.associated_consultants"
                      :key="user.id"
                    >
                      <td>{{ user.name }}</td>
                      <td>{{ user.role }}</td>
                    </tr>
                  </tbody>
                </table>
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
                <div class="col d-flex flex-wrap">
                  <File
                    v-for="n in combindedFiles"
                    :id="n.id"
                    :key="n.id"
                    :name="n.name"
                    type="docx"
                    :path="n.document_path"
                    @delete="deleteFile"
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
