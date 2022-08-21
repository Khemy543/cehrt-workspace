<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <ProjectCard v-for="project in projectData" :key="project.id" :project="project">
        <template v-slot:status>
          <button
            type="button"
            class="btn btn-soft-primary btn-sm float-right"
            @click="restoreProject(project)"
          >restore</button>
        </template>
      </ProjectCard>
    </div>

    <div v-if="links.next" class="row mb-3 mt-2">
      <div class="col-12">
        <div class="text-center">
          <div class="btn btn-white" @click="getProjects(links.next)">
            <feather type="loader" class="icon-dual icon-xs mr-2 align-middle"></feather>Load more
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && projectData.length <= 0" class="w-100 d-flex justify-content-center">
      <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width:30%" />
    </div>
  </Layout>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import ProjectCard from '@components/project-card.vue'
export default {
  page: {
    title: 'Projects Recycle',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    ProjectCard,
  },
  data() {
    return {
      links: {},
      loading: false,
      projectData: [],
      title: 'Project Recycle',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Project Recycle',
          active: true,
        },
      ],
    }
  },
  created() {
    this.getRecycleProject()
  },
  methods: {
    async getRecycleProject() {
      try {
        this.loading = true
        const response = await this.$http.get(`/fetch/trashed/projects`)

        if (response) {
          const { data, links } = response.data
          this.projectData = data;
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

    restoreProject(project) {
      this.$swal({
        title: 'Restore project?',
        showDenyButton: true,
        confirmButtonText: 'Restore',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.patch(`/restore/trashed/project`,{
              project_id: project.id
            });

            if (response) {
              this.projectData = this.projectData.filter(item => item.id !== project.id);
              this.$bvToast.toast('Something happened, Please try again later', {
                title: 'Error',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'danger',
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
    }
  },
}
</script>

<style scoped></style>
