<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>View Leave Report</h4>
                  <p>View staff and leaves taken</p>
                </div>
                <div></div>
              </div>
              <table class="table">
                <thead class="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Staff</th>
                    <th>Total Leave Taken</th>
                    <th>Annual Leave</th>
                    <th>Sick Leave</th>
                    <th>Maternity Leave</th>
                    <th>Compassionate Leave</th>
                    <th>Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(leave, index) in leaveData" :key="leave.id">
                    <th>{{ index + 1 }}</th>
                    <td>{{ leave.name }}</td>
                    <td>{{ getTotalLeave(leave.leave_requests) }}</td>
                    <td>{{ leaveCount(leave.leave_requests, 'Annual') }}</td>
                    <td>{{ leaveCount(leave.leave_requests, 'Sick') }}</td>
                    <td>{{ leaveCount(leave.leave_requests, 'Maternity') }}</td>
                    <td>{{ leaveCount(leave.leave_requests, 'Compassionate') }}</td>
                    <td>{{ leaveCount(leave.leave_requests, 'Others') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>
import PageHeader from '@components/page-header'
import Layout from '@layouts/main.vue'
import { getDifferenceInBusinessDays } from '@/src/utils/format-date';
export default {
  components: {
    PageHeader,
    Layout,
  },
  data() {
    return {
      title: 'Leave Report',
      items: [
        {
          text: 'Chert',
          href: '/',
        },
        {
          text: 'Leave Report',
          active: true,
        },
      ],
      leaveData: [],
      loading: false
    }
  },
  created() {
    this.getLeaveData()
  },
  methods: {
    async getLeaveData() {
      try {
        this.loading = true;
        const response = await this.$http.get(
          '/admin/fetch/leave/request/stats'
        )

        if (response) {
          this.loading = false;
          this.leaveData = response.data
        }
      } catch (error) {}
    },
    leaveCount(leaves, type) {
      if(Array.isArray(leaves)) {
        const allLeave =  leaves.filter((leave) => leave.type === type);
        
        let totalDays = 0;

        for (const leave of allLeave) {
          
          const newEndDate = leave.end_date || leave.start_date

          totalDays = totalDays + getDifferenceInBusinessDays(newEndDate, leave.start_date) + 1
        }

        return totalDays;

      }
      return 0;
    },

    getTotalLeave(leaves) {
      if(Array.isArray(leaves)) {
        let totalDays = 0;

        for (const leave of leaves) {
          
          const newEndDate = leave.end_date || leave.start_date

          totalDays = totalDays + getDifferenceInBusinessDays(newEndDate, leave.start_date) + 1
        }

        return totalDays;
      }
    }
  },
}
</script>
