<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'
import { required } from 'vuelidate/lib/validators'
import { dateFormate } from '@src/utils/format-date.js'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Leave Request',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { FullCalendar, Layout, PageHeader },
  data() {
    return {
      title: 'Leave Request',
      items: [
        {
          text: 'Chert',
          href: '/',
        },
        {
          text: 'Leave Request',
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
      categories: [
        {
          id: 1,
          type: 'Annual',
        },
        {
          id: 2,
          type: 'Sick',
        },
        {
          id: 3,
          type: 'Maternity',
        },
        {
          id: 4,
          type: 'Compassionate',
        },
        {
          id: 5,
          type: 'Others',
        },
      ],
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {
        type: '',
        start_date: '',
        end_date: '',
        reason: '',
      },
      editevent: {
        editTitle: '',
      },
    }
  },
  validations: {
    event: {
      title: { required },
      category: { required },
    },
  },
  created() {
    this.getAllProved();
    this.getLeaveRequests();
  },
  methods: {
    async getLeaveRequests() {
      try {
        const response = await this.$http.get(`/fetch/leave/requests`);

        if (response) {
          const requestedLeaves = response.data.map((item) => {
            return {
              id: item.id,
              title: `${item.user} (${item.type} Leave)`,
              editable: true,
              start: dateFormate(item.start_date),
              end: dateFormate(item.end_date),
              reason: item.reason,
              className: item.type === 'Sick' ? `bg-soft-danger text-white` : item.type === 'Annual' ? 'bg-soft-primary text-white' : item.type === 'Maternity' ? 'bg-soft-success text-white' : item.type === 'Compassionate' ? 'bg-soft-warning text-white' : 'bg-soft-secondary text-white'
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

    async getAllProved() {
      try {
        const response = await this.$http.get(`/fetch/all/approved/leave/requests`);

        if (response) {
          const approvedLeaves = response.data.map((item) => {
            return {
              id: item.id,
              title: `${item.user} (${item.type})`,
              start: dateFormate(item.start_date),
              end: dateFormate(item.end_date),
              reason: item.reason,
              className: item.type === 'Sick' ? `bg-danger text-white` : item.type === 'Annual' ? 'bg-primary text-white' : item.type === 'Maternity' ? 'bg-success text-white' : item.type === 'Compassionate' ? 'bg-warning text-white' : 'bg-secondary text-white'
            }
          })

          this.calendarEvents = [...this.calendarEvents, ...approvedLeaves]
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
    async handleSubmit() {
      try {
        const response = await this.$http.post(`/request/for-leave`, { ...this.event, type: this.event.type })
        if (response) {
          const {
            id,
            type,
            user,
            start_date: startDate,
            end_date: endDate,
            reason
          } = response.data.leave
          this.calendarEvents = this.calendarEvents.concat(
            {
              id,
              title: `${user} (${type})`,
              start: dateFormate(startDate),
              end: dateFormate(endDate),
              reason,
              className: type === 'Sick' ? `bg-soft-danger text-white` : type === 'Annual' ? 'bg-soft-primary text-white' : type === 'Maternity' ? 'bg-soft-success text-white' : type === 'Compassionate' ? 'bg-soft-warning text-white' : 'bg-soft-secondary text-white'
            }
          )
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
        const response = await this.$http.put(`/update/${this.editevent.id}/leave/request`, this.editevent);

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
        title: 'Do you want to delete leave request?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const deleteId = this.edit.id
            const response = await this.$http.delete(`/delete/${deleteId}/leave/request`);

            if (response) {
              this.calendarEvents = this.calendarEvents.filter(
                (x) => '' + x.id !== '' + this.edit.id
              )
              this.eventModal = false;
              this.$bvToast.toast('Request deleted successfully', {
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
        const index = this.calendarEvents.findIndex(item => item.id === Number(this.edit.id))
        this.editevent = {
          type: this.edit.title.split('(')[1].split(' ')[0],
          start_date: dateFormate(this.edit.start),
          end_date: dateFormate(this.edit.end),
          reason: this.calendarEvents[index].reason
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
                  <p class="text-muted mb-2">
                    Click on event to see or edit the details. You can create
                    new event by clicking on "Create New event" button or any
                    cell available in calendar below.
                  </p>

                  <button
                    id="btn-new-event"
                    class="btn btn-primary mt-2 mr-1"
                    @click="showmodal = true"
                  >
                    <i class="uil-plus-circle"></i> Create Leave Request
                  </button>
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
                :editable="true"
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
              <b-form-group id="marital_status" label="Leave Type" label-for="marital_status">
                <b-form-select id="marital_status" v-model="event.type" type="text" required>
                  <option value>Select leave type</option>
                  <option
                    v-for="type in categories"
                    :key="type.id"
                    :value="type.type"
                  >{{ type.type }}</option>
                </b-form-select>
              </b-form-group>
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
          <div class="col-12">
            <b-form-group label="Reason">
              <b-form-textarea
                id="input-1"
                v-model="event.reason"
                placeholder="Enter reason for leave request"
                rows="4"
              ></b-form-textarea>
            </b-form-group>
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
      <form @submit.prevent="editEvent">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <b-form-group id="marital_status" label="Leave Type" label-for="marital_status">
                <b-form-select id="marital_status" v-model="editevent.type" type="text" required>
                  <option value>Select leave type</option>
                  <option
                    v-for="type in categories"
                    :key="type.id"
                    :value="type.type"
                  >{{ type.type }}</option>
                </b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="col-12">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">Start Date</label>
                  <input
                    id="name"
                    v-model="editevent.start_date"
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
                    v-model="editevent.end_date"
                    type="date"
                    class="form-control"
                    placeholder="Enter end date"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <b-form-group label="Reason">
              <b-form-textarea
                id="input-1"
                v-model="editevent.reason"
                placeholder="Enter reason for leave request"
                rows="4"
              ></b-form-textarea>
            </b-form-group>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <b-button type="button" variant="danger" @click="deleteEvent">Delete Request</b-button>
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </b-modal>
  </Layout>
</template>
