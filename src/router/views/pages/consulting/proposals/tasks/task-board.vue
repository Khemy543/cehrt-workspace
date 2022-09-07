<script>
import draggable from 'vuedraggable'
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateTaskModal from '@components/CreateTaskModal.vue'

import Task from './board-task'

export default {
  page: {
    title: 'Proposal Tasks Board',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    draggable,
    Layout,
    PageHeader,
    Task,
    CreateTaskModal,
  },
  data() {
    return {
      title: 'Proposal Tasks Board',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Proposals',
          to: '/',
        },
        {
          text: 'Proposal Name',
          href: '/',
          active: true,
        },
      ],
      tasks: [],
      loading: false,
      workflows: [],
      selectedWorkflow: { id: null, name: 'No work flow Selected' },
      show: false,
      proposal: {},
      staff: [],
      todoTasks: [],
      inProgressTasks: [],
      doneTasks: [],
      reviewTasks: [],
      selectedTask: null,
      formTitle: 'Create Task',
      reportDetails: {},
    }
  },
  computed: {
    dragOptions() {
      return {
        group: 'tasks',
      }
    },
  },
  created() {
    this.getProposal()
    this.getTasks()
    this.getReportDetails()
  },
  methods: {
    openFile() {
     window.open(this.reportDetails.report_path,'_blank');
    },
    async getReportDetails() {
      try {
        const response = await this.$http.get(
          `/fetch/proposal/report/${this.$route.params.report_id}/details`
        )

        if (response) {
          this.reportDetails = response.data
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
          `/fetch/${this.$route.params.proposal_id}/proposal`
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
    async getworkFlows() {
      try {
        const response = await this.$http.get('/fetch/workflows')

        if (response) {
          this.workflows = response.data.workflow
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
    async createTask(form) {
      try {
        const { report_id: reportId } = this.$route.params

        const newForm = {
          ...form,
        }

        const response = await this.$http.post(
          `/create/${reportId}/proposal-report-task`,
          newForm
        )

        if (response) {
          // this.tasks.unshift(response.data.task);
          this.tasks = [response.data.task, ...this.tasks]
          this.todoTasks =
            this.tasks.filter(
              (item) => item.status === 'pending' || item.status === null
            ) || []
          this.inProgressTasks =
            this.tasks.filter((item) => item.status === 'active') || []
          this.doneTasks =
            this.tasks.filter((item) => item.status === 'completed') || []
          this.reviewTasks =
            this.tasks.filter((item) => item.status === 'in-review') || []
          this.show = false
          this.$bvToast.toast('Task created successful', {
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

    async editTask(form) {
      try {
        const response = await this.$http.put(
          `/update/${form.id}/proposal-report-task`,
          form
        )

        if (response) {
          const index = this.tasks.findIndex((item) => item.id === form.id)
          this.tasks[index] = response.data.task

          this.todoTasks =
            this.tasks.filter((item) => item.status === 'pending') || []
          this.inProgressTasks =
            this.tasks.filter((item) => item.status === 'active') || []
          this.doneTasks =
            this.tasks.filter((item) => item.status === 'completed') || []
          this.reviewTasks =
            this.tasks.filter((item) => item.status === 'in-review') || []

          this.show = false

          this.$bvToast.toast('Task updated successful', {
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

    action(form) {
      if (this.selectedTask) {
        return this.editTask(form)
      }

      return this.createTask(form)
    },

    async getTasks() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/${this.$route.params.report_id}/proposal-report-tasks`
        )

        if (response) {
          this.tasks = response.data
          this.todoTasks =
            response.data.filter((item) => item.status === 'pending') || []
          this.inProgressTasks =
            response.data.filter((item) => item.status === 'active') || []
          this.doneTasks =
            response.data.filter((item) => item.status === 'completed') || []
          this.reviewTasks =
            response.data.filter((item) => item.status === 'in-review') || []

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

    showEditModal(task) {
      this.formTitle = 'Edit Task'
      this.selectedTask = task
      this.show = true
    },

    showCreateModal() {
      this.formTitle = 'Create Task'
      this.selectedTask = null
      this.show = true
    },

    deleteTask(task) {
      this.tasks = this.tasks.filter((item) => item.id !== task.id)

      this.todoTasks =
        this.tasks.filter((item) => item.status === 'pending') || []
      this.inProgressTasks =
        this.tasks.filter((item) => item.status === 'active') || []
      this.doneTasks =
        this.tasks.filter((item) => item.status === 'completed') || []
      this.reviewTasks =
        this.tasks.filter((item) => item.status === 'in-review') || []
    },

    async moveTask(event) {
      const { $event, status } = event

      if ($event.added) {
        const task = $event.added.element
        try {
          const response = await this.$http.patch(
            `/update/${task.id}/proposal-report-task-status`,
            {
              status,
            }
          )
          if (response) {
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
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="mb-2 shadow-none border">
                <div class="p-1 px-2" style="cursor: pointer;" @click="openFile">
                  <div
                    class="row align-items-center"
                  >
                    <div class="col-auto">
                      <div class="avatar-sm font-weight-bold mr-3">
                        <span
                          class="avatar-title rounded bg-soft-primary text-primary"
                        >
                          <i class="uil-file-plus-alt font-size-18"></i>
                        </span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <div
                        class="text-muted font-weight-bold"
                        >{{
                          reportDetails.proposal_type &&
                            reportDetails.proposal_type.report_title
                        }}</div
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="col text-right">
                <button
                  id="btn-new-event"
                  class="btn btn-primary"
                  @click="showCreateModal"
                >
                  <i class="uil-plus mr-1"></i>Add New Task
                </button>
              </div>
            </div>
          </div>
          <!-- end card body-->
        </div>
        <!-- end card -->
      </div>
      <!-- end col-12 -->
    </div>
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else-if="!loading && tasks.length > 0" class="row">
      <div class="col-12">
        <div class="board">
          <!-- todo tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              Todo
              <span class="font-size-13">({{ todoTasks.length }})</span>
            </h5>

            <div id="task-list-one" class="task-list-items">
              <draggable
                v-model="todoTasks"
                v-bind="dragOptions"
                :empty-insert-threshold="500"
                @change="moveTask({ $event, status: 'pending' })"
              >
                <transition-group type="transition" :name="'flip-list'">
                  <div v-for="task in todoTasks" :key="task.id">
                    <Task
                      :task="task"
                      @showEditModal="showEditModal"
                      @deleteTask="deleteTask"
                    />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - todo tasks -->

          <!-- in progress tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              In Progress
              <span class="font-size-13">({{ inProgressTasks.length }})</span>
            </h5>

            <div id="task-list-one" class="task-list-items">
              <draggable
                v-model="inProgressTasks"
                v-bind="dragOptions"
                :empty-insert-threshold="500"
                @change="moveTask({ $event, status: 'active' })"
              >
                <transition-group type="transition" :name="'flip-list'">
                  <div v-for="task in inProgressTasks" :key="task.id">
                    <Task
                      :task="task"
                      @showEditModal="showEditModal"
                      @deleteTask="deleteTask"
                    />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - in progress -->

          <!-- review tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              Review
              <span class="font-size-13">({{ reviewTasks.length }})</span>
            </h5>

            <div id="task-list-one" class="task-list-items">
              <draggable
                v-model="reviewTasks"
                v-bind="dragOptions"
                :empty-insert-threshold="500"
                @change="moveTask({ $event, status: 'in-review' })"
              >
                <transition-group type="transition" :name="'flip-list'">
                  <div v-for="task in reviewTasks" :key="task.id">
                    <Task
                      :task="task"
                      @showEditModal="showEditModal"
                      @deleteTask="deleteTask"
                    />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - review -->

          <!-- done tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              Done
              <span class="font-size-13">({{ doneTasks.length }})</span>
            </h5>

            <div id="task-list-one" class="task-list-items">
              <draggable
                v-model="doneTasks"
                v-bind="dragOptions"
                :empty-insert-threshold="500"
                @change="moveTask({ $event, status: 'completed' })"
              >
                <transition-group type="transition" :name="'flip-list'">
                  <div v-for="task in doneTasks" :key="task.id">
                    <Task
                      :task="task"
                      @showEditModal="showEditModal"
                      @deleteTask="deleteTask"
                    />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - done -->
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && tasks.length <= 0"
      class="w-100 d-flex justify-content-center"
    >
      <img
        :src="require('@assets/svgs/empty.svg')"
        alt="no tasks"
        style="width:35%"
      />
    </div>

    <CreateTaskModal
      :task="selectedTask"
      :action="action"
      :form-title="formTitle"
      :value="show"
      @input="show = $event"
    />
  </Layout>
</template>
