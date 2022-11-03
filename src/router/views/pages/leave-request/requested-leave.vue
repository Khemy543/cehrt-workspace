<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { getDifferenceInBusinessDays } from '@src/utils/format-date.js'

export default {
  page: {
    title: 'Requested Leave',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Requested Leave',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Requested Leave',
          to: '',
          active: true,
        },
      ],
      leaveRequests: [],
      adminLeaveRequest: [],
      approvedLeaveRequest: [],
      loading: false,
      adminLoading: false,
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.userDepartment.name === 'Administration'
    },
    isSupervisor() {
      return this.$store.state.auth.currentUser.isSupervisor
    },
  },
  created() {
    this.fetchPendingRequestedLeave()

    if (this.isAdmin) {
      this.fetchPendingAdminRequestedLeave();
      this.getAllProved();
    }
  },
  methods: {
    async getAllProved() {
      try {
        const response = await this.$http.get(
          `/fetch/all/approved/leave/requests`
        )

        if (response) {
          this.approvedLeaveRequest = response.data
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
    async fetchPendingRequestedLeave() {
      this.loading = true
      try {
        const response = await this.$http.get(
          `/fetch/supervisor/pending/leave/requests`
        )

        if (response && response.data) {
          this.leaveRequests = response.data
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

    async fetchPendingAdminRequestedLeave() {
      this.adminLoading = true
      try {
        const response = await this.$http.get(
          `/admin/fetch/pending/leave/requests`
        )

        if (response && response.data) {
          this.adminLeaveRequest = response.data
          this.adminLoading = false
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

    getDifference(later, earlier) {
      const newEndDate = later || earlier
      return getDifferenceInBusinessDays(newEndDate, earlier)
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div class="col-12">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <b-tabs pills class="navtab-bg">
                <b-tab
                  v-if="isSupervisor"
                  title="Supervisor Leave Approval"
                  active
                >
                  <div v-if="leaveRequests.length > 0" class="table-responsive">
                    <table class="table mb-0">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Leave Type</th>
                          <th scope="col">Date</th>
                          <th scope="col">Days</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(request, index) in leaveRequests"
                          :key="request.id"
                        >
                          <th scope="row">{{ index + 1 }}</th>
                          <td>{{ request.user }}</td>
                          <td>
                            <div
                              class="badge"
                              :class="{
                                'badge-soft-warning':
                                  `${request.type}` === 'Compassionate',
                                'badge-soft-success':
                                  `${request.type}` === 'Maternity',
                                'badge-soft-danger':
                                  `${request.type}` === 'Sick',
                                'badge-soft-secondary':
                                  `${request.type}` === 'Others',
                                'badge-soft-primary':
                                  `${request.type}` === 'Annual',
                              }"
                              >{{ request.type }}</div
                            >
                          </td>
                          <td
                            >{{ request.start_date }} -
                            {{ request.end_date }}</td
                          >
                          <td>{{
                            getDifference(
                              request.end_date,
                              request.start_date
                            ) + 1
                          }}</td>
                          <td>
                            <router-link :to="`/request/${request.id}/details`">
                              <button class="btn btn-primary btn-sm">
                                view
                              </button>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else class="w-100 d-flex justify-content-center">
                    <img
                      :src="require('@assets/svgs/empty.svg')"
                      alt="no projects"
                      style="width:30%"
                    />
                  </div>
                </b-tab>

                <b-tab v-if="isAdmin" title="Admin Leave Approval">
                  <div
                    v-if="adminLeaveRequest.length > 0"
                    class="table-responsive"
                  >
                    <table class="table mb-0">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Superviosr</th>
                          <th scope="col">Type</th>
                          <th scope="col">Date</th>
                          <th scope="col">Days</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(request, index) in adminLeaveRequest"
                          :key="request.id"
                        >
                          <th scope="row">{{ index + 1 }}</th>
                          <td>{{ request.user }}</td>
                          <td
                            >{{ request.supervisor && request.supervisor.name || 'N/A' }}
                            <label
                              v-if="request.supervisor"
                              class="badge mx-1"
                              :class="{
                                'badge-soft-warning':
                                  `${request.status}` === 'pending',
                                'badge-soft-success':
                                  `${request.status}` === 'approved',
                                'badge-soft-danger':
                                  `${request.status}` === 'rejected',
                              }"
                              >{{ request.status }}</label
                            ></td
                          >
                          <td>
                            <div
                              class="badge"
                              :class="{
                                'badge-soft-warning':
                                  `${request.type}` === 'Compassionate',
                                'badge-soft-success':
                                  `${request.type}` === 'Maternity',
                                'badge-soft-danger':
                                  `${request.type}` === 'Sick',
                                'badge-soft-secondary':
                                  `${request.type}` === 'Others',
                                'badge-soft-primary':
                                  `${request.type}` === 'Annual',
                              }"
                              >{{ request.type }}</div
                            >
                          </td>
                          <td
                            >{{ request.start_date }} -
                            {{ request.end_date }}</td
                          >
                          <td>{{
                            getDifference(
                              request.end_date,
                              request.start_date
                            ) + 1
                          }}</td>
                          <td>
                            <router-link :to="`/request/${request.id}/details?isadmin=true`">
                              <button class="btn btn-primary btn-sm">
                                view
                              </button>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else class="w-100 d-flex justify-content-center">
                    <img
                      :src="require('@assets/svgs/empty.svg')"
                      alt="no projects"
                      style="width:30%"
                    />
                  </div>
                </b-tab>

                <b-tab v-if="isAdmin" title="Approved Leaves">
                  <div
                    v-if="approvedLeaveRequest.length > 0"
                    class="table-responsive"
                  >
                    <table class="table mb-0">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Superviosr</th>
                          <th scope="col">Type</th>
                          <th scope="col">Date</th>
                          <th scope="col">Days</th><!-- 
                          <th scope="col">Action</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(request, index) in approvedLeaveRequest"
                          :key="request.id"
                        >
                          <th scope="row">{{ index + 1 }}</th>
                          <td>{{ request.user }}</td>
                          <td
                            >{{ request.supervisor && request.supervisor.name || 'N/A' }}
                           <!--  <label
                              v-if="request.supervisor"
                              class="badge mx-1"
                              :class="{
                                'badge-soft-warning':
                                  `${request.status}` === 'pending',
                                'badge-soft-success':
                                  `${request.status}` === 'approved',
                                'badge-soft-danger':
                                  `${request.status}` === 'rejected',
                              }"
                              >{{ request.status }}</label
                            > --></td
                          >
                          <td>
                            <div
                              class="badge"
                              :class="{
                                'badge-soft-warning':
                                  `${request.type}` === 'Compassionate',
                                'badge-soft-success':
                                  `${request.type}` === 'Maternity',
                                'badge-soft-danger':
                                  `${request.type}` === 'Sick',
                                'badge-soft-secondary':
                                  `${request.type}` === 'Others',
                                'badge-soft-primary':
                                  `${request.type}` === 'Annual',
                              }"
                              >{{ request.type }}</div
                            >
                          </td>
                          <td
                            >{{ request.start_date }} -
                            {{ request.end_date }}</td
                          >
                          <td>{{
                            getDifference(
                              request.end_date,
                              request.start_date
                            ) + 1
                          }}</td>
                          <!-- <td>
                            <router-link :to="`/request/${request.id}/details?isadmin=true`">
                              <button class="btn btn-primary btn-sm">
                                view
                              </button>
                            </router-link>
                          </td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else class="w-100 d-flex justify-content-center">
                    <img
                      :src="require('@assets/svgs/empty.svg')"
                      alt="no projects"
                      style="width:30%"
                    />
                  </div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
