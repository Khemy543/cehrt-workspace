<template>
  <div>
    <Layout>
      <PageHeader :title="title" :items="items" />
      <div v-if="loading" class="d-flex justify-content-center">
        <b-spinner type="grow" variant="primary"></b-spinner>
      </div>
      <div v-else class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-xl-12 col-lg-12">
                  <div class="mt-4 mt-lg-0">
                    <h5 class="mt-0 mb-1 font-weight-bold">
                      {{
                        proposal.title
                      }}
                    </h5>

                    <div class="d-flex items-align-center mt-4">
                      <div>
                        <div class="badge badge-soft-primary font-size-13 font-weight-normal">
                          {{
                            proposal.project_type && proposal.project_type.name
                          }}
                        </div>
                      </div>
                      <div>
                        <div
                          class="badge badge-soft-success font-size-13 font-weight-normal ml-5"
                        >{{ proposal.funding_option }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-user text-danger"></i> Client
                          </p>
                          <h5 class="font-size-16">{{ proposal.client }}</h5>
                        </div>
                      </div>

                      <!-- <div class="col-md-3">
                        <div class="mt-4">
                          <p class="mb-2">
                            <i class="uil-calendar-slash text-danger"></i>
                            Submission Date
                          </p>
                          <h5 class="font-size-16">{{
                            proposal.submission_date || 'N/A'
                          }}</h5>
                        </div>
                      </div>-->
                      <div class="col-md-3"></div>

                      <div class="col-md-3">
                        <b-dropdown
                          class="d-inline"
                          variant="link"
                          toggle-class="font-weight-bold p-0 align-middle"
                        >
                          <template v-slot:button-content>
                            <button id="btn-new-event" class="btn btn-primary mt-4 mr-3">
                              <i class="uil-plus-circle"></i> Create New Report
                            </button>
                          </template>
                          <b-dropdown-item
                            v-for="report in reportTypes"
                            :key="report.id"
                            href="javascript: void(0);"
                            variant="seconday"
                          >{{ report.name }}</b-dropdown-item>
                        </b-dropdown>
                      </div>

                      <div class="col-md-3">
                        <button class="btn btn-white mt-4">
                          <i class="uil-sync"></i> Create Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
          <!-- end card -->
        </div>

        <div class="col-12 mt-2">
          <h5>Proposal Reports</h5>
          <div class="row mt-4">
            <router-link v-for="n in reportTypes" :key="n.id" :to="`/proposal/${proposal.id}/deliverable/${n.id}`" class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <div class="p-2 border rounded mb-3">
                    <div class="media">
                      <div class="avatar-sm font-weight-bold mr-3">
                        <span class="avatar-title rounded bg-soft-primary text-primary">
                          <i class="uil-file-plus-alt font-size-18"></i>
                        </span>
                      </div>
                      <div class="media-body">
                        <div  class="d-inline-block mt-2">{{ n.name }}.docx</div>
                      </div>
                      <!-- <div class="float-right mt-1">
                        <div class="p-2">
                          <i class="uil-download-alt font-size-18"></i>
                        </div>
                      </div> -->
                    </div>
                  </div>
                  <div>
                    <ul class="list-inline">
                      <li class="list-inline-item pr-1">
                        <a
                          :id="`date-tooltip-${proposal.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`date-tooltip-${proposal.id}`"
                            triggers="hover"
                            placement="top"
                          >Due date</b-tooltip>
                          <i class="uil uil-calender mr-1"></i>
                          {{ proposal.end_date }}
                        </a>
                      </li>
                      <li class="list-inline-item pr-1">
                        <a
                          :id="`task-tooltip-${proposal.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`task-tooltip-${proposal.id}`"
                            triggers="hover"
                            placement="top"
                          >Tasks</b-tooltip>
                          <i class="uil uil-bars mr-1"></i>
                          {{ proposal.tasks || 0 }}
                        </a>
                      </li>
                      <li class="list-inline-item">
                        <a
                          :id="`comment-tooltip-${proposal.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`comment-tooltip-${proposal.id}`"
                            triggers="hover"
                            placement="top"
                          >Comments</b-tooltip>
                          <i class="uil uil-comments-alt mr-1"></i>
                          {{ proposal.comments || 0 }}
                        </a>
                      </li>
                      <li class="list-inline-item pr-2">
                        <a
                          :id="`date-tooltip-${proposal.id}`"
                          href="javascript: void(0)"
                          class="text-muted d-inline-block bg-transparent"
                        >
                          <b-tooltip
                            :target="`date-tooltip-${proposal.progress}`"
                            triggers="hover"
                            placement="top"
                          ></b-tooltip>
                          <i class="uil uil-check-square mr-1"></i>
                          {{ proposal.progress || 0 }}%
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- <div
          v-if="
            !loading &&
              !proposal.expression_of_interest &&
              !proposal.financial_document_path &&
              !proposal.technical_proposal
          "
          class=" w-100 d-flex justify-content-center"
        >
          <img
            :src="require('@assets/svgs/empty.svg')"
            alt="no projects"
            style="width:30%"
          />
        </div>-->
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
      reportTypes: [
        {
          id: 1,
          name: 'Expression of interest Report',
        },
        {
          id: 2,
          name: 'Technical Report',
        },
        {
          id: 3,
          name: 'Financial Report',
        },
        {
          id: 4,
          name: 'Techical & Financial Report',
        },
      ],
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
