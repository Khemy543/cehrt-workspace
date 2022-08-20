<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import AddProjectToLibrary from '@components/AddProjectToLibrary.vue'

export default {
  page: {
    title: 'Project Library',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    AddProjectToLibrary,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
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
      loading: false,
      library: [],
      show: false,
      vProject: null,
    }
  },
  computed: {
    department() {
      return this.$store ? this.$store.state.auth.userDepartment : {} || {}
    },
  },
  created() {
    this.getProjectsLibrary()
  },
  methods: {
    getIds(regions) {
      return regions.map((items) => items.id)
    },
    async createProject(form) {
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
      }
    },
    async getProjectsLibrary() {
      try {
        this.loading = true
        const response = await this.$http.get(`/fetch/library/projects`)

        if (response) {
          this.library = response.data.data
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
      this.vProject = project;
      this.show = true
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
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="header-title mt-0 mb-1">Project Library</h4>
                <p class="sub-header">view all project files</p>
              </div>
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
                    <th scope="col">Country</th>
                    <th scope="col">Region</th>
                    <th scope="col">District</th>
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
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.country || 'N/A' }}</td>
                    <td>Accra</td>
                    <td>{{ item.district || 'N/A' }}</td>
                    <td>2016</td>
                    <td>{{ item.client }}</td>
                    <td>{{ item.project_type.name }}</td>
                    <td class="d-flex">
                      <b-dropdown
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
                        <!-- <b-dropdown-item
                          href="javascript: void(0);"
                          variant="danger"
                          @click="deleteProject(work)"
                        >
                          <i class="uil uil-trash-alt mr-2"></i>Delete
                        </b-dropdown-item> -->
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
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
        :action="createProject"
        :value="show"
        title="Add Project To Library"
        :project="vProject"
        @input="show = $event"
      />
    </div>
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
