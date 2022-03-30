<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Trainings',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Trainings',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Trainings',
          to: '',
          active: true,
        },
      ]
    }
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
        <div>
            <h1 class="text-center">Coming Soon !</h1>
        </div>
      </div>
    </div>
  </Layout>
</template>
