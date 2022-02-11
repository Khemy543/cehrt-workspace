<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'View Departments',
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
      projectTypes: [],
      loading: false,
      show: false,
      form: {
        project_type_id: '',
        funding_option: '',
      },
      formtitle: 'Create Proposal',
    }
  },
  created() {
    this.fetchProposals()
    this.getProjectTypes()
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
      } catch (error) {}
    },

    async getProjectTypes() {
      try {
        const response = await this.$http.get('/fetch/project/types')

        if (response) {
          this.projectTypes = response.data
        }
      } catch (error) {}
    },

    async createProposal() {
      try {
        const response = await this.$http.post('/create/proposal', this.form)

        if (response && response.data) {
          this.proposals.push(response.data.proposal)
          this.show = false
          this.form = {}
          this.$bvToast.toast('Proposal created successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        this.$bvToast.toast('Something happend, please try again', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },

    async updateDepartment(id) {
      try {
        const response = await this.$http.put(
          `/admin/update/${id}/department`,
          this.form
        )

        if (response && response.data) {
          const index = this.departments.findIndex((item) => item.id === id)
          this.departments[index] = response.data
          this.show = false
          this.form = {}
          this.$bvToast.toast('Department updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        this.$bvToast.toast('Something happend, please try again', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      } finally {
        this.formtitle = 'Create Proposal'
      }
    },

    handleSubmit() {
      if (this.form.id) {
        return this.updateDepartment(this.form.id)
      }
      return this.createProposal()
    },

    openModal(id) {
      this.form = this.departments.find((item) => item.id === id)
      this.formtitle = 'Edit Proposal'
      this.show = true
    },

    async deleteDepartment(id) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/${id}/department`
        )

        if (response && response.data) {
          this.departments = this.departments.filter((item) => item.id !== id)
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
                <h4 class="header-title mt-0 mb-1">View Proposals</h4>
                <p class="sub-header">
                  view, add and edit details of all proposals
                </p>
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="show = true"
                >
                  <i class="uil-plus mr-1"></i> New Proposal
                </button>
              </div>
            </div>

            <div class="table-responsive">
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
                    v-for="(proposal, index) in proposals"
                    :key="proposal.id"
                    :title="proposal.description"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ proposal.title }}</td>
                    <td>{{ proposal.client }}</td>
                    <td>{{
                      proposal.project_type && proposal.project_type.name
                    }}</td>
                    <td>{{ proposal.funding_option }}</td>
                    <td>
                      <router-link
                        :to="`/proposals/details/${proposal.id}`"
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                      >
                        <i class="uil uil-eye mr-1"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="show"
      :title="formtitle"
      title-class="font-18"
      hide-footer
    >
      <form @submit.prevent="handleSubmit">
        <b-form-group
          id="input-group-1"
          label="Name of Proposal"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.title"
            type="text"
            required
            placeholder="Proposal name"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-1" label="Client" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.client"
            type="text"
            required
            placeholder="Project client"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Project Type"
          label-for="input-1"
        >
          <b-form-select v-model="form.project_type_id" class="mb-2">
            <option value="" disabled>Select project type</option>
            <option
              v-for="type in projectTypes"
              :key="type.id"
              :value="type.id"
              >{{ type.name }}</option
            >
          </b-form-select>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Funding Option"
          label-for="input-1"
        >
          <b-form-select v-model="form.funding_option" class="mb-2">
            <option value="" disabled>Select funding option</option>
            <option
              v-for="fund in ['World Bank', 'IFC', 'Private']"
              :key="fund"
              :value="fund"
              >{{ fund }}</option
            >
          </b-form-select>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </b-modal>
  </Layout>
</template>
