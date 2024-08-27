<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <!-- <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" size="sm" variant="primary"></b-spinner>
    </div> -->
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <b-tabs pills class="navtab-bg">
              <b-tab title="Projects" active>
                <div class="row page-title align-items-center">
                  <div class="col-md-3 col-xl-6"> </div>
                </div>

                <div ref="projectRef" class="row">
                  <OtherProjectCard
                    v-for="project in projectData"
                    :key="project.id"
                    :project="project"
                  />
                </div>

                <div v-if="loading" class=" d-flex justify-content-center">
                  <b-spinner
                    type="grow"
                    size="sm"
                    variant="primary"
                  ></b-spinner>
                </div>

                <div
                  v-if="!loading && projectData.length <= 0"
                  class=" w-100 d-flex justify-content-center"
                >
                  <img
                    :src="require('@assets/svgs/empty.svg')"
                    alt="no projects"
                    style="width:30%"
                  />
                </div>
              </b-tab>
              <b-tab title="Project Deletion Request">
                <div class=" card">
                  <div class="card-body">
                    <div
                      v-if="!loading && requests.length > 0"
                      class="table-responsive"
                    >
                      <table class="table mb-0">
                        <thead class="thead-light">
                          <tr>
                            <th scope="col">Project Name</th>
                            <th scope="col">Coordinator</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Requested Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="request in requests" :key="request.id">
                            <td>{{ request.project_name }}</td>
                            <td>{{
                              (request.coordinator &&
                                request.coordinator.name) ||
                                'N/A'
                            }}</td>
                            <td>{{ request.reason }}</td>
                            <td>{{ request.created_at }}</td>
                            <td>{{ request.status }}</td>
                            <td>
                              <b-dropdown
                                variant="link"
                                class=" position-absolute"
                                toggle-class="p-0 text-muted arrow-none"
                              >
                                <template v-slot:button-content>
                                  <i
                                    class="uil uil-ellipsis-v font-size-14"
                                  ></i>
                                </template>
                                <b-dropdown-item
                                  href="javascript: void(0);"
                                  variant="success"
                                  @click="acceptRequest(request)"
                                >
                                  Accept
                                </b-dropdown-item>
                                <b-dropdown-item
                                  href="javascript: void(0);"
                                  variant="danger"
                                  @click="showRejectModal(request)"
                                >
                                  Reject
                                </b-dropdown-item>
                              </b-dropdown>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      v-if="!loading && requests.length <= 0"
                      class=" w-100 d-flex justify-content-center"
                    >
                      <img
                        :src="require('@assets/svgs/empty.svg')"
                        alt="no projects"
                        style="width:30%"
                      />
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
    <RejectProjectDeletionModal
      :value="show"
      :request="selectedRequest"
      @deleteRequest="deleteRequest"
    />
  </Layout>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import RejectProjectDeletionModal from '@components/RejectProjectDeletionModal.vue'
import OtherProjectCard from '@/src/components/OtherProjectCard.vue'
export default {
  page: {
    title: 'Manage Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    RejectProjectDeletionModal,
    OtherProjectCard,
  },
  data() {
    return {
      title: 'Manage Projects',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Manage Projects',
          active: true,
        },
      ],
      loading: false,
      requests: [],
      selectedRequest: null,
      show: false,
      projectData: [],
      links: {},
    }
  },
  created() {
    this.getDeletionRequest()
    this.getProjects()
    document.addEventListener('scroll', this.checkIsVisible)
  },
  methods: {
    async getDeletionRequest() {
      try {
        const response = await this.$http.get(
          `/admin/project/deletion/requests`
        )

        if (response) {
          this.requests = response.data
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
    async getProjects(link) {
      try {
        this.loading = true
        const response = await this.$http.get(link || '/fetch/projects')

        if (response) {
          const { data, links } = response.data
          this.projectData = [...this.projectData, ...data]
          this.links = links
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
    checkIsVisible() {
      const rect = this.$refs['projectRef'].getBoundingClientRect()
      if (rect.bottom <= window.innerHeight) {
        if (this.links.next && !this.loading) {
          this.getProjects(this.links.next)
        }
      }
    },
    showRejectModal(request) {
      this.selectedRequest = request
      this.show = true
    },

    acceptRequest(request) {
      this.$swal({
        title: 'Approve project deletion?',
        showDenyButton: true,
        confirmButtonText: 'Approve',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(
              `/admin/update/project/${request.id}/deletion-request`,
              {
                status: 'approved',
              }
            )

            if (response) {
              this.deleteRequest(request)
              this.$bvToast.toast('Request accepted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },

    deleteRequest(request) {
      this.show = false
      this.requests = this.requests.filter((item) => item.id !== request.id)
    },
  },
}
</script>

<style scoped></style>
