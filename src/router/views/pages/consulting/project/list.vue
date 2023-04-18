<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import CreateProjectModal from '@components/CreateProjectModal.vue'
import ProjectCard from '@components/project-card.vue'
import ProjectTable from '@components/ProjectTable'
import graph from '@/src/msalConfig/graph'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, CreateProjectModal, ProjectCard, ProjectTable },
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
      vloading: false,
      loading: false,
      show: false,
      form: {
        projectType: '',
        sector: '',
      },
      gridView: true,
      formtitle: 'Create New Project',
      status: '',
    }
  },
  created() {
    this.getProjects()
    document.addEventListener('scroll', this.checkIsVisible);
  },
  methods: {
    async getProjects(link = null, status = '') {
      try {
        this.loading = true
        this.status = status
        const response = await this.$http.get(
          link || `/fetch/projects?project_status=${status}`
        )

        if (response) {
          const { data, links, meta } = response.data
          if (meta.current_page === 1) {
            this.projectData = []
          }
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
      const rect = this.$refs['project-list'].getBoundingClientRect()
      if (rect.bottom <= window.innerHeight) {
        if (this.links.next && !this.loading) {
          this.getProjects(this.links.next)
        }
      }
    },
    closeModal() {
      this.show = false
    },
    async addNewProject(form) {
      try {
        this.vloading = true
        const data = await graph.createProjectFolder({
          name: form.name,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'replace',
        })

        const subData = await graph.createProjectMediaFolder(
          {
            name: 'Media',
            folder: {},
            '@microsoft.graph.conflictBehavior': 'replace',
          },
          data.id
        )

        const response = await this.$http.post('/create/project', {
          ...form,
          onedrive_id: data.id,
          images_path: subData.webUrl,
        })

        if (response) {
          this.form = {}

          this.projectData = [
            { ...response.data.project, assignees: [] },
            ...this.projectData,
          ]

          this.closeModal()

          this.vloading = false

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
        this.vloading = false
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
          <!-- <div class="btn-group mb-3 mb-sm-0">
            <button type="button" class="btn" :class="status === '' ? 'btn-primary' : 'btn-white'" @click="getProjects(null, '')">All</button>
          </div>
          <div class="btn-group ml-1">
            <button type="button" class="btn" :class="status === 'active' ? 'btn-primary' : 'btn-white'" @click="getProjects(null, 'active')">Ongoing</button>
            <button type="button" class="btn" :class="status === 'completed' ? 'btn-primary' : 'btn-white'" @click="getProjects(null, 'completed')">Finished</button>
          </div> -->
          <div class="btn-group ml-2 d-none d-sm-inline-block">
            <button
              type="button"
              class="btn btn-sm"
              :class="!gridView ? 'btn-white' : 'btn-primary'"
              @click="gridView = true"
            >
              <i class="uil uil-apps"></i>
            </button>
          </div>
          <div class="btn-group d-none d-sm-inline-block">
            <button
              type="button"
              class="btn btn-sm"
              :class="gridView ? 'btn-white' : 'btn-primary'"
              @click="gridView = false"
            >
              <i class="uil uil-align-left-justify"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div ref="project-list" class="row">
      <div class="col-12">
        <div v-if="gridView" class="row">
          <ProjectCard
            v-for="project in projectData"
            :key="project.id"
            :project="project"
          />
        </div>
        <div v-else>
          <ProjectTable :projects="projectData" />
        </div>
      </div>
    </div>

    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" size="sm" variant="primary"></b-spinner>
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

    <CreateProjectModal
      :value="show"
      :form-title="formtitle"
      :close="closeModal"
      :action="addNewProject"
      :loading="vloading"
      @input="show = $event"
    />
  </Layout>
</template>
