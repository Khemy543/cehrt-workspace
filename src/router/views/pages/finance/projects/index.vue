<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import CreateProjectModal from '@components/CreateProjectModal.vue'
import OtherProjectCard from '@/src/components/OtherProjectCard.vue'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, CreateProjectModal, OtherProjectCard },
  data() {
    return {
      projectData: [],
      links: {},
      title: 'Projects',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Projects',
          to: '',
          active: true,
        },
      ],
      loading: false,
      show: false,
      form: {
        projectType: '',
        sector: '',
      },
      formtitle: 'Create New Project',
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
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
    closeModal() {
      this.show = false
    },
    async addNewProject(form) {
      try {
        const response = await this.$http.post('/create/project', form)

        if (response) {
          this.form = {}

          this.projectData.push(response.data.project)

          this.closeModal()

          this.$bvToast.toast('New project added successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
            toastClass: 'text-white',
          })
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
          toastClass: 'text-white',
        })
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div class="row page-title align-items-center">
      <div class="col-md-3 col-xl-6">
        <h4 class="mb-1 mt-0">Projects</h4>
      </div>
      <div class="col-md-9 col-xl-6 text-md-right">
        <div class="mt-4 mt-md-0">
          <div class="btn-group mb-3 mb-sm-0">
            <button type="button" class="btn btn-primary">All</button>
          </div>
          <div class="btn-group ml-1">
            <button type="button" class="btn btn-white">Ongoing</button>
            <button type="button" class="btn btn-white">Finished</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" size="sm" variant="primary"></b-spinner>
    </div>

    <div v-else class="row">
      <OtherProjectCard
        v-for="project in projectData"
        :key="project.id"
        :project="project"
      />
    </div>

    <div v-if="links.next" class="row mb-3 mt-2">
      <div class="col-12">
        <div class="text-center">
          <div class="btn btn-white" @click="getProjects(links.next)">
            <feather
              type="loader"
              class="icon-dual icon-xs mr-2 align-middle"
            ></feather
            >Load more
          </div>
        </div>
      </div>
    </div>


    <div v-if="!loading && projectData.length <= 0" class=" w-100 d-flex justify-content-center">
      <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width:30%" />
    </div>

    <CreateProjectModal
      :value="show" 
      :form-title="formtitle"
      :close="closeModal"
      :action="addNewProject"
      @input="show = $event"
    />
  </Layout>
</template>
