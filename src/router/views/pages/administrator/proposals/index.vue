<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Proposals',
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
      title: 'Proposals',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Proposals',
          to: '',
          active: true,
        },
      ],
      proposals: [],
      loading: false,
    }
  },
  created() {
    this.fetchProposals()
  },
  methods: {
    async fetchProposals() {
      this.loading = true
      try {
        const response = await this.$http.get(`/fetch/proposals`)

        if (response && response.data) {
          this.proposals = response.data
          this.loading = false
        }
      } catch (error) { 
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }
    },
  }
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">View Proposals</h4>
                <p class="sub-header">view, add and upload proposal files</p>
              </div>
              <div>
                
              </div>
            </div>

            <div v-if="proposals.length > 0" class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Proposal</th>
                    <th scope="col">Client</th>
                    <th scope="col">Project Type</th>
                    <th scope="col">Funding Option</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(vproposal, index) in proposals"
                    :key="vproposal.id"
                    :title="vproposal.description"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ vproposal.title }}</td>
                    <td>{{ vproposal.client }}</td>
                    <td>
                      {{
                        vproposal.project_type && vproposal.project_type.name
                      }}
                    </td>
                    <td>{{ vproposal.funding_option }}</td>
                    <td>
                      <b-dropdown
                        variant="link"
                        class="position-absolute"
                        toggle-class="p-0 text-muted arrow-none"
                      >
                        <template v-slot:button-content>
                          <i class="uil uil-ellipsis-v font-size-14"></i>
                        </template>
                        <b-dropdown-item
                          :to="`/admin/proposals/${vproposal.id}/details`"
                          variant="secondary"
                        >
                          <i class="uil uil-exit mr-2"></i>View
                        </b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="w-100 d-flex justify-content-center">
              <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width:30%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
