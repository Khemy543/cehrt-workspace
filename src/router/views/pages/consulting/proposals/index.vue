<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import CreateProposalModal from '@components/CreateProposalModal.vue'
import graph from '@/src/msalConfig/graph'

export default {
  page: {
    title: 'Proposals',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CreateProposalModal,
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
      vloading: false,
      show: false,
      formTitle: 'Create Proposal',
      proposal: null,
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

    openCreateProposal() {
      this.proposal = null
      this.formTitle = 'Create Proposal'
      this.show = true
    },

    async createProposal(form) {
      try {
        this.vloading = true
        const data = await graph.createProposalFolder({
          name: form.title,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'replace',
        })

        graph.copyRenumirationFileToProposal({
          parentReference: { id: data.id },
          name: 'World bank renumeration calculator.xlsx',
        })

        const { link } = await graph.getRenumerationFileLink(data.name)

        console.log(link)

        const response = await this.$http.post('/create/proposal', {
          ...form,
          onedrive_id: data.id,
          proposal_path: link.webUrl,
        })

        if (response) {
          this.proposals.unshift(response.data.proposal)
          this.show = false
          this.$bvToast.toast('Proposal created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        console.log(error)
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
      } finally {
        this.vloading = false
      }
    },

    async updateProposal(form) {
      try {
        const fakeForm = { ...form }
        delete fakeForm['submission_date']
        const response = await this.$http.put(
          `/update/${form.id}/proposal`,
          fakeForm
        )

        if (response) {
          await graph.updateProjectName({
            name: form.title,
            onedriveId: form.onedrive_id,
          })
          const index = this.proposals.findIndex((item) => item.id === form.id)
          this.proposals[index] = response.data.proposal
          this.show = false
          this.$bvToast.toast('Proposal updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        if (error.response) {
          let message = 'Something happened, Please try again later'
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }

          this.$bvToast.toast(message, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
      }
    },

    handleSubmit(form) {
      if (this.proposal) {
        return this.updateProposal(form)
      }
      return this.createProposal(form)
    },

    openModal(proposal) {
      this.proposal = proposal
      this.formTitle = 'Edit Proposal'
      this.show = true
    },

    async deleteProposal(vItem) {
      this.$swal({
        title: 'Do you want to delete this proposal?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/delete/${vItem.id}/proposal`
            )

            if (response) {
              await graph.deleteFolder({ onedriveId: vItem.onedrive_id })
              this.proposals = this.proposals.filter(
                (item) => item.id !== vItem.id
              )
              this.$bvToast.toast('Proposal deleted successfully', {
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
  },
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
        <div class="">
          <div class="">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">View Proposals</h4>
                <p class="sub-header"
                  >view, add and edit details of all proposals</p
                >
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="openCreateProposal"
                >
                  <i class="uil-plus mr-1"></i> New Proposal
                </button>
              </div>
            </div>

            <div v-if="proposals.length > 0">
              <div class="row">
                <div
                  v-for="vProposal in proposals"
                  :key="vProposal.id"
                  class="col-xl-4 col-lg-6"
                  style="height: 356px; margin-bottom: 20px;"
                >
                  <div class="card border h-100">
                    <div class="card-body">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <h5>
                          <a href="javascript: void(0)" class="text-dark">{{
                            vProposal.title
                          }}</a>
                        </h5>
                        <b-dropdown
                          variant="link"
                          toggle-class="p-0 text-muted arrow-none"
                          right
                        >
                          <template v-slot:button-content>
                            <i class="uil uil-ellipsis-v font-size-14"></i>
                          </template>
                          <b-dropdown-item
                            href="javascript: void(0);"
                            variant="secondary"
                            @click="openModal(vProposal)"
                          >
                            <i class="uil uil-edit mr-2"></i>Edit
                          </b-dropdown-item>
                          <b-dropdown-item
                            href="javascript: void(0);"
                            variant="danger"
                            @click="deleteProposal(vProposal)"
                          >
                            <i class="uil uil-trash-alt mr-2"></i>Delete
                          </b-dropdown-item>
                        </b-dropdown>
                      </div>
                      <router-link :to="`/proposals/details/${vProposal.id}`">
                        <div class="h-100">
                          <div class="d-flex my-3">
                            <i class="uil-user text-danger mr-1"></i>
                            <p
                              class="text-uppercase font-size-12 text-primary"
                              >{{ vProposal.client }}</p
                            >
                          </div>

                          <div
                            class="badge badge-soft-primary font-size-13 font-weight-normal mr-3"
                            >{{ vProposal.funding_option }}</div
                          >
                          <div
                            class="badge badge-soft-success font-size-13 font-weight-normal"
                            >{{ vProposal.project_type.name }}</div
                          >
                        </div>
                      </router-link>
                    </div>
                    <div
                      class="card-body position-absolute"
                      style="bottom: 0; left: 0; right: 0"
                    >
                      <div class="border-top py-2">
                        Click to view details
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="w-100 d-flex justify-content-center">
              <img
                :src="require('@assets/svgs/empty.svg')"
                alt="no projects"
                style="width:30%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateProposalModal
      :form-title="formTitle"
      :proposal="proposal"
      :action="handleSubmit"
      :value="show"
      :loading="vloading"
      @input="show = $event"
    />
  </Layout>
</template>
