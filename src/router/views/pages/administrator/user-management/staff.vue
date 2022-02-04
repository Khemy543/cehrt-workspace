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
    PageHeader
  },
  data() {
    return {
      title: 'View Staff',
      items: [
        {
          text: 'Cehrt',
          href: '/',
        },
        {
          text: 'User Management',
          href: '/user-management/staff',
        },
        {
          text: 'View Staff',
          href: "/",
          active:true
        }
      ],
      staff : [],
      loading:false
    }
  },
  created(){
      this.fetchStaff()
  },
  methods: {
      async fetchStaff() {
      this.loading = true
      try {
        const response = await this.$http.get('/admin/fetch/staff');

        if(response && response.data) {
          this.staff = response.data
        }
      } catch (error) {
        
      }finally{
          this.loading = false
      }
    },
  }
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
            <h4 class="header-title mt-0 mb-1">View Staff</h4>
            <p class="sub-header">
                View all staff members
            </p>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in staff" :key="user.id">
                    <th scope="row">{{ user.staff_id }}</th>
                    <td>{{ user.firstname }} {{ user.lastname }} {{ user.other_names }}</td>
                    <td>{{ user.email}}</td>
                    <td>{{ user.phone_number }}</td>
                    <td>
                        <router-link to="/">
                            <feather type="eye" />
                        </router-link>
                    </td>
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
