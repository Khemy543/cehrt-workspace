<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <ProjectCard
        v-for="project in projectData"
        :key="project.id"
        :project="project"
      >
        <template v-slot:status>
          <div class="position-relative">
            <b-dropdown
              variant="link"
              class="position-absolute"
              style="right: 5px"
              toggle-class="p-0 text-muted arrow-none"
              right
            >
              <template v-slot:button-content>
                <i class="uil uil-ellipsis-v font-size-14"></i>
              </template>
              <b-dropdown-item
                href="javascript: void(0);"
                variant="secondary"
                @click="restoreProject(project)"
                >Restore</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                href="javascript: void(0);"
                variant="danger"
                @click="deleteProject(project)"
              >
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
      </ProjectCard>
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

    <div
      v-if="!loading && projectData.length <= 0"
      class="w-100 d-flex justify-content-center"
    >
      <img
        :src="require('@assets/svgs/empty.svg')"
        alt="no projects"
        style="width:30%"
      />
    </div>
  </Layout>
</template>

<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import ProjectCard from '@components/project-card.vue'
import graph from '@/src/msalConfig/graph'
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
          this.projectData = data
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
            const response = await this.$http.patch(
              `/restore/trashed/project`,
              {
                project_id: project.id,
              }
            )

            if (response) {
              this.projectData = this.projectData.filter(
                (item) => item.id !== project.id
              )
              this.$bvToast.toast(
                'Something happened, Please try again later',
                {
                  title: 'Error',
                  autoHideDelay: 5000,
                  appendToast: false,
                  variant: 'danger',
                }
              )
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

    async deleteProject(vItem) {
      this.$swal({
        title: 'Do you want to delete project permanently?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const respone = await this.$http.delete(
              `force-delete/trashed/project?project_id=${vItem.id}`
            )

            if (respone) {
              if(vItem.onedrive_id) {
                await graph.deleteFolder({ onedriveId: vItem.onedrive_id })
              }
              this.projectData = this.projectData.filter(
                  (item) => item.id !== vItem.id
                )
              this.$bvToast.toast('Project deleted successfully', {
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

<style scoped></style>
