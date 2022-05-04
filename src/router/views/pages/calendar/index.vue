<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'
import { dateFormate } from '@src/utils/format-date.js'
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
      }
    }
  },
  created() {
    this.getDashboardData()
    this.getEvents()
    this.getLeaveRequests()
  },
  methods: {
    async getLeaveRequests() {
      try {
        const response = await this.$http.get(`/fetch/all/leave/requests`);

        if (response) {
          const requestedLeaves = response.data.filter(request => request.status !== 'rejected').map((item) => {
            const colors = {
              'Sick': 'danger',
              'Annual': 'primary',
              'Maternity': 'success',
              'Compassionate': 'warning',
              'Others': 'secondary'
            }
            const color = item.status === 'pending' ? `text-${colors[item.type]} bg-soft` : 'text-white bg';
            return {
              id: item.id,
              title: `${item.user} (${item.type} Leave) ${item.status}`,
              editable: true,
              start: dateFormate(item.start_date),
              end: dateFormate(item.end_date),
              reason: item.reason,
              className: item.type === 'Sick' ? `${color}-danger` : item.type === 'Annual' ? `${color}-primary` : item.type === 'Maternity' ? `${color}-success` : item.type === 'Compassionate' ? `${color}-warning` : `${color}-secondary`
            }
          })
          this.calendarEvents = [...this.calendarEvents, ...requestedLeaves]
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
        const response = await this.$http.get(`fetch/events`)

        if (response) {
          const vEvents = response.data.map((item) => {
            return {
              id: `event-${item.id}`,
              title: item.name,
              start: item.start_date,
              end: item.end_date,
              editable: true,
              className: 'bg-danger text-white',
            }
          })
          this.calendarEvents = [...this.calendarEvents, ...vEvents];
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
    async getDashboardData() {
      try {
        const response = await this.$http.get(`/fetch/personal/dashboard-data`)

        if (response) {
          const { subtasks, tasks } = response.data

          const vSubtasks =
            subtasks &&
            subtasks.map((item) => {
              return {
                id: `subtask-${item.id}`,
                title: `${item.name} ( ${item.status})`,
                end: item.end_date,
                editable: false,
                url: `/task/${item.id}/details?hasSubTask=false&subtask=true`,
                start:
                  item.start_date ||
                  (item.created_at && item.created_at.split('T')[0]),
                className: 'bg-primary-text-white',
              } || []

            })

          const vTasks =
            tasks &&
            tasks.map((item) => {
              return {
                id: `task-${item.id}`,
                title: `${item.name} ( ${item.status} )`,
                end: item.end_date,
                editable: false,
                url: `/task/${item.id}/details?hasSubTask=${item.hasSubtask}&subtask=false`,
                start:
                  item.start_date ||
                  (item.created_at && item.created_at.split('T')[0]),
                className: 'bg-primary-text-white',
              }
            })

          this.calendarEvents = [...this.calendarEvents, ...vSubtasks, ...vTasks]
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
          this.calendarEvents = this.calendarEvents.concat({
            id: `event-${id}`,
            title: name,
            start: startDate,
            end: endDate,
            editable: true,
            className: 'bg-danger text-white',
          })
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
        const response = await this.$http.put(`/update/${this.editableEvent.id}/event`, this.editableEvent);

        if (response) {
          const { name, start_date: startDate, end_date: endDate } = response.data.event;
          this.edit.setProp('title', name);
          this.edit.setProp('start', startDate);
          this.edit.setProp('end', endDate)
          this.eventModal = false;

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
            const response = await this.$http.delete(`/delete/${deleteId}/event`);

            if (response) {
              this.calendarEvents = this.calendarEvents.filter(
                (x) => '' + x.id !== '' + this.edit.id
              )
              this.eventModal = false;
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
      this.event.start_date = info.dateStr
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      if (info.event.startEditable) {
        this.edit = info.event
        this.editableEvent = {
          id: this.edit.id.split('-')[1],
          name: this.edit.title,
          start_date: dateFormate(this.edit.start),
          end_date: dateFormate(this.edit.end)
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
                  <h5 class="mt-0 mb-1 font-weight-bold">Welcome to Your Calendar</h5>
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
                        <button id="btn-new-event" class="btn btn-primary mt-2 mr-1">
                          Me
                          <i class="uil uil-angle-down font-size-16 align-middle"></i>
                        </button>
                      </template>
                      <b-dropdown-item
                        href="javascript: void(0);"
                        variant="seconday"
                      >Gideon Assafuah</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" variant="seconday">Mamphey Kwakye</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" variant="seconday">Edem Ahadzi</b-dropdown-item>
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
    <b-modal v-model="showmodal" title="Add New Event" title-class="text-black font-18" hide-footer>
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
                    type="date"
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
                    type="date"
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
          <b-button class="ml-1" variant="light" @click="hideModal">Close</b-button>
        </div>
      </form>
    </b-modal>

    <!-- Edit Modal -->
    <b-modal v-model="eventModal" title="Edit Event" title-class="text-black font-18" hide-footer>
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
                    type="date"
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
                    type="date"
                    class="form-control"
                    placeholder="Enter end date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <b-button type="button" variant="danger" @click="deleteEvent">Delete Event</b-button>
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </b-modal>
  </Layout>
</template>
