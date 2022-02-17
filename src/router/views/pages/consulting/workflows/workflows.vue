<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateWorkFlowModal from '@components/CreateWorkFlowModal.vue'

export default {
  page: {
    title: 'Work Flows',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateWorkFlowModal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Work Flows',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Work Flows',
          to: '',
          active: true,
        },
      ],
      workFlows: [],
      loading: false,
    }
  },
  created() {
    this.fetchWorkFlows()
  },
  methods: {
    async fetchWorkFlows() {
      this.loading = true
      try {
        const response = await this.$http.get(`/fetch/workflows`)

        if (response && response.data) {
          this.workFlows = response.data.workflow || []
          this.loading = false
        }
      } catch (error) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }
    },

    async createWorkFlow(form) {
      try {
        const respoonse = await this.$http.post('/add/workflow', form)

        if (respoonse) {
          this.workFlows.push(respoonse.data.workflow)
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = message = data.errors[Object.keys(data.errors)[0]]
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
      }
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
            <div class=" d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">Work Flows</h4>
                <p class="sub-header">
                  view, add and edit details of all work flows
                </p>
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="show = true"
                >
                  <i class="uil-plus mr-1"></i> Add Work Flow
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(work, index) in workFlows"
                    :key="work.id"
                    :title="work.description"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ work.name }}</td>
                    <td>{{ work.description }}</td>
                    <td class=" d-flex">
                      <div class=" mr-4">
                        <feather
                          type="edit"
                          class="icon-dual-primary cursor-pointer"
                          @click="openModal(work.id)"
                        />
                      </div>
                      <div>
                        <feather
                          type="x-circle"
                          class="icon-dual-danger"
                          @click="deleteDepartment(work.id)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateWorkFlowModal :action="createWorkFlow"/>
  </Layout>
</template>
