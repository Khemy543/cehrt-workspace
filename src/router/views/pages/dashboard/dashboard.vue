<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'

import StatChart from '@components/widget-stat-chart'

import {
  revenueAreaChart,
  targetsBarChart,
  salesDonutChart,
  ordersData,
} from './data'
import { calendarFormat } from "@utils/format-date";

/**
 * Dashboard-1 Component
 */
export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    StatChart,
    FullCalendar,
  },
  data() {
    return {
      calendarWeekends: true,
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        bootstrapPlugin,
        listPlugin,
      ],
      themeSystem: 'bootstrap',
      calendarEvents: [],
      createModal: false,
      showModal: false,
      eventModal: false,
      categories: [],
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {},
      editableEvent: {},
      revenueAreaChart: revenueAreaChart,
      targetsBarChart: targetsBarChart,
      salesDonutChart: salesDonutChart,
      ordersData: ordersData,

      maxHeight: '328px',
      statChart: [
        {
          mainTitle: 'Projects',
          value: 0,
          subValue: '5.05%',
          chartColor: '#ffbe0b',
          icon: 'briefcase',
        },
        {
          mainTitle: 'Total Task Assigned',
          value: 0,
          subValue: '10.21%',
          chartColor: '#5369f8',
          icon: 'grid',
        },
        {
          mainTitle: 'completed Task',
          value: 0,
          subValue: '5.05%',
          chartColor: '#f77e53',
          icon: 'check-square',
        },
        {
          mainTitle: 'Pending Task',
          value: 0,
          subValue: '25.16%',
          chartColor: '#43d39e',
          icon: 'clock',
        },
      ],
      projectData: [],
      proposalData: []
    }
  },

  created() {
    this.getCompanyEvents();
    this.getDashData()
  },

  methods: {
    dateClicked(info) {
      if(this.$store.state.auth.userDepartment.name !== 'Administration') {
        return;
      }
      this.newEventData = info
      this.showModal = true
      this.event.start_date = info.dateStr
    },
    editEvent(info) {
      if(this.$store.state.auth.userDepartment.name !== 'Administration') {
        return;
      }
      if (info.event.startEditable) {
        this.edit = info.event
        this.editableEvent = {
          id: this.edit.id.split('-')[1],
          name: this.edit.title,
          start_date: calendarFormat(this.edit.start),
          end_date: calendarFormat(this.edit.end),
        }
        this.eventModal = true
      }
    },
    async getDashData() {
      try {
        const response = await this.$http.get(`/fetch/dashboard-stats`);

        if(response) {
          const { assignedTask, projects, tasks, project_list: projectList, proposal_list: proposalList, deliverable } = response.data
          this.statChart[0].value = projects;
          this.statChart[1].value = assignedTask;
          this.statChart[2].value = tasks.find(item => item.status === 'completed') && tasks.find(item => item.status === 'completed').count || 0;
          this.statChart[3].value = tasks.find(item => item.status === 'pending').count;
          this.projectData = projectList;
          this.proposalData = proposalList;
          const vDeliverables = deliverable.map((item) => ({
            id: `deliverable${item.id}`,
            title: `${item.project_name} (${item.deliverable_name})`,
            start: item.deadline,
            editable: false,
            className: 'bg-danger text-white',
            allDay: true
          }))
          this.calendarEvents = [...this.calendarEvents, ...vDeliverables]
        }
      } catch (error) {
        console.log(error)
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    async getCompanyEvents() {
      try {
        const response = await this.$http.get(`/fetch/company-events`)

        if (response) {
          const vEvents = response.data.map((item) => {
            return {
              id: `event-${item.id}`,
              title: item.name,
              start: item.start_date,
              end: item.end_date,
              editable: true,
              className: 'bg-primary text-white',
              allDay: false
            }
          })
          this.calendarEvents = [...this.calendarEvents, ...vEvents]
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

    async editSubmit() {
      try {
        const response = await this.$http.put(
            `/update/${this.editableEvent.id}/company/event`,
            this.editableEvent
        )

        if (response) {
          const index = this.calendarEvents.findIndex(event => event.id === `event-${this.editableEvent.id}`);

          this.$set(this.calendarEvents, index,  {
            id: `event-${this.editableEvent.id}`,
            title: this.editableEvent.name,
            start: this.editableEvent.start_date,
            end: this.editableEvent.end_date,
            editable: true,
            className: 'bg-primary text-white',
            allDay: false
          })
          this.eventModal = false

          this.$bvToast.toast('Event updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }
    },

    async handleSubmit() {
      try {
        const response = await this.$http.post(`/company/event/create`, this.event)
        if (response) {
          const {
            name,
            start_date: startDate,
            end_date: endDate,
            id,
          } = response.data.event;
          const date = new Date(endDate);
          date.setDate(date.getDate() + 1);
          this.calendarEvents = this.calendarEvents.concat({
            id: `event-${id}`,
            title: name,
            start: startDate,
            end: date,
            editable: true,
            className: 'bg-danger text-white',
            allDay: false
          })
          this.event = {}
          this.$bvToast.toast('Event created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        console.log(error)
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }
      this.showModal = false
    },
    deleteEvent() {
      this.$swal({
        title: 'Do you want to delete event?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const deleteId = this.edit.id.split('-')[1]
            const response = await this.$http.delete(
                `delete/${deleteId}/company/event`
            )

            if (response) {
              this.calendarEvents = this.calendarEvents.filter(
                  (x) => '' + x.id !== '' + this.edit.id
              )
              this.eventModal = false
              this.$bvToast.toast('Event deleted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },
    hideModal(e) {
      this.submitted = false
      this.showModal = false
      this.event = {}
    },
  },
}
</script>

<template>
  <Layout>
    <div class="row page-title align-items-center">
      <div class="col-sm-4 col-xl-6">
        <h4 class="mb-1 mt-0">Dashboard</h4>
      </div>
    </div>

    <div class="row">
      <div
        v-for="stat of statChart"
        :key="stat.mainTitle"
        class="col-md-6 col-xl-3"
      >
        <StatChart
          :main-title="stat.mainTitle"
          :value="stat.value"
          :sub-value="stat.subValue"
          :chart-color="stat.chartColor"
          :icon="stat.icon"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <div style="height: 60vh; overflow:scroll;">
                <FullCalendar
                  ref="fullCalendar"
                  default-view="dayGridMonth"
                  :header="{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                  }"
                  :button-text="{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    list: 'List',
                    prev: 'Prev',
                    next: 'Next',
                  }"
                  :bootstrap-font-awesome="false"
                  :droppable="true"
                  :plugins="calendarPlugins"
                  :events="calendarEvents"
                  :weekends="calendarWeekends"
                  :theme-system="themeSystem"
                  @dateClick="dateClicked"
                  @eventClick="editEvent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-0 mb-0 header-title">Projects</h5>
            <div class="table-responsive mt-4 mb-0">
              <b-table-simple class="table table-hover table-nowrap mb-0">
                <b-thead class="thead-white">
                  <b-tr>
                    <b-th>#</b-th>
                    <b-th>Title</b-th>
                    <b-th>Client</b-th>
                    <b-th>Project Type</b-th>
                    <b-th>Status</b-th>
                    <b-th>Action</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr
                    v-for="(project, index) in projectData"
                    :key="project.id"
                  >
                    <b-td>{{ index + 1 }}</b-td>
                    <b-td>{{ project.name }}</b-td>
                    <b-td>{{ project.client }}</b-td>
                    <b-td>{{
                      project.project_type && project.project_type.name
                    }}</b-td>
                    <b-td>
                      <span
                        class="badge"
                        :class="{
                          'badge-soft-warning':
                            `${project.status}` === 'pending',
                          'badge-soft-success':
                            `${project.status}` === 'completed',
                          'badge-soft-danger':
                            `${project.status}` === 'overdue',
                           'badge-soft-primary':
                            `${project.status}` === 'active',
                        }"
                        >{{ project.status }}</span
                      >
                    </b-td>
                    <b-td class="text-primary">
                      <router-link :to="`project/details/${project.id}`"
                        >View</router-link
                      >
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-0 mb-0 header-title">Proposals</h5>
            <div class="table-responsive mt-4 mb-0">
              <b-table-simple class="table table-hover table-nowrap mb-0">
                <b-thead class="thead-white">
                  <b-tr>
                    <b-th>#</b-th>
                    <b-th>Product Name</b-th>
                    <b-th>Client</b-th>
                    <b-th>Project Type</b-th>
                    <b-th>Status</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="(proposal, index) in proposalData" :key="proposal.name">
                    <b-td>{{ index + 1 }}</b-td>
                    <b-td>{{ proposal.title }}</b-td>
                    <b-td>{{ proposal.client }}</b-td>
                    <b-td><span
                        class="badge"
                        :class="{
                          'badge-soft-warning':
                            `${proposal.status}` === 'pending',
                          'badge-soft-success':
                            `${proposal.status}` === 'completed',
                          'badge-soft-danger':
                            `${proposal.status}` === 'overdue',
                           'badge-soft-primary':
                            `${proposal.status}` === 'active',
                        }"
                    >{{ proposal.status }}</span
                    ></b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
        v-model="showModal"
        title="Add New Event"
        title-class="text-black font-18"
        hide-footer
    >
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="name">Event Name</label>
              <input
                  id="name"
                  v-model="event.name"
                  type="text"
                  class="form-control"
                  placeholder="Enter name"
                  required
              />
            </div>
          </div>
          <div class="col-12">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">Start Date</label>
                  <input
                      id="name"
                      v-model="event.start_date"
                      type="datetime-local"
                      class="form-control"
                      placeholder="Enter start date"
                      required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">End Date</label>
                  <input
                      id="name"
                      v-model="event.end_date"
                      type="datetime-local"
                      class="form-control"
                      placeholder="Enter end date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-right">
          <button type="submit" class="btn btn-success">Save</button>
          <b-button class="ml-1" variant="light" @click="hideModal"
          >Close</b-button
          >
        </div>
      </form>
    </b-modal>

    <!-- Edit Modal -->
    <b-modal
        v-model="eventModal"
        title="Edit Event"
        title-class="text-black font-18"
        hide-footer
    >
      <form @submit.prevent="editSubmit">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="name">Event Name</label>
              <input
                  id="name"
                  v-model="editableEvent.name"
                  type="text"
                  class="form-control"
                  placeholder="Enter name"
                  required
              />
            </div>
          </div>
          <div class="col-12">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">Start Date</label>
                  <input
                      id="name"
                      v-model="editableEvent.start_date"
                      type="datetime-local"
                      class="form-control"
                      placeholder="Enter start date"
                      required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">End Date</label>
                  <input
                      id="name"
                      v-model="editableEvent.end_date"
                      type="datetime-local"
                      class="form-control"
                      placeholder="Enter end date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <b-button type="button" variant="danger" @click="deleteEvent"
          >Delete Event</b-button
          >
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </b-modal>
  </Layout>
</template>
