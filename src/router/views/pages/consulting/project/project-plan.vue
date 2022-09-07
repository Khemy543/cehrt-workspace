<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import formateAmount from '@src/utils/formate-money.js'

export default {
  page: {
    title: 'Project Plan',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
  data() {
    return {
      title: 'Projects Plan',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Projects',
          to: '/',
          active: true,
        },
        {
          text: 'Project Plan',
          to: '',
          active: true,
        },
      ],
      loading: false,
      project: {},
      submitModal: false,
      form: {
        principal: '',
      },
      staff: [],
    }
  },
  computed: {
    subTasks() {
      let subTasks = []
      this.projectDeliverable.forEach((deliverable) => {
        deliverable.tasks.forEach((task) => {
          subTasks = [...subTasks, ...task.subtasks]
        })
      })
      return subTasks
    },
    positions() {
      return this.$store
        ? this.$store.state.auth.currentUser.position
        : [] || []
    },
    isPrincipalConsultant() {
      return (
        this.positions.some(
          (position) => position.name === 'Principal Consultant'
        ) && this.$route.query.isPrincipalConsultant === 'true'
      )
    },
    projectDeliverable() {
      return this.project.deliverable || []
    },
    department() {
      return this.$store ? this.$store.state.auth.userDepartment : {} || {}
    },
    principalConsultants() {
      return (
        this.staff.filter((staff) =>
          staff.position.some((item) => item.name === 'Principal Consultant')
        ) || []
      )
    },
  },
  created() {
    this.getProjectPlan()
    this.getConsultingStaff()
  },
  methods: {
    getDeliverableSubtasks(tasks) {
      let subTasks = []
      tasks.forEach((task) => {
        subTasks = [...subTasks, ...task.subtasks]
      })

      return subTasks
    },
    showSubmitModal() {
      this.submitModal = true
    },
    amountFormat(amount) {
      return formateAmount(amount)
    },
    async getConsultingStaff() {
      try {
        const response = await this.$http.get(
          `/fetch/${this.department.id}/department-staff`
        )
        this.staff = response.data
      } catch (error) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    async getProjectPlan() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/project/${this.$route.params.id}/overview`
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

    getAmount(days, rate, currency) {
      return (Number(days) * Number(rate)).toFixed(2)
    },

    getConsultingRole(roles) {
      return (
        (roles &&
          roles.find((item) => item.department_id === this.department.id)) ||
        {}
      )
    },
    async saveDetails(task) {
      const tempTask = { ...task, amount: task.rate * task.allocated_days }

      try {
        const response = await this.$http.put(
          `/update/${task.id}/task`,
          tempTask
        )

        if (response) {
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

    async saveSubTaskDetails(task) {
      const tempTask = { ...task, amount: task.rate * task.allocated_days }

      try {
        const response = await this.$http.put(
          `/update/${task.id}/sub-task`,
          tempTask
        )

        if (response) {
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
    getDeliverableTotalPrice(tasks) {
      let total = 0

      for (const task of tasks) {
        for (const subTask of task.subtasks) {
          const subtaskTotal = this.getAmount(
            subTask.allocated_days,
            subTask.rate,
            subTask.ExtractRawComponents
          )
          total = Number(total) + Number(subtaskTotal)
        }
        const taskTotal = this.getAmount(
          task.allocated_days,
          task.rate,
          task.ExtractRawComponents
        )
        total = Number(total) + Number(taskTotal)
      }

      return total.toFixed(2)
    },
    getTotalDaysAllocated(tasks) {
      let total = 0
      for (const task of tasks) {
        for (const subTask of task.subtasks) {
          total = Number(total) + Number(subTask.allocated_days)
        }
        total = Number(total) + Number(task.allocated_days)
      }

      return total
    },
    getTotal() {
      let total = 0
      for (const deliverable of this.projectDeliverable) {
        const deliverableTotal = this.getDeliverableTotalPrice(
          deliverable.tasks
        )
        total = Number(total) + Number(deliverableTotal)
      }
      return total.toFixed(2)
    },
    async submitPlanForApproval() {
      try {
        const response = await this.$http.patch(
          `/submit/project/${this.$route.params.id}/approval/request`,
          {
            principal_consultant_id: this.form.principal,
          }
        )

        if (response) {
          this.submitModal = false
          this.$bvToast.toast('Request submitted successfully', {
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
        })
      }
    },

    approvalProjectPlan() {
      this.$swal({
        title: 'Approve Project Plan?',
        showDenyButton: true,
        confirmButtonText: 'Approve',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(
              `/approve/project/${this.$route.params.id}/plan`
            )

            if (response) {
              this.$bvToast.toast('Project plan approved successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })

              setTimeout(() => {
                this.$router.push(`/project/details/${this.$route.params.id}`)
              }, 2000)
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },

    saveProjectPlan() {
      this.$bvToast.toast('Project plan saved successfully', {
        title: 'Success',
        autoHideDelay: 5000,
        appendToast: false,
        variant: 'success',
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div class="row page-title align-items-center">
      <div class="col-md-3 col-xl-6">
        <h4 class="mb-1 mt-0">Project Plan</h4>
      </div>
    </div>

    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" size="sm" variant="primary"></b-spinner>
    </div>

    <div v-else class="row">
      <div class="col">
        <div class="card">
          <div class="card-body p-0">
            <div class="card-title border-bottom p-3 mb-0 w-100">
              <div class="d-flex justify-content-between">
                <h4>{{ project.name }}</h4>
                <div class=" d-flex">
                  <button
                    type="button"
                    class="btn btn-primary mr-4 mb-3 mb-sm-0"
                    @click="saveProjectPlan"
                  >
                    <i class="uil-files-landscapes mr-1"></i> Save Project Plan
                  </button>
                  <button
                    v-if="isPrincipalConsultant"
                    type="button"
                    class="btn btn-danger mr-4 mb-3 mb-sm-0"
                    @click="approvalProjectPlan"
                  >
                    Approve Project Plan
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn btn-danger mr-4 mb-3 mb-sm-0"
                    @click="showSubmitModal"
                  >
                    Submit For Approval
                  </button>
                </div>
              </div>
              <div class="mt-5">
                <h4>Project Deliverables</h4>
                <div
                  v-if="projectDeliverable.length <= 0"
                  class="mt-5 d-flex align-items-center justify-content-center text-center"
                >
                  <div>
                    <h6>This project has no deliverbles</h6>
                    <router-link
                      id="btn-new-event"
                      :to="`/project/details/${$route.params.id}`"
                      class="btn btn-danger"
                      >Go back to Project</router-link
                    >
                  </div>
                </div>

                <div
                  v-for="deliverable in projectDeliverable"
                  v-else
                  :key="deliverable.id"
                  class="mt-4"
                >
                  <h5>{{ deliverable.name }}</h5>

                  <h6 v-if="deliverable.tasks.length <= 0" class="mt-2"
                    >This Deliverable has no task</h6
                  >
                  <div v-else class="w-100">
                    <table class="table mb-0">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Task</th>
                          <th scope="col">Assignee</th>
                          <th scope="col">Days Allocated</th>
                          <th scope="col">Rate</th>
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(task, index) in deliverable.tasks"
                          :key="`task-${task.id}`"
                        >
                          <th scope="row">{{ index + 1 }}</th>
                          <td>{{ task.name }}</td>
                          <td>{{ task.assignee || 'N/A' }}</td>
                          <td>
                            <div style="width:100px;">
                              <b-form-input
                                v-model="task.allocated_days"
                                type="number"
                                placeholder="0"
                                required
                                @blur="saveDetails(task)"
                              ></b-form-input>
                            </div>
                          </td>
                          <td
                            v-if="
                              getConsultingRole(task.assignee_position).name ===
                                'External Consultant'
                            "
                            style="width:200px"
                          >
                            <div style="display: flex; align-items: center">
                              <div>GHS</div>
                              <b-form-input
                                v-model="task.rate"
                                type="text"
                                placeholder="0"
                                required
                                class=" mx-2"
                                @blur="saveDetails(task)"
                              ></b-form-input>
                            </div>
                          </td>
                          <td v-else
                            >{{ task.rate_currency }}
                            {{ amountFormat(task.rate) || 'N/A' }}</td
                          >

                          <td>{{
                            amountFormat(
                              getAmount(
                                task.allocated_days,
                                task.rate,
                                task.ExtractRawComponents
                              )
                            )
                          }}</td>
                        </tr>

                        <tr
                          v-for="(task, index) in getDeliverableSubtasks(
                            deliverable.tasks
                          )"
                          :key="`subtask-${task.id}`"
                        >
                          <th scope="row">{{
                            index + deliverable.tasks.length + 1
                          }}</th>
                          <td>{{ task.name }}</td>
                          <td>{{ task.assignee || 'N/A' }}</td>
                          <td>
                            <div style="width:100px;">
                              <b-form-input
                                v-model="task.allocated_days"
                                type="number"
                                placeholder="0"
                                required
                                @blur="saveSubTaskDetails(task)"
                              ></b-form-input>
                            </div>
                          </td>
                          <td
                            v-if="
                              getConsultingRole(task.assignee_position).name ===
                                'External Consultant'
                            "
                            style="width:200px"
                          >
                            <div style="display: flex; align-items: center">
                              <div>GHS</div>
                              <b-form-input
                                v-model="task.rate"
                                type="text"
                                placeholder="0"
                                required
                                class=" mx-2"
                                @blur="saveSubTaskDetails(task)"
                              ></b-form-input>
                            </div>
                          </td>
                          <td v-else
                            >{{ task.rate_currency }}
                            {{ amountFormat(task.rate) || 'N/A' }}</td
                          >

                          <td>{{
                            amountFormat(
                              getAmount(
                                task.allocated_days,
                                task.rate,
                                task.ExtractRawComponents
                              )
                            )
                          }}</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td>Total</td>
                          <td></td>
                          <td
                            >{{
                              getTotalDaysAllocated(deliverable.tasks)
                            }}
                            days</td
                          >
                          <td></td>
                          <td
                            >GHS
                            {{
                              amountFormat(
                                getDeliverableTotalPrice(deliverable.tasks)
                              )
                            }}</td
                          >
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-if="projectDeliverable.length > 0" class="mt-4">
                  <h4>Project Total: GHS {{ amountFormat(getTotal()) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      v-model="submitModal"
      title="Submit Project Plan"
      title-class="font-18"
      hide-footer
    >
      <form @submit.prevent="submitPlanForApproval">
        <b-form-group
          id="input-group-1"
          label="Principal Consultant"
          label-for="input-1"
        >
          <b-form-select v-model="form.principal" class="mb-2" required>
            <option value="" disabled>Select principal consultant</option>
            <option
              v-for="consultant in principalConsultants"
              :key="consultant.id"
              :value="consultant.id"
              >{{ consultant.name }}</option
            >
          </b-form-select>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <template v-slot:modal-footer>
        <div></div>
      </template>
    </b-modal>
  </Layout>
</template>
