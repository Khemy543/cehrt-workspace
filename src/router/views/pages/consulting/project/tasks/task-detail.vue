<script>
import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.bubble.css'
import CreateTaskModal from '@components/CreateTaskModal.vue'
import File from '@/src/components/file.vue'

export default {
  components: { VueEditor, CreateTaskModal, File },
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
          name: 'In Review',
          api: 'in-review',
        },
        {
          id: 4,
          name: 'Completed',
          api: 'completed',
        }
      ],
    }
  },
  computed: {
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
      return this.task.priority.toLowerCase()
    },
  },
  mounted() {
    this.form = {
      ...this.task,
    }
  },
  methods: {
    initals(name) {
      return name
        ? name
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase()
        : 'AA'
    },
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
            message = data.errors[Object.keys(data.errors)[0]]

            message = message || error.response.message
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

    async changeStatus(status) {
      if (
        status.api === 'completed' &&
        this.task.reviewer.id !== this.$store.state.auth.currentUser.id
      ) {
        return this.$bvToast.toast(
          'Only task reviewer call move task to completed',
          {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          }
        )
      }
      try {
        const url = this.isSubTask
          ? `/update/${this.$route.params.id}/subtask-status`
          : `/update/${this.$route.params.id}/task-status`
        const response = await this.$http.patch(url, {
          status: status.api,
        })

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

    findPostiveNumberNotInArray(array) {
      const postiveNumbers = array.filter((item) => item > 0)
      let number = 1
      while (postiveNumbers.includes(number)) {
        number++
      }
      return number
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
                @click="changeStatus(status)"
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
              <div
                v-if="task.assignee.name"
                class="media d-flex align-items-center"
              >
                <div
                  v-if="task.assignee.id"
                  class="avatar-sm rounded-circle mr-2 bg-primary mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                >
                  {{ initals(task.assignee.name) }}
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
                <i class="uil uil-schedule font-18 text-success mr-1" :class="{ 'text-danger': task.is_due }"></i>
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

            <div class="col-5">
              <!-- assignee -->
              <p class="mt-2 mb-1 text-muted">Reviewer</p>
              <div
                v-if="task.reviewer.name"
                class="media d-flex align-items-center"
              >
                <div
                  v-if="task.reviewer.id"
                  class="avatar-sm rounded-circle mr-2 mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                  style="background-color: #6c6c82"
                >
                  {{ initals(task.reviewer.name) }}
                </div>
                <div class="media-body">
                  <h5 class="mt-1 font-size-14">{{ task.reviewer.name }}</h5>
                </div>
              </div>
              <h5 v-else>
                Not Assigned
              </h5>
              <!-- end assignee -->
            </div>
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
          <h5 v-if="!isSubTask" class="mt-4 mb-2 font-size-16">Attachments</h5>

          <div v-if="!isSubTask" class="card mb-2 shadow-none">
              <File 
                :path="task.deliverable.document_path"
                type="word"
                :name="task.deliverable.name"
              />
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
                              <span style="text-transform:capitalize">{{
                                subtask.status
                              }}</span>
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
                        <div class="row mt-1">
                          <div class="col-5">
                            <!-- assignee -->
                            <p class="mt-2 mb-1 text-muted">Assigned To</p>
                            <div
                              v-if="subtask.assignee.name"
                              class="media d-flex align-items-center"
                            >
                              <div
                                v-if="subtask.assignee.id"
                                class="avatar-sm rounded-circle mr-2 bg-primary mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                              >
                                {{ initals(subtask.assignee.name) }}
                              </div>
                              <div class="media-body">
                                <h5 class="mt-1 font-size-14">{{
                                  subtask.assignee.name
                                }}</h5>
                              </div>
                            </div>
                            <h5 v-else>
                              Not Assigned
                            </h5>
                            <!-- end assignee -->
                          </div>
                          <div class="col-5">
                            <!-- assignee -->
                            <p class="mt-2 mb-1 text-muted">Reviewer</p>
                            <div
                              v-if="subtask.reviewer.name"
                              class="media d-flex align-items-center"
                            >
                              <div
                                v-if="subtask.reviewer.id"
                                class="avatar-sm rounded-circle mr-2 mb-2 p-2 text-white d-flex align-items-center justify-content-center"
                                style="background-color: #6c6c82;"
                              >
                                {{ initals(subtask.reviewer.name) }}
                              </div>
                              <div class="media-body">
                                <h5 class="mt-1 font-size-14">{{
                                  subtask.reviewer.name
                                }}</h5>
                              </div>
                            </div>
                            <!-- end assignee -->
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
                              `/project/task/${subtask.id}/details?subtask=true&hasSubTask=false`
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
