<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import AddProjectToLibrary from '@components/AddProjectToLibrary.vue'
import ProjectDeletionModal from '@components/ProjectDeletionModal.vue'

export default {
  page: {
    title: 'Project Library',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    AddProjectToLibrary,
    ProjectDeletionModal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchKey: '',
      pagination: {},
      currentPage: 1,
      title: 'Library',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Library',
          to: '',
          active: true,
        },
      ],
      editting: false,
      loading: false,
      library: [],
      show: false,
      vProject: null,
      showProjectDeletionModal: false,
      projectId: null,
      vloading: false,
    }
  },
  computed: {
    department() {
      return this.$store ? this.$store.state.auth.userDepartment : {} || {}
    },
  },
  watch: {
    currentPage(newPage) {
      if (newPage) {
        this.getProjectsLibrary()
      }
    },
  },
  created() {
    this.getProjectsLibrary()
  },
  methods: {
    getNumber(index) {
      return index + this.pagination.from
    },
    handleAction(form) {
      if (this.editting) {
        return this.updateProject(form)
      }
      return this.createProject(form)
    },
    getProjectRegions(regions) {
      if (regions.length > 2) {
        return `${regions
          .slice(0, 2)
          .map((item) => item.region)
          .join(', ')}...`
      }
      return regions.map((item) => item.region).join(', ')
    },
    getIds(regions) {
      return regions.map((items) => items.id)
    },
    deleteProject(id) {
      this.showProjectDeletionModal = true
      this.projectId = id
    },
    async createProject(form) {
      this.vloading = true
      try {
        const response = await this.$http.post(`/save/old/project`, {
          ...form,
          regionIds: this.getIds(form.regionIds),
        })

        if (response) {
          this.library.unshift(response.data.project)
          this.$bvToast.toast('Project added to library successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })

          this.show = false
          this.vloading = false
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
        this.vloading = false
      }
    },
    async updateProject(form) {
      try {
        this.vloading = true
        const response = await this.$http.patch(`/export/${form.id}/project`, {
          ...form,
          coordinator_id: this.$store.state.auth.currentUser.id,
          regionIds: form.regionIds.map((region) => region.id),
        })

        if (response) {
          const newData = {
            ...response.data.project,
            district: form.district,
          }
          const index = this.library.findIndex((item) => item.id === form.id)
          this.$set(this.library, index, newData)
          this.$bvToast.toast('Project updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.show = false
          this.editting = false
          this.vProject = null
          this.vloading = false
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 422) {
            const { errors } = data
            return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
        this.vloading = false
      }
    },
    async getProjectsLibrary() {
      try {
        this.loading = true
        const response = await this.$http.get(
          `/fetch/library/projects?page=${this.currentPage}&search_key=${this.searchKey}`
        )

        if (response) {
          const { data, meta } = response.data
          this.pagination = {
            rows: meta.total,
            perPage: meta.per_page,
            from: meta.from,
          }
          this.library = data
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
    openModal() {
      this.show = true
    },
    goToFiles(id) {
      this.$router.push(`/library/projects/${id}/files`)
    },
    editProject(project) {
      this.vProject = project
      this.editting = true
      this.show = true
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
            <div class="d-flex justify-content-between mb-3 align-items-center">
              <div>
                <h4 class="header-title mt-0 mb-1">Project Library</h4>
              </div>

              <form style="width: 400px;" @submit.prevent="getProjectsLibrary">
                <b-form-input
                  id="search"
                  v-model="searchKey"
                  type="search"
                  placeholder="Search..."
                  class="w-100"
                ></b-form-input>
              </form>
              <div>
                <button
                  v-if="department.name === 'Consultancy'"
                  type="button"
                  class="btn btn-danger mr-4 mb-3 mb-sm-0"
                  @click="openModal"
                >
                  <i class="uil-plus mr-1"></i> Add Directory
                </button>
              </div>
            </div>

            <div v-if="library.length > 0" class="table-responsive">
              <table class="table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Project</th>
                    <th scope="col">Region</th>
                    <th scope="col">District</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Year</th>
                    <th scope="col">Client</th>
                    <th scope="col">Type</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in library"
                    :key="item.id"
                    class="library-row"
                  >
                    <th scope="row">{{ getNumber(index) }}</th>
                    <td>{{ item.name }}</td>
                    <td>{{ getProjectRegions(item.regions) }}</td>
                    <td>{{ item.district || 'N/A' }}</td>
                    <td>{{
                      (item.project_sector && item.project_sector.name) || 'N/A'
                    }}</td>
                    <td>{{ new Date(item.end_date).getFullYear() }}</td>
                    <td>{{ item.client }}</td>
                    <td>{{
                      (item.project_type && item.project_type.name) || 'N/A'
                    }}</td>
                    <td class="d-flex">
                      <b-dropdown
                        right
                        variant="link"
                        class=" position-absolute"
                        toggle-class="p-0 text-muted arrow-none"
                      >
                        <template v-slot:button-content>
                          <i class="uil uil-ellipsis-v font-size-14"></i>
                        </template>
                        <b-dropdown-item
                          :to="`/library/projects/${item.id}/files`"
                          variant="secondary"
                          ><i class="uil uil-exit mr-2"></i
                          >View</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="secondary"
                          @click="editProject(item)"
                        >
                          <i class="uil uil-edit mr-2"></i>Edit
                        </b-dropdown-item>
                        <b-dropdown-item
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deleteProject(item.id)"
                        >
                          <i class="uil uil-trash-alt mr-2"></i>Delete
                        </b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="row mt-3 mr-3">
                <div class="col">
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <!-- pagination -->
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="pagination.rows"
                        :per-page="pagination.per_page"
                      ></b-pagination>
                    </ul>
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
      <AddProjectToLibrary
        :action="handleAction"
        :value="show"
        title="Add Project To Library"
        :project="vProject"
        :loading="vloading"
        @input="show = $event"
      />
    </div>

    <ProjectDeletionModal
      :close="() => (showProjectDeletionModal = false)"
      :value="showProjectDeletionModal"
      :project-id="projectId"
      @input="showProjectDeletionModal = $event"
    />
  </Layout>
</template>
<style scoped>
/* .library-row:hover {
  background-color: #f8f9fa;
}

.library-row {
  cursor: pointer;
} */
</style>
