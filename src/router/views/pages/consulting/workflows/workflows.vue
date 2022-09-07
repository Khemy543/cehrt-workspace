<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateWorkFlowModal from '@components/CreateWorkFlowModal.vue'
import ViewWorkFlowModal from '@components/ViewWorkFlowModal.vue'

export default {
  page: {
    title: 'Work Flows',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateWorkFlowModal,
    ViewWorkFlowModal
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
      workflow: null,
      loading: false,
      show: false,
      formTitle: 'Create Work Flow',
      viewShow: false
    }
  },
  created() {
    this.fetchWorkFlows()
  },
  methods: {
    openCreateWorkFlow() {
      this.workflow = null;
      this.formTitle = "Create Work Flow"
      this.show = true
    },
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
        })
      }
    },

    async createWorkFlow(form) {
      try {
        const respoonse = await this.$http.post('/add/workflow', form)

        if (respoonse) {
          this.workFlows.push(respoonse.data.workflow)
          this.show = false
          this.$bvToast.toast('Work flow created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
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

    editWorkFlow(workflow) {
      this.workflow = workflow
      this.formTitle = 'Edit Work Flow'
      this.show = true
    },

    action(workflow) {
      if (this.workflow) {
        return this.updateWorkflow(workflow)
      }
      return this.createWorkFlow(workflow)
    },

    async updateWorkflow(workflow) {
      try {
        const response = await this.$http.put(`/update/${this.workflow.id}/workflow`, workflow)

        if (response) {
          const index = this.workFlows.findIndex(
            (item) => item.id === this.workflow.id
          )
          this.$set(this.workFlows, index,  response.data.workflow)
          this.workflow = null
          this.formTitle = 'Create Work Flow'
          this.show = false

          this.$bvToast.toast('Work flow updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
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

    viewWorkFlow(workflow) {
      this.workflow = workflow;
      this.viewShow = true
    },

    deleteWorkFlow(workflow) {
      this.$swal({
        title: 'Do you want to delete this work flow?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${workflow.id}/workflow`
            )

            if (response) {
              this.workFlows = this.workFlows.filter(
                (item) => item.id !== workflow.id
              )
              this.$bvToast.toast('Work flow deleted successfully', {
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
              toastClass: 'text-white',
            })
          }
        }
      })
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
                  @click="openCreateWorkFlow"
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
                    <th scope="col">Number of Tasks</th>
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
                    <td>{{
                      work.work_flow_tasks && work.work_flow_tasks.length
                    }}</td>
                    <td class=" d-flex">
                      <b-dropdown
                        variant="link"
                        class=" position-absolute"
                        toggle-class="p-0 text-muted arrow-none"
                      >
                        <template v-slot:button-content>
                          <i class="uil uil-ellipsis-v font-size-14"></i>
                        </template>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="viewWorkFlow(work)"
                          ><i class="uil uil-exit mr-2"></i
                          >View</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="editWorkFlow(work)"
                        >
                          <i class="uil uil-edit mr-2"></i>Edit
                        </b-dropdown-item>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deleteWorkFlow(work)"
                        >
                          <i class="uil uil-trash-alt mr-2"></i>Delete
                        </b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && workFlows.length <= 0"
      class=" w-100 d-flex justify-content-center"
    >
      <img
        :src="require('@assets/svgs/empty.svg')"
        alt="no projects"
        style="width:50%"
      />
    </div>
    <CreateWorkFlowModal
      :action="action"
      :value="show"
      :workflow="workflow"
      :form-title="formTitle"
      @input="show = $event"
    />

    <ViewWorkFlowModal 
      :value="viewShow"
      :work-flow="workflow"
      @input="viewShow = $event"
    />
  </Layout>
</template>
