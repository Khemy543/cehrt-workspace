<script>
import draggable from 'vuedraggable'
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateTaskModal from '@components/CreateTaskModal.vue'

import Task from './board-task'

export default {
  page: {
    title: 'Project Tasks Board',
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
      title: 'Project Tasks Board',
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
          href: '/',
        },
        {
          text: 'Deliverable',
          active: true,
        },
      ],
      tasks: [],
      loading: false,
      workflows: [],
      selectedWorkflow: { id: null, name: 'No work flow Selected' },
      show: false,
      deliverable: {},
      staff: [],
      todoTasks: [],
      inProgressTasks: [],
      doneTasks: [],
      reviewTasks: [],
      selectedTask: null,
      formTitle: 'Create Task',
    }
  },
  computed: {
    dragOptions() {
      return {
        group: 'tasks',
      }
    },
    showCreateDeliverable() {
      return !this.deliverable.deadline
    },
  },
  created() {
    this.getworkFlows()
    this.getTasks()
    this.getDeliverableDetails()
  },
  methods: {
    isReviewer(id) {
      return this.$store.state.auth.currentUser.id === id;
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
    async getDeliverableDetails() {
      try {
        const response = await this.$http(
          `/fetch/${this.$route.params.deliverable_id}/deliverable`
        )

        if (response) {
          this.deliverable = response.data
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
        const {
          project_id: projectId,
          deliverable_id: deliverableId,
        } = this.$route.params

        const newForm = {
          ...form,
          project_id: projectId,
        }

        const response = await this.$http.post(
          `/project/${deliverableId}/create-task`,
          newForm
        )

        if (response) {
          // this.tasks.unshift(response.data.task);
          this.tasks = [response.data.task, ...this.tasks];
          this.todoTasks =
            this.tasks.filter((item) => item.status === 'pending' || item.status === null) || []
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
        const response = await this.$http.put(`/update/${form.id}/task`, form)

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
          `/fetch/${this.$route.params.deliverable_id}/deliverable-tasks`
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

    createTaskWithDeliverable(workflow) {
      this.$swal({
        title: `Create tasks from ${workflow.name}?`,
        text: 'This action will delete all current tasks on this deliv',
        showDenyButton: true,
        confirmButtonText: 'Create',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#5369f8',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.post(
              `/create/deliverable/${this.$route.params.deliverable_id}/tasks/${workflow.id}/from-workflow`
            )

            if (response) {
              this.tasks = response.data.tasks.map(item => ({
                id: item.id,
                status: item.status,
                priority: item.priority,
                reviewer: {id:null, name: null},
                name: item.name,
                is_due: false,
                hasSubTask: false,
                formatted_end_date: null,
                formatted_start_date: null,
                end_date: null,
                description: null,
                assignee: {id: null, name: null},
                assigner: { id: null, name: null }
              }));
              this.todoTasks =
                this.tasks.filter((item) => item.status === 'pending' || item.status === null) || []
              this.inProgressTasks =
                this.tasks.filter((item) => item.status === 'active') || []
              this.doneTasks =
                this.tasks.filter((item) => item.status === 'completed') || []
              this.reviewTasks =
                this.tasks.filter((item) => item.status === 'in-review') || []
              this.selectedWorkflow = workflow
              this.$bvToast.toast('Tasks created successful', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              });

              window.location.reload()
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
        }
      })
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
      const { $event, status } = event;

      if ($event.added) {
        const task = $event.added.element
        try {
          const response = await this.$http.patch(
            `/update/${task.id}/task-status`,
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
              <!-- <div v-if="deliverable.workflow" class="col">
                <span class="font-size-10">
                  Selected Workflow:
                  <b class="font-size-16">{{
                    deliverable.workflow.name
                  }}</b></span
                >
              </div>-->
              <div class="col">
                <label class="font-weight-bold d-inline mr-2">
                  <feather type="activity" class="icon-dual icon-xs mr-2 align-middle"></feather>Work Flows:
                </label>
                <b-dropdown
                  class="d-inline"
                  variant="link"
                  toggle-class="font-weight-bold p-0 align-middle"
                >
                  <template v-slot:button-content>
                    {{ (deliverable.workflow && deliverable.workflow.name) || selectedWorkflow.name }}
                    <i
                      class="uil uil-angle-down font-size-16 align-middle"
                    ></i>
                  </template>
                  <b-dropdown-item
                    v-for="workflow in workflows"
                    :key="workflow.id"
                    href="javascript: void(0);"
                    variant="seconday"
                    @click="createTaskWithDeliverable(workflow)"
                  >{{ workflow.name }}</b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="col text-right">
                <button id="btn-new-event" class="btn btn-primary" @click="showCreateModal">
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
              Pending
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
                    <Task :task="task" @showEditModal="showEditModal" @deleteTask="deleteTask" />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - todo tasks -->

          <!-- in progress tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              On going
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
                    <Task :task="task" @showEditModal="showEditModal" @deleteTask="deleteTask" />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - in progress -->

          <!-- review tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              In Review
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
                    <Task :task="task" @showEditModal="showEditModal" @deleteTask="deleteTask" />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - review -->

          <!-- done tasks -->
          <div class="tasks border">
            <h5 class="mt-0 task-header header-title">
              Completed
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
                    <Task :task="task" @showEditModal="showEditModal" @deleteTask="deleteTask" />
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
          <!-- end - done -->
        </div>
      </div>
    </div>

    <div v-else-if="!loading && tasks.length <= 0" class="w-100 d-flex justify-content-center">
      <img :src="require('@assets/svgs/empty.svg')" alt="no tasks" style="width:35%" />
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
