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
            <div class=" d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">Exchange Rate</h4>
                <p class="sub-header">
                  view, add and edit details of all exchange rates
                </p>
              </div>
              <div>
                <button
                    type="button"
                    class="btn btn-danger mr-4 mb-3 mb-sm-0"
                    @click="openCreateExchageRate"
                >
                  <i class="uil-plus mr-1"></i> Create Exchange Rate
                </button>
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
    title: 'Exchange Rate',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      loading: false,
      show: false,
      formTitle: "",

      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Exchange Rate',
          to: '',
          active: true,
        },
      ],
    }
  },
  methods: {
    openCreateExchageRate() {
      this.workflow = null;
      this.formTitle = "Create Work Flow"
      this.show = true
    },
  }
}
</script>

<style scoped>

</style>