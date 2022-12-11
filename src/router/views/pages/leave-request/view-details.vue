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
        // themeSystem: 'bootstrap',
      },
      
      // themeSystem: 'bootstrap',
      event: {},
    }
  },
  computed: {
    isAdmin() {
      return this.$route.query.isadmin === 'true'
    },
    disabled() {
      if(this.isAdmin && !this.event.supervisor) {
        return false
      }
      if(this.isAdmin && this.event.supervisor && this.event.status !== 'approved') {
        return true;
      }
      return false
    }
  },
  created() {
    this.getLeaveRequest()
  },
  methods: {
    formateEndDate(date) {
      var newdate = new Date(date)
      newdate.setDate(newdate.getDate() + 1)
      return newdate
    },
    async getLeaveRequest() {
      try {
        const response = await this.$http.get(
          `/fetch/${this.$route.params.id}/leave/request`
        )

        if (response) {
          const item = response.data
          this.event = item
          // this.$refs['fullCalendar'].fullCalendar('gotoDate', item.start_date)
          const event = {
            id: item.id,
            title: `${item.user} (${item.type} Leave)`,
            editable: true,
            start: dateFormate(item.start_date),
            end: this.formateEndDate(item.end_date),
            reason: item.reason,
            className:
              item.type === 'Sick'
                ? `bg-soft-danger text-danger`
                : item.type === 'Annual'
                ? 'bg-soft-primary text-primary'
                : item.type === 'Maternity'
                ? 'bg-soft-success text-success'
                : item.type === 'Compassionate'
                ? 'bg-soft-warning text-warning'
                : 'bg-soft-secondary text-secondary',
          }
          this.calendarOptions.events = [...this.calendarOptions.events, ...[event]]
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

    approveLeave() {
      this.$swal({
        title: 'Approve leave request?',
        showDenyButton: true,
        confirmButtonText: 'Approve',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const url = this.isAdmin
              ? `/admin/update/leave/${this.$route.params.id}/request`
              : `/approve/${this.$route.params.id}/leave/request`
            const response = await this.$http.patch(url, {
                admin_approval_status: 'approved',
            })

            if (response) {
              this.$bvToast.toast('Leave approved successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
              this.$router.push('/requested-leave')
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

    rejectLeave() {
      this.$swal({
        title: 'Reject leave request?',
        showDenyButton: true,
        confirmButtonText: 'Reject',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const url = this.isAdmin
              ? `/admin/update/leave/${this.$route.params.id}/request`
              : `/reject/${this.$route.params.id}/leave/request`
            const response = await this.$http.patch(url, {
                admin_approval_status: 'rejected',
            })

            if (response) {
              this.$bvToast.toast('Leave rejected successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
              this.$router.push('/requested-leave')
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
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <FullCalendar
                ref="fullCalendar"
                :options="calendarOptions"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-user text-primary"></i> Staff Name
                  </p>
                  <h5 class="font-size-16">{{ event.user || 'N/A' }}</h5>
                </div>
              </div>
              <div class="col-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-calender text-primary"></i> Start Date
                  </p>
                  <h5 class="font-size-16">{{ event.start_date }}</h5>
                </div>
              </div>
              <div class="col-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-calendar-slash text-primary"></i> End Date
                  </p>
                  <h5 class="font-size-16">{{ event.end_date  || event.start_date}}</h5>
                </div>
              </div>

              <div class="col-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-user text-primary"></i> Leave Type
                  </p>
                  <div
                    class="badge"
                    :class="{
                      'badge-soft-warning': `${event.type}` === 'Compassionate',
                      'badge-soft-success': `${event.type}` === 'Maternity',
                      'badge-soft-danger': `${event.type}` === 'Sick',
                      'badge-soft-secondary': `${event.type}` === 'Others',
                      'badge-soft-primary': `${event.type}` === 'Annual',
                    }"
                    >{{ event.type }}</div
                  >
                </div>
              </div>

              <div v-if="isAdmin" class="col-6">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-user text-primary"></i> Supervisor
                  </p>
                  <div>
                    {{ (event.supervisor && event.supervisor.name) || 'N/A' }}
                    <label
                      class="badge mx-1"
                      :class="{
                        'badge-soft-warning': `${event.status}` === 'pending',
                        'badge-soft-success': `${event.status}` === 'approved',
                        'badge-soft-danger': `${event.status}` === 'rejected',
                      }"
                      >{{ event.status }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="mt-4">
                  <p class="mb-2">
                    <i class="uil-book-open text-primary"></i> Reason
                  </p>
                  <div>{{ event.reason }}</div>
                </div>
              </div>
            </div>

            <div class="row mt-5">
              <div class="col-6">
                <button
                  class="btn btn-primary w-100"
                  :disabled="disabled"
                  @click="approveLeave"
                  >Approve</button
                >
              </div>
              <div class="col-6">
                <button
                  class="btn btn-danger w-100"
                  :disabled="disabled"
                  @click="rejectLeave"
                  >Reject</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
