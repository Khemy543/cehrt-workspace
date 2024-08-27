<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import OtherProjectCard from '@/src/components/OtherProjectCard.vue'

export default {
  page: {
    title: 'Projects',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, OtherProjectCard },
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
    }
  },
  created() {
    this.getProjects();
    document.addEventListener('scroll', this.checkIsVisible);
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
    checkIsVisible() {
      const rect = this.$refs['projectRef'].getBoundingClientRect();
      if (rect.bottom <= window.innerHeight) {
        if(this.links.next && !this.loading) {
          this.getProjects(this.links.next)
        }
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
      <!-- <div class="col-md-9 col-xl-6 text-md-right">
        <div class="mt-4 mt-md-0">
          <div class="btn-group mb-3 mb-sm-0">
            <button type="button" class="btn btn-primary">All</button>
          </div>
          <div class="btn-group ml-1">
            <button type="button" class="btn btn-white">Ongoing</button>
            <button type="button" class="btn btn-white">Finished</button>
          </div>
        </div>
      </div> -->
    </div>

    <div ref="projectRef" class="row">
      <OtherProjectCard
        v-for="project in projectData"
        :key="project.id"
        :project="project"
      />
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
  </Layout>
</template>
