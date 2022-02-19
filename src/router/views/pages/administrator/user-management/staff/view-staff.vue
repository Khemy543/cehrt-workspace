<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'View Staff',
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
      title: 'View Staff',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'User Management',
          to: '/user-management/staff',
        },
        {
          text: 'View Staff',
          to: '/',
          active: true,
        },
      ],
      staff: {},
      loading: false,
    }
  },
  computed: {
    fullname() {
      return `${this.staff.firstname} ${this.staff.lastname}`
    },
  },
  created() {
    this.fetchSingleStaff()
  },
  methods: {
    async fetchSingleStaff() {
      this.loading = true
      try {
        const response = await this.$http.get(`/admin/fetch/${this.id}/staff`)

        if (response && response.data) {
          this.staff = response.data
          const { firstname, lastname } = response.data
          this.items[2].text = `${firstname} ${lastname}`
          this.title = `${firstname} ${lastname}`
          this.loading = false
        }
      } catch (error) {}
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mt-0 mb-1">{{ fullname }}</h4>
            <div class="row">
              <div class="col-md-6">
                <div>
                  <p class="sub-header">
                    Work Information
                  </p>
                  <div>
                    <div class="sub-header">
                      Staff Identification Number
                      <span>{{ staff.staff_id }}</span>
                    </div>
                    <h5>
                      {{ staff.title }} {{ staff.firstname }}
                      {{ staff.lastname }} {{ staff.other_names }}
                    </h5>
                    <div>
                      {{ staff.work_location }}
                    </div>
                    <div>
                      {{ staff.work_phone }}
                    </div>
                    <div class="sub-header">
                      <br />
                      <br />
                      Departments
                      <div v-for="depart in staff.department" :key="depart.id">
                        <div
                          class="badge badge-soft-primary font-size-13 font-weight-normal ml-1"
                          >{{ depart.name }}</div
                        >
                      </div>
                    </div>
                  </div>
                  <div> </div>
                </div>
              </div>

              <div class="col-md-6">
                <p class="sub-header">
                  Personal Information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped>
.sub-header span {
  font-size: medium;
  font-weight: 800;
}
</style>
