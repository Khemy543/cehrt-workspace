<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'
import {
  calendarFormat,
  isDateAfter,
  formateDate,
} from '@src/utils/format-date.js'
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Calendar',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { FullCalendar, Layout, PageHeader },
  data() {
    return {
      title: 'Calendar',
      items: [
        {
          text: 'Cehrt',
          href: '/',
        },
        {
          text: 'Calendar',
          active: true,
        },
      ],
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
        // themeSystem: 'bootstrap',
      },
      createModal: false,
      showmodal: false,
      eventModal: false,
      categories: [],
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      editableEvent: {},
      deleteId: {},
      event: {
        name: '',
        start_date: '',
        end_date: '',
      },
      users: [],
      selectedUser: {},
      detailModal: false,
      subtasks: [],
      tasks: [],
      reviewTask: [],
      reviewSubTask: [],
      proposalTasks: [],
      proposalSubtask: [],
      task: {},
    }
  },
  created() {
    this.getDashboardData()
    this.getEvents()
    // this.getLeaveRequests()
    this.getUsers()
  },
  methods: {
    formateDate,
    formateEndDate(date) {
      var newdate = new Date(date)
      newdate.setDate(newdate.getDate() + 1)
      return newdate
    },
    getInitials(name) {
      return name && name
        .match(/\b(\w)/g)
        .join('')
        .toUpperCase()
    },
    async getUsers() {
      try {
        const response = await this.$http.get(`/fetch/all-staff`)

        if (response) {
          this.users = response.data
          this.selectedUser = response.data.find(
            (user) => user.id === this.$store.state.auth.currentUser.id
          )
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
    async getLeaveRequests() {
      try {
        const response = await this.$http.get(
          `/fetch/${this.selectedUser.id ||
            this.$store.state.auth.currentUser.id}/all/leave/requests`
        )

        if (response) {
          const requestedLeaves = response.data
            .filter((request) => request.status !== 'rejected')
            .map((item) => {
              const colors = {
                Sick: 'danger',
                Annual: 'primary',
                Maternity: 'success',
                Compassionate: 'warning',
                Others: 'secondary',
              }
              const color =
                item.status === 'pending'
                  ? `text-${colors[item.type]} bg-soft`
                  : 'text-white bg'
              return {
                id: item.id,
                title: `${item.user} (${item.type} Leave) ${item.status}`,
                editable: false,
                start: calendarFormat(item.start_date),
                end: calendarFormat(item.end_date),
                reason: item.reason,
                className:
                  item.type === 'Sick'
                    ? `${color}-danger`
                    : item.type === 'Annual'
                    ? `${color}-primary`
                    : item.type === 'Maternity'
                    ? `${color}-success`
                    : item.type === 'Compassionate'
                    ? `${color}-warning`
                    : `${color}-secondary`,
              }
            })
          this.calendarOptions.events = [
            ...this.calendarOptions.events,
            ...requestedLeaves,
          ]
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
    async getEvents() {
      try {
        this.calendarOptions.events = this.calendarOptions.events.filter(
          (event) => !event.id.includes('event')
        )
        const response = await this.$http.get(
          `/fetch/${this.selectedUser.id ||
            this.$store.state.auth.currentUser.id}/events`
        )

        if (response) {
          const vEvents = response.data.map((item) => {
            return {
              id: `event-${item.id}`,
              display: 'block',
              title: item.name,
              startRecur: item.start_date,
              endRecur: item.end_date,
              editable: true,
              className: 'bg-info',
            }
          })
          this.calendarOptions.events = [
            ...this.calendarOptions.events,
            ...vEvents,
          ]
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
    async getDashboardData() {
      try {
        this.calendarOptions.events = this.calendarOptions.events.filter(
          (event) => !event.id.includes('task')
        )

        const response = await this.$http.get(
          `/fetch/${this.selectedUser.id ||
            this.$store.state.auth.currentUser.id}/personal/dashboard-data`
        )

        if (response) {
          const {
            subtasks,
            tasks,
            reviewing_tasks: reviewTask,
            reviewing_subtasks: reviewSubTask,
            proposal_report_tasks: proposalTasks,
            proposal_report_subtask: proposalSubtask,
          } = response.data

          this.reviewTask = reviewTask
          this.reviewSubTask = reviewSubTask
          this.proposalTasks = proposalTasks
          this.proposalSubtask = proposalSubtask
          this.subtasks = subtasks
          this.tasks = tasks

          const vReviewTasks = reviewTask.map((item) => {
            return {
              id: `review-task-${item.id}`,
              display: 'block',
              title: item.name,
              // url: `/project/task/${item.id}/details?hasSubTask=${item.has_subtask}&subtask=false`,
              startRecur: isDateAfter(item.start_date, item.end_date)
                ? this.formateEndDate(item.end_date)
                : item.start_date,
              endRecur: this.formateEndDate(item.end_date),
              editable: true,
              className: 'bg-success',
            }
          })

          const vSubTaskReview = reviewSubTask.map((item) => {
            return {
              id: `review-subtask-${item.id}`,
              display: 'block',
              title: item.name,
              // url: `/project/task/${item.id}/details?hasSubTask=false&subtask=true`,
              startRecur: isDateAfter(item.start_date, item.end_date)
                ? this.formateEndDate(item.end_date)
                : item.start_date,
              endRecur: this.formateEndDate(item.end_date),
              editable: true,
              className: 'bg-success',
            }
          })
          const vSubtasks =
            subtasks &&
            subtasks.map((item) => {
              return (
                {
                  id: `user-subtask-${item.id}`,
                  display: 'block',
                  title: `${item.name} ( ${item.status})`,
                  editable: true,
                  // url: `/project/task/${item.id}/details?hasSubTask=false&subtask=true`,
                  startRecur: isDateAfter(item.start_date, item.end_date)
                    ? this.formateEndDate(item.end_date)
                    : item.start_date,
                  endRecur: this.formateEndDate(item.end_date),
                  className: 'bg-primary',
                } || []
              )
            })

          const vTasks =
            tasks &&
            tasks.map((item) => {
              return {
                id: `user-task-${item.id}`,
                display: 'block',
                title: `${item.name} ( ${item.status} )`,
                editable: true,
                // url: `/project/task/${item.id}/details?hasSubTask=${item.hasSubtask}&subtask=false`,
                startRecur: isDateAfter(item.start_date, item.end_date)
                  ? this.formateEndDate(item.end_date)
                  : item.start_date,
                endRecur: this.formateEndDate(item.end_date),
                className: 'bg-primary',
              }
            })

          const vProposalTask =
            proposalTasks &&
            proposalTasks.map((item) => {
              return {
                id: `proposal-task-${item.id}`,
                display: 'block',
                title: `${item.name} ( ${item.status} )`,
                editable: true,
                // url: `/proposal/task/${item.id}/details?hasSubTask=${item.hasSubtask}&subtask=false`,
                startRecur: isDateAfter(item.start_date, item.end_date)
                  ? this.formateEndDate(item.end_date)
                  : item.start_date,
                endRecur: this.formateEndDate(item.end_date),
                className: 'bg-primary',
              }
            })

          const vProposalSubTask =
            proposalSubtask &&
            proposalSubtask.map((item) => {
              return {
                id: `proposal-subtask-${item.id}`,
                display: 'block',
                title: `${item.name} ( ${item.status} )`,
                editable: true,
                // url: `/proposal/task/${item.id}/details?hasSubTask=${item.hasSubtask}&subtask=false`,
                startRecur: isDateAfter(item.start_date, item.end_date)
                  ? this.formateEndDate(item.end_date)
                  : item.start_date,
                endRecur: this.formateEndDate(item.end_date),
                className: 'bg-primary',
              }
            })

          this.calendarOptions.events = [
            ...this.calendarOptions.events,
            ...vSubtasks,
            ...vTasks,
            ...vReviewTasks,
            ...vSubTaskReview,
            ...vProposalTask,
            ...vProposalSubTask,
          ]
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

    /**
     * Modal form submit
     */
    async handleSubmit() {
      try {
        const response = await this.$http.post(`event/create`, this.event)
        if (response) {
          const {
            name,
            start_date: startDate,
            end_date: endDate,
            id,
          } = response.data.event
          var date = new Date(endDate)
          date.setDate(date.getDate() + 1)
          this.events = this.events.concat({
            id: `event-${id}`,
            title: name,
            start: startDate,
            end: date,
            editable: true,
            className: 'bg-danger text-white',
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
      this.showmodal = false
    },
    /**
     * Hide modal along with form reset
     */
    hideModal(e) {
      this.submitted = false
      this.showmodal = false
      this.event = {}
    },
    /**
     * Edit event modal submit
     */
    async editSubmit() {
      try {
        const response = await this.$http.put(
          `/update/${this.editableEvent.id}/event`,
          this.editableEvent
        )

        if (response) {
          const index = this.events.findIndex(
            (event) => event.id === `event-${this.editableEvent.id}`
          )
          this.$set(this.events, index, {
            id: `event-${this.editableEvent.id}`,
            title: this.editableEvent.name,
            start: this.editableEvent.start_date,
            end: this.editableEvent.end_date,
            editable: true,
            className: 'bg-danger text-white',
            allDay: false,
          })

          this.closeModal()

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

    /**
     * Delete event
     */
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
              `/delete/${deleteId}/event`
            )

            if (response) {
              this.events = this.events.filter(
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
    /**
     * Modal open for add event
     */
    dateClicked(info) {
      this.newEventData = info
      this.showmodal = true
      this.event.start_date = calendarFormat(info.dateStr)
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      if (info.event.startEditable) {
        if (info.event.id.includes('task')) {
          const eventId = info.event.id.split('-')[2]

          if (info.event.id.includes('review-task')) {
            this.task = this.reviewTask.find(
              (task) => task.id === Number(eventId)
            )
            this.task.url = `/project/task/${this.task.id}/details?hasSubTask=${this.task.hasSubtask}&subtask=false`
          }

          if (info.event.id.includes('user-task')) {
            this.task = this.tasks.find((task) => task.id === Number(eventId))
            this.task.url = `/project/task/${this.task.id}/details?hasSubTask=${this.task.hasSubtask}&subtask=false`
          }

          if (info.event.id.includes('user-subtask')) {
            this.task = this.subtasks.find(
              (task) => task.id === Number(eventId)
            )
            this.task.url = `/project/task/${this.task.id}/details?hasSubTask=false&subtask=true`
          }

          if (info.event.id.includes('review-subtask')) {
            this.task = this.reviewSubTask.find(
              (task) => task.id === Number(eventId)
            )
            this.task.url = `/project/task/${this.task.id}/details?hasSubTask=false&subtask=true`
          }

          if (info.event.id.includes('proposal-task')) {
            this.task = this.proposalTasks.find(
              (task) => task.id === Number(eventId)
            )
            this.task.url = `/proposal/task/${this.task.id}/details?hasSubTask=${this.task.hasSubtask}&subtask=false`
          }

          if (info.event.id.includes('proposal-subtask')) {
            this.task = this.proposalSubtask.find(
              (task) => task.id === Number(eventId)
            )
            this.task.url = `/proposal/task/${this.task.id}/details?hasSubTask=${this.task.hasSubtask}&subtask=false`
          }

          this.detailModal = true
          return
        }
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
    /**
     * Closes the modal
     */
    closeModal() {
      this.eventModal = false
    },
    selectUser(user) {
      this.selectedUser = user
      this.events = []
      this.getDashboardData()
      this.getEvents()
      this.getLeaveRequests()
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
              <div class="col-xl-2 col-lg-3 col-6">
                <img
                  src="@assets/images/cal.png"
                  class="mr-4 align-self-center img-fluid"
                  alt="cal"
                />
              </div>
              <div class="col-xl-10 col-lg-9">
                <div class="mt-4 mt-lg-0">
                  <h5 class="mt-0 mb-1 font-weight-bold"
                    >Welcome to Your Calendar</h5
                  >
                  <p class="text-muted mb-2">
                    Click on event to see or edit the details. You can create
                    new event by clicking on "Create New event" button or any
                    cell available in calendar below.
                  </p>
                  <div class="d-flex justify-content-between">
                    <b-dropdown
                      class="d-inline"
                      variant="link"
                      toggle-class="font-weight-bold p-0 align-middle"
                    >
                      <template v-slot:button-content>
                        <button
                          id="btn-new-event"
                          class="btn btn-primary mt-2 mr-1"
                        >
                          {{ selectedUser.name }}
                          <i
                            class="uil uil-angle-down font-size-16 align-middle"
                          ></i>
                        </button>
                      </template>
                      <b-dropdown-item
                        v-for="user in users"
                        :key="user.id"
                        href="javascript: void(0);"
                        variant="seconday"
                        @click="selectUser(user)"
                        >{{ user.name }}</b-dropdown-item
                      >
                    </b-dropdown>

                    <button
                      id="btn-new-event"
                      class="btn btn-danger mt-2 mr-1"
                      @click="showmodal = true"
                    >
                      <i class="uil-plus-circle"></i> Create New Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end card body-->
        </div>
        <!-- end card -->
      </div>
      <!-- end col-12 -->
    </div>
    <!-- end row -->

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <FullCalendar ref="fullCalendar" :options="calendarOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="showmodal"
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

    <!-- details modal -->
    <b-modal v-model="detailModal" title="Task Details" hide-footer>
      <h4 style="font-size: 20px;">{{ task.project && task.project.name }}</h4>
      <p>{{ task.deliverable && task.deliverable.name }}</p>
      <hr />

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 class="mr-5" style="color: #848484;">Task</h6>
        <h6>{{ task.name }}</h6>
      </div>

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 style="color: #848484;">Assignee</h6>
        <div
          :id="`test-assignee`"
          class="rounded-circle default-avatar member-overlap-item d-flex justify-content-center align-items-center"
          style="cursor: pointer;"
        >
          <b-tooltip
            :target="`test-assignee`"
            triggers="hover"
            placement="bottom"
            >{{ task.assignee && task.assignee.name }}</b-tooltip
          >
          {{ getInitials(task.assignee && task.assignee.name) }}
        </div>
      </div>

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 style="color: #848484;">Reviewer</h6>
        <div
          :id="`test-assignee`"
          class="rounded-circle default-avatar member-overlap-item d-flex justify-content-center align-items-center"
          style="cursor: pointer;"
        >
          <b-tooltip
            :target="`test-assignee`"
            triggers="hover"
            placement="bottom"
            >{{ task.reviewer && task.reviewer.name }}</b-tooltip
          >
          {{ getInitials(task.reviewer && task.reviewer.name) }}
        </div>
      </div>

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 style="color: #848484;">Priority</h6>
        <div
          style="align-self: start; margin-top: 10px;"
          class="badge"
          :class="
            task.priority === 'high'
              ? 'badge-danger'
              : task.priority === 'medium'
              ? 'badge-warning'
              : ''
          "
          >{{ task.priority }}</div
        >
      </div>

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 style="color: #848484;">Status</h6>
        <div
          style="align-self: start; margin-top: 10px;"
          class="badge"
          :class="
            task.status === 'active'
              ? 'badge-success'
              : task.status === 'pending'
              ? 'badge-warinig'
              : task.status === 'hold'
              ? 'badge-danger'
              : 'badge-primary'
          "
          >{{
            task.status === 'active'
              ? 'On going'
              : task.status === 'pending'
              ? 'Pending'
              : task.status === 'hold'
              ? 'On hold'
              : task.status && task.status.split('-').join(' ')
          }}</div
        >
      </div>

      <div class="d-flex justify-content-between items-align-center mb-2">
        <h6 style="color: #848484;">Due Date</h6>
        <h6
          ><i class="uil-calendar-slash mr-1 text-danger"></i
          >{{ task.end_date && formateDate(task.end_date) }}</h6
        >
      </div>

      <hr />
      <div class="d-flex justify-content-end">
        <router-link type="submit" class="btn btn-primary" :to="task.url"
          >View Task</router-link
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
<style scoped>
.default-avatar {
  background-color: #5369f8;
  font-weight: 500;
  color: #fff;
  font-size: 14px;
}

.default-avatar,
.member-overlap-item {
  height: 36px;
  width: 36px;
}
</style>
