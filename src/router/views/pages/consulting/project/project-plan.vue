<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'

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
                    text: "Project Plan",
                    to: "",
                    active: true
                }
            ],
            loading: false,
            project: {}
        }
    },
    computed: {
        projectDeliverable() {
            return this.project.deliverable || []
        },
        department() {
            return this.$store
                ? this.$store.state.auth.userDepartment
                : {} || {}
        }
    },
    created() {
        this.getProjectPlan()
    },
    methods: {
        async getProjectPlan() {
            try {
                this.loading = true
                const response = await this.$http.get(`/fetch/project/${this.$route.params.id}/overview`)

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
            return roles && roles.find(item => item.department_id === this.department.id) || {};
        },
        async saveDetails(task) {
            const tempTask = { ...task, amount: task.rate * task.allocated_days }

            try {
                const response = await this.$http.put(`/update/${task.id}/task`, tempTask);

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
          let total = 0;

          for(const task of tasks) {
            const taskTotal = this.getAmount(task.allocated_days, task.rate, task.ExtractRawComponents);
            total = Number(total) + Number(taskTotal)
          }

          return total.toFixed(2);
      },
      getTotal() {
          let total = 0;
          for(const deliverable of this.projectDeliverable) {
            const deliverableTotal = this.getDeliverableTotalPrice(deliverable.tasks);
            total = Number(total) + Number(deliverableTotal)
          }
          return total.toFixed(2);
      }
    }
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
                                <button type="button" class="btn btn-primary mr-4 mb-3 mb-sm-0">
                                    <i class="uil-files-landscapes mr-1"></i> Save Project Plan
                                </button>
                            </div>
                            <div class="mt-5">
                                <h4>Project Deliverables</h4>
                                <div v-if="projectDeliverable.length <= 0" class="mt-5 d-flex align-items-center justify-content-center text-center">
                                    <div>
                                        <h6>This project has no deliverbles</h6>
                                        <router-link
                                            id="btn-new-event"
                                            :to="`/project/details/${$route.params.id}`"
                                            class="btn btn-danger"
                                        >Go back to Project</router-link>
                                    </div>
                                </div>

                                <div
                                    v-for="deliverable in projectDeliverable"
                                    v-else
                                    :key="deliverable.id"
                                    class="mt-4"
                                >
                                    <h5>{{ deliverable.name }}</h5>

                                    <h6
                                        v-if="deliverable.tasks.length <= 0"
                                        class="mt-2"
                                    >This Deliverable has no task</h6>
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
                                                    :key="task.id"
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
                                                        style="width:200px"
                                                        v-if="getConsultingRole(task.assignee_position).name === 'External Consultant'"
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
                                                    <td v-else>{{ task.rate_currency }} {{ task.rate || 'N/A' }}</td>

                                                    <td>{{ getAmount(task.allocated_days, task.rate, task.ExtractRawComponents) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <h5 v-if="deliverable.tasks.length > 0">Total Price {{ getDeliverableTotalPrice(deliverable.tasks) }}</h5>
                                </div>

                                <div v-if="projectDeliverable.length > 0" class="mt-4">
                                    <h4>Project Total: {{ getTotal() }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
