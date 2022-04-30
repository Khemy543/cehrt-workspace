<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
  page: {
    title: 'Proposal Library',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader
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
      library: []
    }
  },

  created() {
    this.getProjectsLibrary()
  },
  methods: {
    async getProjectsLibrary() {
      try {
        this.loading = true;
        const response = await this.$http.get(`/fetch/library/projects`);

        if (response) {
          this.library = response.data.data;
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
    openModal() { },
    goToFiles(id) {
      this.$router.push(`/library/projects/${id}/files`)
    }
  }
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
                <button type="button" class="btn btn-danger mr-4 mb-3 mb-sm-0" @click="openModal">
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in library" :key="item.id" class="library-row" @click="goToFiles(item.id)">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.country }}</td>
                    <td>Accra</td>
                    <td>{{ item.district }}</td>
                    <td>2016</td>
                    <td>{{ item.client }}</td>
                    <td>{{ item.project_type.name }}</td>
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
    </div></Layout>
</template>
<style scoped>
  .library-row:hover {
    background-color: #f8f9fa;
  }

  .library-row {
    cursor: pointer;
  }
</style>