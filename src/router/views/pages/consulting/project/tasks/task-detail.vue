<script>
import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.bubble.css'
import CreateTaskModal from '@components/CreateTaskModal.vue'

export default {
  components: { VueEditor, CreateTaskModal },
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    subtasks: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      editorOptions: {
        theme: 'bubble',
      },
      form: {},
      show: false,
      selectedTask: null,
      formTitle: 'Create SubTask',
      taskStatuses: [
        {
          id: 1,
          name: 'Pending',
          api: 'pending',
        },
        {
          id: 2,
          name: 'On going',
          api: 'active',
        },
        {
          id: 3,
          name: 'Completed',
          api: 'completed',
        },
        {
          id: 4,
          name: 'In Review',
          api: 'in-review',
        },
      ],
    }
  },
  computed: {
    initals() {
      return this.task.assignee.name
        ? this.task.assignee.name
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase()
        : 'GA'
    },
    isSubTask() {
      return this.$route.query.subtask === 'true'
    },
    selectedStatus() {
      return this.taskStatuses.find((item) => item.api === this.task.status)
    },
    hasSubTask() {
      return this.$route.query.hasSubTask === 'true'
    },
    taskPriority() {
      return this.task.priority.toLowerCase();
    }
  },
  mounted() {
    this.form = {
      ...this.task,
    }
  },
  methods: {
    async createSubTask(form) {
      try {
        const response = await this.$http.post(
          `/task/${this.$route.params.id}/create/subtask`,
          form
        )
        if (response) {
          this.$bvToast.toast('Task created successful', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          if (this.hasSubTask) {
            this.$emit('addSubtask', response.data.subTask)
            this.show = false
            return
          }

          return this.$router.push(
            `/project/task/${this.$route.params.id}/details?subtask=false&hasSubTask=true`
          )
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
    async editTask(form) {
      try {
        const url = this.isSubTask
          ? `/update/${form.id}/sub-task`
          : `/update/${form.id}/task`
        const response = await this.$http.put(url, form)

        if (response) {
          this.$emit(
            'updateTask',
            response.data.task ? response.data.task : response.data.subTask
          )
          this.$bvToast.toast('Task updated successful', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.show = false
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

    action(form) {
      if (this.selectedTask) {
        return this.editTask(form)
      }

      return this.createSubTask(form)
    },

    showEditTask() {
      this.formTitle = 'Edit Task'
      this.selectedTask = this.task
      this.show = true
    },
    openCreateSubTask() {
      this.formTitle = 'Create Sub Task'
      this.selectedTask = null
      this.show = true
    },

    async changeWorkFlow(status) {
      try {
        const response = await this.$http.patch(
          `/update/${this.$route.params.id}/task-status`,
          {
            status: status.api,
          }
        )

        if (response) {
          this.$emit('updateTask', {
            ...this.task,
            status: status.api,
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
    },

    deleteTask() {
      this.$swal({
        title: 'Do you want to delete task?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const url = this.isSubTask
              ? `/delete/${this.$route.params.id}/sub-task`
              : `/delete/${this.$route.params.id}/task`
            const response = await this.$http.delete(url)

            if (response) {
              this.$bvToast.toast('Task deleted successful', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })

              this.$router.push('/')
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

    deleteSubTask(task) {
      this.$swal({
        title: 'Do you want to delete subtask?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${task.id}/sub-task`
            )

            if (response) {
              this.$emit('deleteSubTask', task)
              this.$bvToast.toast('Subtask deleted successful', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
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

    async changeTaskDescription() {
      try {
        const url = this.isSubTask
          ? `/update/${this.$route.params.id}/sub-task`
          : `/update/${this.$route.params.id}/task`
        const response = await this.$http.put(url, {
          ...this.form,
        })

        if (response) {
        }
      } catch (error) {}
    },
  },
}
</script>
<template>
  <div class="card">
    <div class="card-body">
      <div class="row pb-3 border-bottom">
        <div class="col">
          <b-dropdown
            class="float-right"
            variant="link"
            toggle-class="p-0"
            right
          >
            <template v-slot:button-content>
              <i class="uil uil-ellipsis-h text-muted"></i>
            </template>
            <!-- item-->
            <b-dropdown-item @click="showEditTask">
              <i class="uil uil-edit mr-1"></i>Edit
            </b-dropdown-item>
            <b-dropdown-item v-if="!isSubTask" @click="openCreateSubTask">
              <i class="uil uil-plus mr-1"></i>Add SubTask
            </b-dropdown-item>
            <!-- item -->
            <b-dropdown-divider></b-dropdown-divider>
            <!-- item-->
            <b-dropdown-item variant="danger" @click="deleteTask">
              <i class="uil uil-trash-alt mr-1"></i>Delete
            </b-dropdown-item>
            <!-- end dropdown menu-->
          </b-dropdown>
          <!-- end dropdown-->

          <div>
            <b-dropdown
              class="d-inline"
              variant="link"
              toggle-class="font-weight-bold p-0 align-middle"
            >
              <template v-slot:button-content>
                {{ selectedStatus.name }}
                <i class="uil uil-angle-down font-size-16 align-middle"></i>
              </template>
              <b-dropdown-item
                v-for="status in taskStatuses"
                :key="status.id"
                href="javascript: void(0);"
                variant="seconday"
                @click="changeWorkFlow(status)"
              >
                {{ status.name }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <!-- end custom-checkbox-->
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h4 class="mt-3">{{ task.name }}</h4>
          <div class="row">
            <div class="col-5">
              <!-- assignee -->
              <p class="mt-2 mb-1 text-muted">Assigned To</p>
              <div v-if="task.assignee.name" class="media">
                <div
                  v-if="task.assignee.id"
                  class="avatar-sm rounded-circle mr-2 bg-primary mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                >
                  {{ initals }}
                </div>
                <div class="media-body">
                  <h5 class="mt-1 font-size-14">{{ task.assignee.name }}</h5>
                </div>
              </div>
              <h5 v-else>
                Not Assigned
              </h5>
              <!-- end assignee -->
            </div>
            <!-- end col -->

            <div class="col-5">
              <!-- start due date -->
              <p class="mt-2 mb-1 text-muted">Due Date</p>
              <div class="media">
                <i class="uil uil-schedule font-18 text-success mr-1"></i>
                <div class="media-body">
                  <h5 class="mt-1 font-size-14">{{
                    task.formatted_end_date
                  }}</h5>
                </div>
              </div>
              <!-- end due date -->
            </div>

            <div class="col-2">
              <!-- start due date -->
              <p class="mt-2 mb-1 text-muted">Priority</p>
              <div class="media">
                <span
                  class="badge"
                  :class="
                    taskPriority === 'high'
                      ? 'badge-soft-danger'
                      : taskPriority === 'medium'
                      ? 'badge-soft-warning'
                      : 'badge-soft-success'
                  "
                >
                  {{ task.priority }}
                </span>
              </div>
              <!-- end due date -->
            </div>
            <!-- end col -->
          </div>
          <!-- end row -->

          <!-- task description -->
          <div class="row mt-3">
            <div class="col">
              <div id="taskDesk">
                <vue-editor
                  v-model="form.description"
                  :editor-options="editorOptions"
                  @blur="changeTaskDescription"
                ></vue-editor>
              </div>
            </div>
            <!-- end col -->
          </div>
          <!-- end task description -->

          <!-- end sub tasks/checklists -->

          <!-- start attachments -->
          <h5 class="mt-4 mb-2 font-size-16">Attachments</h5>

          <div class="card mb-2 shadow-none border">
            <div class="p-1 px-2">
              <a target="_blank" :href="task.deliverable.document_path" class="row align-items-center">
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
                  <a
                    href="javascript:void(0);"
                    class="text-muted font-weight-bold"
                    >{{ task.deliverable.name }}</a
                  >
                  <p class="mb-0">2kb</p>
                </div>
                <div class="col-auto">
                  <!-- Button -->
                  <a
                    v-b-tooltip.hover
                    title="open"
                    href="javascript:void(0);"
                    class="btn btn-link text-muted btn-lg p-0"
                  >
                    <feather type="log-in" class="icons-xs"></feather>
                  </a>
                </div>
              </a>
            </div>
          </div>
          <!-- end attachments -->

          <div v-if="task.hasSubTask">
            <h5 class="mt-4 mb-2 font-size-16">SubTasks</h5>

            <div class="row">
              <div class="col-12">
                <ul class="list-unstyled activity-widget">
                  <li
                    v-for="subtask in subtasks"
                    :key="subtask.id"
                    class="activity-list"
                  >
                    <div class="media d-flex justify-content-between">
                      <router-link
                        :to="`/project/task/${subtask.id}/details?subtask=true`"
                        class="media-body overflow-hidden"
                      >
                        <h5 class="font-size-15 mt-2 mb-1">
                          <div class="text-dark">{{ subtask.name }}</div>
                        </h5>
                        <div class=" d-flex">
                          <div>
                            <a
                              :id="`task-tooltip-${subtask.id}`"
                              href="javascript: void(0)"
                              class="text-muted d-inline-block bg-transparent"
                            >
                              <b-tooltip
                                :target="`task-tooltip-${subtask.id}`"
                                triggers="hover"
                                placement="top"
                                >Due date</b-tooltip
                              >
                              <i class="uil uil-calendar-alt mr-1"></i>
                              {{ subtask.formatted_end_date }}
                            </a>
                          </div>
                          <div class=" ml-3">
                            <a
                              :id="`task-tooltip-status-${subtask.id}`"
                              href="javascript: void(0)"
                              class="text-muted d-inline-block bg-transparent"
                            >
                              <b-tooltip
                                :target="`task-tooltip-status-${subtask.id}`"
                                triggers="hover"
                                placement="top"
                                >Status</b-tooltip
                              >
                              <i class="uil uil-windsock mr-1"></i>
                             <span style="text-transform:capitalize">{{ subtask.status }}</span> 
                            </a>
                          </div>
                          <div class=" ml-3">
                            <a
                              :id="`task-tooltip-priority-${subtask.id}`"
                              href="javascript: void(0)"
                              class="text-muted d-inline-block bg-transparent"
                            >
                              <b-tooltip
                                :target="`task-tooltip-priority-${subtask.id}`"
                                triggers="hover"
                                placement="top"
                                >Priority</b-tooltip
                              >
                              <span
                                class="badge"
                                :class="
                                  subtask.priority === 'high'
                                    ? 'badge-soft-danger'
                                    : subtask.priority === 'medium'
                                    ? 'badge-soft-warning'
                                    : 'badge-soft-success'
                                "
                              >
                                {{ subtask.priority }}
                              </span>
                            </a>
                          </div>
                        </div>
                      </router-link>
                      <div>
                        <b-dropdown
                          class="float-right"
                          variant="link"
                          toggle-class="p-0"
                          right
                        >
                          <template v-slot:button-content>
                            <i class="uil uil-ellipsis-v text-muted"></i>
                          </template>
                          <!-- item-->
                          <b-dropdown-item
                            :to="
                              `/task/${subtask.id}/details?subtask=true&hasSubTask=false`
                            "
                          >
                            View
                          </b-dropdown-item>
                          <!-- item -->
                          <b-dropdown-divider></b-dropdown-divider>
                          <!-- item-->
                          <b-dropdown-item
                            variant="danger"
                            @click="deleteSubTask(subtask)"
                          >
                            <i class="uil uil-trash-alt mr-1"></i>Delete
                          </b-dropdown-item>
                          <!-- end dropdown menu-->
                        </b-dropdown>
                        <!-- end dropdown-->
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- end col -->
      </div>
      <!-- end row-->
    </div>
    <!-- end card-body -->
    <CreateTaskModal
      :task="selectedTask"
      :action="action"
      :form-title="formTitle"
      :value="show"
      @input="show = $event"
    />
  </div>
  <!-- end card-->
</template>

<style>
.ql-bubble .ql-tooltip {
  border-radius: 4px !important;
}
</style>
