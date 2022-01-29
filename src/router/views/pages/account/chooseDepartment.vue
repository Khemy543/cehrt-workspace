<script>
import Layout from '@layouts/default'
import appConfig from '@src/app.config'
import DepartmentCard from '@components/department-card.vue'
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
    }
  },
  computed: {},
  methods: {
      selecteDepartment(id) {
      const { redirectFrom } = this.$route.query;
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
            <div class="text-center w-75 m-auto">
              <a href="/"> </a>
            </div>

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
                v-for="stat of statData"
                :key="stat.title"
                class="col-md-6 col-xl-3"
              >
                <DepartmentCard
                  :title="stat.title"
                  :value="stat.value"
                  :icon="stat.icon"
                  :color="stat.color"
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
