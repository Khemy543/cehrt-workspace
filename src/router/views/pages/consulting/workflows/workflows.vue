<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Work Flows',
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
      title: 'Work Flows',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Work Flows',
          to: '',
          active: true,
        },
      ],
      workFlows: [],
      loading: false
    }
  },
  created() {
    this.fetchWorkFlows()
  },
  methods: {
    async fetchWorkFlows() {
      this.loading = true
      try {
        const response = await this.$http.get(`/fetch/workflows`)

        if (response && response.data) {
          this.workFlows = response.data.workflow || []
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
            <div class=" d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">Work Flows</h4>
                <p class="sub-header">
                  view, add and edit details of all work flows
                </p>
              </div>
              <div>
                <b-button variant="primary" @click="show = true"
                  >Add Work Flow</b-button
                >
              </div>
            </div>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(work, index) in workFlows"
                    :key="work.id"
                    :title="work.description"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ work.name }}</td>
                    <td>{{ work.description }}</td>
                    <td class=" d-flex">
                      <div class=" mr-4">
                        <feather
                          type="edit"
                          class="icon-dual-primary cursor-pointer"
                          @click="openModal(work.id)"
                        />
                      </div>
                      <div>
                        <feather
                          type="x-circle"
                          class="icon-dual-danger"
                          @click="deleteDepartment(work.id)"
                        />
                      </div>
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
