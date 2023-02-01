<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import formateAmount from '@src/utils/formate-money.js'
import PaymentTable from '@/src/components/Finance/PaymentTable.vue'

export default {
  page: {
    title: 'Project Plan',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PaymentTable },
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
  },
  created() {
    this.getProjectPlan()
  },
  methods: {
    amountFormat(amount) {
      return formateAmount(amount)
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
                <h4>{{ project.name }} </h4>
              </div>
              <div>
                <div
                  v-if="projectDeliverable.length <= 0"
                  class="mt-5 d-flex align-items-center justify-content-center text-center"
                >
                  <div>
                    <h6>This project has no deliverbles</h6>
                    <router-link
                      id="btn-new-event"
                      :to="department.name === 'Finance' ? `/finance/project/${$route.params.id}/details` : `/project/details/${$route.params.id}`"
                      class="btn btn-danger"
                      >Go back to Project</router-link
                    >
                  </div>
                </div>
                <b-tabs v-else pills class="navtab-bg mt-5">
                  <b-tab
                    v-for="(deliverable, dIndex) in projectDeliverable"
                    :key="deliverable.id"
                    class="mt-4"
                    :title="deliverable.name"
                    :active="dIndex === 0"
                  >
                    <h6 v-if="deliverable.tasks.length <= 0" class="mt-2"
                      >This Deliverable has no task</h6
                    >
                    <div v-else class="w-100">
                      <div
                        class="d-flex justify-content-between align-items-center table-head w-100"
                      >
                        <h4>#</h4>
                        <h4>Task</h4>
                        <h4>Assignee</h4>
                        <h4>Days Allocated</h4>
                        <h4>Rate</h4>
                        <h4>Amount</h4>
                      </div>

                      <div
                        v-for="(task, index) in deliverable.tasks"
                        :key="`task-${task.id}`"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center table-body w-100"
                        >
                          <h4>{{ index + 1 }}</h4>
                          <h4>{{ task.name }}</h4>
                          <h4>{{ task.assignee || 'N/A' }}</h4>
                          <h4>{{ task.allocated_days || 'N/A' }}</h4>
                          <h4
                            >{{ task.rate_currency }}
                            {{ amountFormat(task.rate) || 'N/A' }}</h4
                          >
                          <h4>{{
                            amountFormat(
                              getAmount(
                                task.allocated_days,
                                task.rate,
                                task.ExtractRawComponents
                              )
                            )
                          }}</h4>
                        </div>
                        <div v-if="task.subtasks.length > 0" class="subtask">
                          <div
                            v-for="(vtask, vIndex) in task.subtasks"
                            :key="`subtask-${vtask.id}`"
                            class="d-flex justify-content-between align-items-center table-body w-100"
                          >
                            <h4>{{ index + 1 }}.{{ vIndex + 1 }}</h4>
                            <h4>{{ vtask.name }}</h4>
                            <h4>{{ vtask.assignee || 'N/A' }}</h4>
                            <h4>{{ vtask.allocated_days || 'N/A' }}</h4>
                            <h4
                              >{{ vtask.rate_currency }}
                              {{ amountFormat(vtask.rate) || 'N/A' }}</h4
                            >
                            <h4>{{
                              amountFormat(
                                getAmount(
                                  vtask.allocated_days,
                                  vtask.rate,
                                  vtask.ExtractRawComponents
                                )
                              )
                            }}</h4>
                          </div>
                        </div>
                      </div>

                      <div class="table-footer">
                        <h4
                          >total days allocated:
                          <span>{{
                            getTotalDaysAllocated(deliverable.tasks)
                          }}</span></h4
                        >
                        <h4
                          >Deliverable total:
                          <span
                            >GHS
                            {{
                              amountFormat(
                                getDeliverableTotalPrice(deliverable.tasks)
                              )
                            }}</span
                          ></h4
                        >
                      </div>
                    </div>

                    <hr />

                    <div v-if="deliverable.tasks.length > 0" class="my-5 payment-table ">
                      <h4 class="mb-1">Consultant Total Payment Table</h4>
                      <PaymentTable :deliverable="deliverable" />
                    </div>
                  </b-tab>
                </b-tabs>

                <!-- <div
                  v-if="projectDeliverable.length > 0"
                  class="table-footer mt-4"
                >
                  <h4
                    >Project Total:
                    <span>GHS {{ amountFormat(getTotal()) }}</span></h4
                  >
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped>
.deliverable_wrap {
  border-radius: 5px;
}

.deliverable_name {
  text-transform: uppercase;
  font-size: 14px;
}

.table-head {
  margin-top: 8px;
}

.table-head h4 {
  font-size: 14px;
  text-transform: uppercase;
  text-align: left;
}

.table-body {
  border-radius: 5px;
  margin-bottom: 6px;
}

.subtask .table-body h4 {
  color: #4b4b5a;
}

.table-body h4 {
  font-size: 13px;
  text-align: left;
  color: #4b4b5a;
}

.table-head h4:first-child,
.table-body h4:first-child {
  width: 5%;
  padding: 0 10px;
}

.table-head h4:nth-child(2),
.table-body h4:nth-child(2) {
  width: 30%;
}

.table-head h4:nth-child(3),
.table-body h4:nth-child(3) {
  width: 25%;
}

.table-head h4:nth-child(4),
.table-body h4:nth-child(4) {
  width: 15%;
}
.table-head h4:nth-child(5),
.table-body h4:nth-child(5) {
  width: 15%;
}

.table-head h4:last-child,
.table-body h4:last-child {
  width: 10%;
}

.subtask-label {
  font-size: 12px;
  text-transform: uppercase;
  text-align: center;
}

.subtask-wrap {
  display: flex;
  justify-content: center;
}
.table-footer {
  margin-top: 40px;
}

.table-footer h4 {
  font-size: 14px;
  text-transform: uppercase;
}

.table-footer h4 span {
  font-weight: 700;
  font-size: 20px;
}

.payment-table h4 {
  text-transform: uppercase;
  font-size: 14px;
}
</style>
