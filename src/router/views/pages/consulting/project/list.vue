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
    async getProjects() {
      try {
        this.loading = true
        const response = await this.$http.get('/fetch/projects')

        if (response) {
          this.projectData = response.data
          this.loading = false
        }
      } catch (error) {}
    },
    closeModal() {
      this.show = false
    },
    addNewProject(project) {
      this.projectData.push(project)

      this.closeModal()

      this.$bvToast.toast('New project added successfully', {
        title: 'Success',
        autoHideDelay: 5000,
        appendToast: false,
        variant: 'success',
        toastClass:'text-white'
      })
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
    <!-- <div class="row mb-3 mt-2">
			<div class="col-12">
				<div class="text-center">
					<a href="javascript:void(0);" class="btn btn-white">
						<feather
							type="loader"
							class="icon-dual icon-xs mr-2 align-middle"
						></feather
						>Load more
					</a>
				</div>
			</div>
		</div> -->
    <!-- end row -->

    <CreateProjectModal
      :show="show"
      :form-title="formtitle"
      :close="closeModal"
      @addNewProject="addNewProject"
    />
  </Layout>
</template>