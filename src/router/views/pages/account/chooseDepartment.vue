<script>
import Layout from '@layouts/default'
import appConfig from '@src/app.config'
import { authMethods } from '@state/helpers'
import DepartmentCard from '@components/department-card.vue'
import admin from '@assets/images/department/admin.jpeg'
import consulting from '@assets/images/department/consulting.jpeg'
import finance from '@assets/images/department/finance.jpeg'

export default {
  page: {
    title: 'Department',
    meta: [
      { name: 'description', content: `Confirm account to ${appConfig.title}` },
    ],
  },
  components: { Layout, DepartmentCard },
  data() {
    return {
      statData: [
        {
          title: 'Administrator',
          value: 2100,
          icon: 'lock',
          color: 'primary',
        },
        {
          title: 'Finance',
          value: 1065,
          icon: 'briefcase',
          color: 'danger',
        },
        {
          title: 'Consulting',
          value: 11,
          icon: 'users',
          color: 'success',
        }
      ],
      departments : this.$store.state.auth.currentUser ? this.$store.state.auth.currentUser.departments : [] || []
    }
  },
  computed: {
    vDepartments(){
      return this.departments.map((department) => {
        return {
          ...department,
          value: 12,
          icon: department.id === 4? admin : department.id === 24 ? consulting : finance,
          color: 'success'
        }
      })
    }
  },
  methods: {
    ...authMethods,

      selecteDepartment(department) {
      const { redirectFrom } = this.$route.query;
      this.setDepartment(department);
      this.$router.push( redirectFrom || { name:'Dashboard' })
      }
  },
}
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="bg-pattern">
          <div class="p-4">

            <div class="mt-3 text-center">
              <h3>Choose your department</h3> 
              <p class="text-muted mt-2">
                Please select a department to continue.
              </p>

              <!-- <router-link
                tag="a"
                to="/login"
                class="btn btn-block btn-primary waves-effect waves-light mt-3"
                >Back to Home</router-link
              > -->
            </div>

            <div class="row">
              <div
                v-for="department of vDepartments"
                :key="department.id"
                class="col-md-6 col-xl-3"
              >
                <DepartmentCard
                  :department="department"
                  @select-department="selecteDepartment"
                />
              </div>
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>

<style lang="scss" module></style>
