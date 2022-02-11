<template>
  <div>
    <Layout>
      <PageHeader :title="title" :items="items" />
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-xl-2 col-lg-3 col-6">
                  <img
                    src="@assets/images/cal.png"
                    class="mr-4 align-self-center img-fluid"
                    alt="cal"
                  />
                </div>
                <div class="col-xl-10 col-lg-9">
                  <div class="mt-4 mt-lg-0">
                    <h5 class="mt-0 mb-1 font-weight-bold"
                      >Welcome to Your Calendar</h5
                    >
                    <p class="text-muted mb-2">
                      The calendar shows the events synced from all your linked
                      calendars. Click on event to see or edit the details. You
                      can create new event by clicking on "Create New event"
                      button or any cell available in calendar below.
                    </p>

                    <button
                      id="btn-new-event"
                      class="btn btn-primary mt-2 mr-1"
                      @click="showmodal = true"
                    >
                      <i class="uil-plus-circle"></i> Create New Event
                    </button>
                    <button class="btn btn-white mt-2">
                      <i class="uil-sync"></i> Link Calendars
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- end card body-->
          </div>
          <!-- end card -->
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
    }
  },
  created(){},
  methods: {
      async getProposal(){
          try {
              this.loading = true;
              const response = await this.$http.get(``);

              if(response) {
                  
              }
          } catch (error) {
              
          }
      }
  }
}
</script>

<style scoped></style>
