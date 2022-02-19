<template>
  <div>
    <Layout>
      <PageHeader :title="title" :items="items" />
      <div v-if="loading" class=" d-flex justify-content-center">
        <b-spinner type="grow" variant="primary"></b-spinner>
      </div>
      <div v-else class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-xl-10 col-lg-9">
                  <div class="mt-4 mt-lg-0">
                    <h5 class="mt-0 mb-1 font-weight-bold">{{
                      proposal.title
                    }}</h5>
                    <div class="row">
                      <div class="col-md-3">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Client
                          </p>
                          <h5 class="font-size-16">{{ proposal.client }}</h5>
                        </div>
                      </div>

                      <div class="col-md-3">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-calendar-slash text-danger"></i>
                            Submission Date
                          </p>
                          <h5 class="font-size-16">{{
                            proposal.submission_date
                          }}</h5>
                        </div>
                      </div>

                      <div class="col-md-3">
                        <button
                          id="btn-new-event"
                          class="btn btn-primary mt-4 mr-3"
                          @click="showmodal = true"
                        >
                          <i class="uil-plus-circle"></i> Create New Report
                        </button>
                      </div>

                      <div class="col-md-3">
                        <button class="btn btn-white mt-4">
                          <i class="uil-sync"></i> Create Project
                        </button>
                      </div>
                    </div>

                    <div
                      class="badge badge-soft-primary font-size-13 font-weight-normal mt-2"
                      >{{
                        proposal.project_type && proposal.project_type.name
                      }}</div
                    >

                    <div
                      class="badge badge-soft-success font-size-13 font-weight-normal ml-5"
                      >{{ proposal.funding_option }}</div
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
          <!-- end card -->
        </div>

        <div
          v-if="!loading && !proposal.expression_of_interest && !proposal.financial_document_path && !proposal.technical_proposal"
          class=" w-100 d-flex justify-content-center"
        >
          <img
            :src="require('@assets/svgs/empty.svg')"
            alt="no projects"
            style="width:30%"
          />
        </div>
        <!-- end col-12 -->
      </div>
    </Layout>
  </div>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
export default {
  page: {
    title: 'Proposal',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Proposal',
      items: [
        {
          text: 'Cehrt',
          href: '/',
        },
        {
          text: 'Proposals',
          href: '/proposal',
        },
        {
          text: 'Proposal',
          active: true,
        },
      ],
      proposal: {},
      loading: false,
    }
  },
  created() {
    this.getProposal()
  },
  methods: {
    async getProposal() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/${this.$route.params.id}/proposal`
        )

        if (response) {
          this.proposal = response.data
          this.items[2].text = response.data.title
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
  },
}
</script>

<style scoped></style>
