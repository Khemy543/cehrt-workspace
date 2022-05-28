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
              <div
                  class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="page-title" style="padding:0">
                  <div class="mt-4 mt-lg-0">
                    <h5 class="mt-0 mb-1 font-weight-bold">
                      Project Plans
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
export default {
  page: {
    title: 'Manage Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      title: 'Project Plans',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Project Plans',
          active: true,
        },
      ],
      loading: false,
      projectPlans: []
    }
  }
}
</script>

<style scoped>

</style>