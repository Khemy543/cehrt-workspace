<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import CreateProjectModal from '@components/CreateProjectModal.vue'
import ProjectCard from '@components/project-card.vue'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, CreateProjectModal, ProjectCard },
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
          const { data, links } = response.data;
          this.projectData = [...this.projectData, ...data];
          this.links = links
          this.loading = false
        }
      } catch (error) {
        console.log(error)
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
            toastClass:'text-white'
          })
        }
      } catch (error) {
        if(error.response) {
          const { status, data } = error.response;
          if(status === 422) {
            const { errors } = data;
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
          toastClass:'text-white'
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
          <button
            type="button"
            class="btn btn-danger mr-4 mb-3 mb-sm-0"
            @click="show = true"
          >
            <i class="uil-plus mr-1"></i> Create Project
          </button>
          <div class="btn-group mb-3 mb-sm-0">
            <button type="button" class="btn btn-primary">All</button>
          </div>
          <div class="btn-group ml-1">
            <button type="button" class="btn btn-white">Ongoing</button>
            <button type="button" class="btn btn-white">Finished</button>
          </div>
          <div class="btn-group ml-2 d-none d-sm-inline-block">
            <button type="button" class="btn btn-primary btn-sm">
              <i class="uil uil-apps"></i>
            </button>
          </div>
          <div class="btn-group d-none d-sm-inline-block">
            <button type="button" class="btn btn-white btn-sm">
              <i class="uil uil-align-left-justify"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" size="sm" variant="primary"></b-spinner>
    </div>

    <div v-else class="row">
      <ProjectCard
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

    <CreateProjectModal
      :show="show"
      :form-title="formtitle"
      :close="closeModal"
      :action="addNewProject"
    />
  </Layout>
</template>
