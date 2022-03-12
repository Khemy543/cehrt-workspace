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
      staff: [],
      loading: false,
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    async fetchStaff() {
      this.loading = true
      try {
        const response = await this.$http.get('/admin/fetch/staff')

        if (response && response.data) {
          this.staff = response.data
          this.loading = false
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
    activateAccount(user) {
      this.$swal({
        title: 'Activate user account?',
        showDenyButton: true,
        confirmButtonText: 'Activate',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(
              `/admin/unblock/${user.id}/account`
            )

            if (response) {
              const index = this.staff.findIndex((item) => item.id === user.id)
              this.staff[index] = { ...user, is_active: 1 }
              this.$bvToast.toast('User account activated', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
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

    deactivateAccount(user) {
      this.$swal({
        title: 'Deactive user account?',
        showDenyButton: true,
        confirmButtonText: 'Deactive',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(
              `/admin/block/${user.id}/account`
            )

            if (response) {
              const index = this.staff.findIndex((item) => item.id === user.id)
              this.staff[index] = { ...user, is_active: 0 }
              this.$bvToast.toast('User account deactivated', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
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
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="card" style="overflow-x: auto">
          <div class="card-body">
            <div class=" d-flex justify-content-between">
            <div>
              <h4 class="header-title mt-0 mb-1">View Staff</h4>
              <p class="sub-header">
                View all staff members
              </p> </div
            ><div>
              <router-link
                to="/user-management/add-staff"
                type="button"
                class="btn btn-danger mr-4 mb-3 mb-sm-0"
              >
                <i class="uil-plus mr-1"></i> Add Staff
              </router-link>
            </div>
            </div>

            <div class="">
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
                    <td>
                      <i
                        v-if="user.is_active === 0"
                        class="uil uil-lock mr-2"
                      ></i>
                      <i v-else class="uil uil-unlock-alt mr-2"></i>
                      {{ user.firstname }} {{ user.lastname }}
                      {{ user.other_names }}</td
                    >
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone_number }}</td>
                    <td>
                      <b-dropdown
                        variant="link"
                        class=" position-absolute"
                        toggle-class="p-0 text-muted arrow-none"
                      >
                        <template v-slot:button-content>
                          <i class="uil uil-ellipsis-v font-size-14"></i>
                        </template>
                        <b-dropdown-item
                          :to="`/user-management/staff/${user.id}/view-staff`"
                          variant="secondary"
                          ><i class="uil uil-exit mr-2"></i
                          >View</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                          v-if="user.is_active === 0"
                          href="javascript: void(0);"
                          variant="success"
                          @click="activateAccount(user)"
                        >
                          <i class="uil uil-unlock-alt mr-2"></i>Active
                        </b-dropdown-item>
                        <b-dropdown-item
                          v-else
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deactivateAccount(user)"
                        >
                          <i class="uil uil-lock mr-2"></i>Deactive
                        </b-dropdown-item>
                      </b-dropdown>
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
