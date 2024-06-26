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

import { calendarFormat, formateDateTime } from '@utils/format-date'

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
      calendarOptions: {
        initialView: 'dayGridMonth',
        dayMaxEventRows: true,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        },
        weekends: true,
        events: [],
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
          listPlugin,
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        'button-text': {
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List',
          prev: 'Prev',
          next: 'Next',
        },
        eventClick: (e) => this.editEvent(e),
        dateClick: (e) => this.dateClicked(e),
        // themeSystem: 'bootstrap',
      },
      createModal: false,
      showModal: false,
      eventModal: false,
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {},
      editableEvent: {},

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
      proposalData: [],
      companyEvents: [],
      reports: [],
      deliverables: [],
      viewDetailsModal: false,
      eventObject: {},
    }
  },
  computed: {
    department() {
      return this.$store ? this.$store.state.auth.userDepartment : {} || {}
    },
    isAdmin() {
      return this.$store.state.auth.userDepartment.name === 'Administration'
    },
  },

  created() {
    this.getCompanyEvents()
    this.getDashData()
  },
  methods: {
    formateDateTime,
    dateClicked(info) {
      if (this.$store.state.auth.userDepartment.name !== 'Administration') {
        return
      }
      this.newEventData = info
      this.event.start_date = calendarFormat(info.dateStr)
      this.showModal = true
    },
    editEvent(info) {
      /* if (
        this.$store.state.auth.userDepartment.name === 'Administration' &&
        info.event.id.includes('event')
      ) {
        if (info.event.startEditable) {
          this.edit = info.event
          this.editableEvent = {
            id: this.edit.id.split('-')[1],
            name: this.edit.title,
            start_date: calendarFormat(this.edit.start),
            end_date: this.edit.end ? calendarFormat(this.edit.end) : null,
          }
          this.eventModal = true
        }
        return
      } */

      const eventId = info.event.id.split('-')[1]
      if (info.event.startEditable) {
        if (info.event.id.includes('event')) {
          const eventObject = this.companyEvents.find(
            (vevent) => Number(vevent.id) === Number(eventId)
          )
          this.eventObject = { ...eventObject, is_event: true }
          this.edit = info.event
          this.viewDetailsModal = true
        }

        if (info.event.id.includes('deliverable')) {
          const eventObject = this.deliverables.find(
            (dev) => Number(dev.id) === Number(eventId)
          )
          this.eventObject = eventObject
          this.eventObject.url = ''
          this.viewDetailsModal = true
        }

        if (info.event.id.includes('report')) {
          const eventObject = this.reports.find(
            (report) => Number(report.id) === Number(eventId)
          )
          this.eventObject = eventObject
          this.eventObject.url = ''
          this.viewDetailsModal = true
        }
      }
    },
    async getDashData() {
      try {
        const response = await this.$http.get(`/fetch/dashboard-stats`)

        if (response) {
          const {
            projects,
            tasks,
            project_list: projectList,
            proposal_list: proposalList,
            deliverable,
            total_task_assigned: totalTaskAssigned,
            proposal_report: proposalReport,
          } = response.data
          this.statChart[0].value = projects
          this.statChart[1].value = totalTaskAssigned
          this.statChart[2].value =
            (tasks.find((item) => item.status === 'completed') &&
              tasks.find((item) => item.status === 'completed').count) ||
            0
          this.statChart[3].value =
            (tasks.find((item) => item.status === 'pending') &&
              tasks.find((item) => item.status === 'pending').count) ||
            0
          this.projectData = projectList
          this.proposalData = proposalList
          const vDeliverables = deliverable.map((item) => ({
            id: `deliverable-${item.id}`,
            title: `${item.project_name} (${item.deliverable_name})`,
            start: item.deadline,
            editable: true,
            className: 'bg-danger text-white',
            allDay: true,
          }))
          const vReports = proposalReport.map((item) => ({
            id: `report-${item.id}`,
            title: `${item.proposal_title} (${item.proposal_type.report_title})`,
            start: calendarFormat(item.deadline),
            className: 'bg-success text-white',
            allDay: true,
            editable: true,
          }))
          this.calendarOptions.events = [
            ...this.calendarOptions.events,
            ...vDeliverables,
            ...vReports,
          ]

          this.reports = proposalReport
          this.deliverables = deliverable
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
              allDay: false,
            }
          })
          this.calendarOptions.events = [
            ...this.calendarOptions.events,
            ...vEvents,
          ]
          this.companyEvents = response.data
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
          const index = this.calendarOptions.events.findIndex(
            (event) => event.id === `event-${this.editableEvent.id}`
          )

          this.$set(this.calendarOptions.events, index, {
            id: `event-${this.editableEvent.id}`,
            title: this.editableEvent.name,
            start: this.editableEvent.start_date,
            end: this.editableEvent.end_date,
            editable: false,
            className: 'bg-primary text-white',
            allDay: false,
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
        const response = await this.$http.post(
          `/company/event/create`,
          this.event
        )
        if (response) {
          const {
            name,
            start_date: startDate,
            end_date: endDate,
            id,
          } = response.data.event
          const date = new Date(endDate)
          date.setDate(date.getDate() + 1)
          this.calendarOptions.events = this.calendarOptions.events.concat({
            id: `event-${id}`,
            title: name,
            start: startDate,
            end: date,
            editable: true,
            className: 'bg-primary text-white',
            allDay: false,
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
              this.calendarOptions.events = this.calendarOptions.events.filter(
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

    openEditForm() {
      if (this.edit.startEditable) {
        this.editableEvent = {
          id: this.edit.id.split('-')[1],
          name: this.edit.title,
          start_date: calendarFormat(this.edit.start),
          end_date: this.edit.end ? calendarFormat(this.edit.end) : null,
        }
        this.viewDetailsModal = false
        this.eventModal = true
      }
    },

    createProjectUrl(id) {
      if (this.department.name === 'Administration') {
        return `/admin/project/${id}/details`
      }

      if (this.department.name === 'Finance') {
        return `/finance/project/${id}/details`
      }

      return `/project/details/${id}`
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
                <FullCalendar ref="fullCalendar" :options="calendarOptions" />
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
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Client</th>
                    <th scope="col">Project Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(project, index) in projectData" :key="project.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ project.name }}</td>
                    <td>{{ project.client }}</td>
                    <td>{{
                      project.project_type && project.project_type.name
                    }}</td>
                    <td>
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
                          'badge-soft-warning': `${project.status}` === 'hold',
                        }"
                        >{{ project.status }}</span
                      >
                    </td>
                    <td class="text-primary">
                      <router-link :to="createProjectUrl(project.id)">
                        View</router-link
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-0 mb-0 header-title">Proposals</h5>
            <div class="table-responsive mt-4 mb-0">
              <table class="table mb-0">
                <thead scope="col" class="thead-white">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Proposal Name</th>
                    <th scope="col">Client</th>
                    <th scope="col">Proposal Type</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(proposal, index) in proposalData"
                    :key="proposal.name"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ proposal.title }}</td>
                    <td>{{ proposal.client }}</td>
                    <td>{{
                      proposal.project_type && proposal.project_type.name
                    }}</td>
                    <td>
                      <router-link :to="`proposals/details/${proposal.id}`"
                        >View</router-link
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
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

    <b-modal v-model="viewDetailsModal" title="Event Details" hide-footer>
      <h4 style="font-size: 20px;">{{
        eventObject.name || eventObject.project_name
      }}</h4>
      <p>{{ eventObject.description || eventObject.deliverable_name }}</p>
      <hr />

      <div
        v-if="eventObject.start_date"
        class="d-flex justify-content-between items-align-center mb-2"
      >
        <h6 style="color: #848484;">Start Date</h6>
        <h6
          ><i class="uil-calender mr-1 text-success"></i
          >{{
            eventObject.start_date && formateDateTime(eventObject.start_date)
          }}</h6
        >
      </div>

      <div
        v-if="eventObject.deadline"
        class="d-flex justify-content-between items-align-center mb-2"
      >
        <h6 style="color: #848484;">Deadline</h6>
        <h6
          ><i class="uil-calendar-slash mr-1 text-danger"></i
          >{{
            eventObject.deadline && formateDateTime(eventObject.deadline)
          }}</h6
        >
      </div>

      <div
        v-if="eventObject.end_date"
        class="d-flex justify-content-between items-align-center mb-2"
      >
        <h6 style="color: #848484;">End Date</h6>
        <h6
          ><i class="uil-calendar-slash mr-1 text-danger"></i
          >{{
            eventObject.end_date && formateDateTime(eventObject.end_date)
          }}</h6
        >
      </div>

      <hr />
      <div class="d-flex justify-content-end">
        <button
          v-if="isAdmin && eventObject.is_event"
          type="submit"
          class="btn btn-primary mr-3"
          @click="openEditForm"
          >Edit</button
        >
        <button
          type="submit"
          class="btn btn-danger"
          @click="viewDetailsModal = false"
          >Close</button
        >
      </div>
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
