<script>
import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.bubble.css'
import { todayTasks } from './data-tasklist'
import CreateTaskModal from '../../../../../components/CreateTaskModal.vue'

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
      todayTasks: [...todayTasks],
      show: false,
      selectedTask: null,
      formTitle: 'Create SubTask',
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
      return this.$route.query.hasSubTask
    },
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
          this.$router.push(`/task/${this.$route.params.id}/sub-tasks`)
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
        const url = !this.isSubTask
          ? `/update/${form.id}/sub-task`
          : `/update/${form.id}/task`
        const response = await this.$http.put(url, form)

        if (response) {

          this.$emit('updateTask', response.data.task ? response.data.task : response.data.subTask)
          this.$bvToast.toast('Task updated successful', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          });
          this.show = false;
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
            <b-dropdown-item v-if="isSubTask" @click="openCreateSubTask">
              <i class="uil uil-plus mr-1"></i>Add SubTask
            </b-dropdown-item>
            <!-- item -->
            <b-dropdown-divider></b-dropdown-divider>
            <!-- item-->
            <b-dropdown-item href="javascript:void(0);" variant="danger">
              <i class="uil uil-trash-alt mr-1"></i>Delete
            </b-dropdown-item>
            <!-- end dropdown menu-->
          </b-dropdown>
          <!-- end dropdown-->

          <div class="custom-control custom-checkbox float-left">
            <input
              id="completedCheck"
              type="checkbox"
              class="custom-control-input"
            />
            <label class="custom-control-label" for="completedCheck"
              >Mark as completed</label
            >
          </div>
          <!-- end custom-checkbox-->
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h4 class="mt-3">{{ task.name }}</h4>
          <div class="row">
            <div class="col-6">
              <!-- assignee -->
              <p class="mt-2 mb-1 text-muted">Assigned To</p>
              <div v-if="task.assignee.name" class="media">
                <div
                  v-if="task.assignee.id"
                  class="avatar-sm rounded-circle mr-2 bg-primary mb-2 p-2 text-white d-flex"
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

            <div class="col-6">
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
            <!-- end col -->
          </div>
          <!-- end row -->

          <!-- task description -->
          <div class="row mt-3">
            <div class="col">
              <div id="taskDesk">
                <vue-editor
                  v-model="task.description"
                  :editor-options="editorOptions"
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
              <div class="row align-items-center">
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
                    >Inception Report</a
                  >
                  <p class="mb-0">2kb</p>
                </div>
                <div class="col-auto">
                  <!-- Button -->
                  <a
                    v-b-tooltip.hover
                    title="Download"
                    href="javascript:void(0);"
                    class="btn btn-link text-muted btn-lg p-0"
                  >
                    <i class="uil uil-cloud-download font-size-14"></i>
                  </a>
                </div>
              </div>
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
                      <div class="media-body overflow-hidden">
                        <h5 class="font-size-15 mt-2 mb-1">
                          <router-link
                            :to="`/task/${subtask.id}/details?subtask=true`"
                            class="text-dark"
                            >{{ subtask.name }}</router-link
                          >
                        </h5>
                        <div class=" d-flex justify-content-between">
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
                        </div>
                      </div>
                      <div class="d-flex">
                        <router-link
                          :to="`/task/${subtask.id}/details?subtask=true&hasSubTask=false`"
                          type="button"
                          class="btn btn-soft-primary btn-sm"
                        >
                          <i class="uil uil-eye"></i>
                        </router-link>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- <div class="row mt-5">
            <div class="col-sm-12">
              <a
                href="javascript: void(0);"
                class="btn btn-primary"
                style="float:right;"
              >
                <i class="uil uil-plus mr-1"></i>Add New Checklist
              </a>
            </div>
          </div> -->

          <!-- <div class="row mt-4">
            <div class="col">
              <h5 class="mb-0">
                Check List
                <span class="text-muted font-size-14"
                  >({{ todayTasks.length }})</span
                >
              </h5>
              <div class="card mb-0 shadow-none">
                <div class="card-body pt-0">
                  <div
                    v-for="(check, index) of todayTasks"
                    :key="index"
                    class="row justify-content-sm-between border-bottom mt-2 pt-2"
                  >
                    <div class="col-lg-12 mb-2 mb-lg-0">
                      <div class="custom-control custom-checkbox">
                        <input
                          :id="`task-${index}`"
                          type="checkbox"
                          class="custom-control-input"
                        />
                        <label
                          class="custom-control-label"
                          :for="`task-${index}`"
                          >{{ check.title }}</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
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
