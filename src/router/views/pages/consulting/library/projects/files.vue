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
            project: null,
            library: []
        }
    },

    created() {
        this.getProjectsLibrary();
        this.getProjectDeliverables()
    },
    methods: {
        async getProjectDeliverables() {
            try {
                const response = await this.$http.get(
                    `fetch/${this.$route.params.id}/deliverables`
                )

                if (response) {
                    this.library = response.data
                }
            } catch (error) { }
        },
        async getProjectsLibrary() {
            try {
                this.loading = true;
                const response = await this.$http.get(`/fetch/library/${this.$route.params.id}/project`);

                if (response) {
                    this.project = response.data;
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
        openModal() { }
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
                                <h4 class="mt-0">
                                    Project: {{ project.name }}
                                    <div class="badge font-size-13 font-weight-normal ml-3" :class="
                                        project.status === 'pending'
                                            ? ' badge-warning'
                                            : project.status === 'ongoing'
                                                ? 'badge-primary' :
                                                project.status === 'overdue' ? 'badge-danger'
                                                    : 'badge-success'
                                    ">{{ project.status }}</div>
                                </h4>
                            </div>
                            <div>
                                <button type="button" class="btn btn-danger mr-4 mb-3 mb-sm-0" @click="openModal">
                                    <i class="uil-plus mr-1"></i> Add File
                                </button>
                            </div>
                        </div>

                        <h6 class="mt-0 header-title">About Project</h6>

                        <div class="text-muted mt-3">
                            <p>{{ project.description }}</p>
                            <div class="badge badge-soft-primary font-size-13 font-weight-normal ml-1">
                                {{
                                        project.project_sector && project.project_sector.name
                                }}
                            </div>

                            <div class="badge badge-soft-success font-size-13 font-weight-normal ml-1">{{
                                    project.project_type &&
                                    project.project_type.name
                            }}</div>

                            <div class="row">
                                <div class="col-lg-3 col-md-6">
                                    <div class="mt-4">
                                        <p class="mb-2">
                                            <i class="uil-user text-danger"></i> Coordinator
                                        </p>
                                        <!--  <h5 class="font-size-16">{{ project.coordinator.name || 'N/A' }}</h5> -->
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="mt-4">
                                        <p class="mb-2">
                                            <i class="uil-calender text-danger"></i> Start Date
                                        </p>
                                        <h5 class="font-size-16">{{ project.start_date }}</h5>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="mt-4">
                                        <p class="mb-2">
                                            <i class="uil-calendar-slash text-danger"></i> Due Date
                                        </p>
                                        <h5 class="font-size-16">{{ project.end_date }}</h5>
                                    </div>
                                </div>

                                <div class="col-lg-3 col-md-6">
                                    <div class="mt-4">
                                        <p class="mb-2">
                                            <i class="uil-user text-danger"></i> Client
                                        </p>
                                        <h5 class="font-size-16">{{ project.client }}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="library.length > 0" class="mt-5">
                            <div class="row mt-4">
                                <router-link v-for="n in library" :key="n" to="" class="col-md-3">
                                    <div class="p-2 border rounded mb-4">
                                        <div class="media">
                                            <div class="avatar-sm font-weight-bold mr-3">
                                                <span class="avatar-title rounded bg-soft-primary text-primary">
                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                </span>
                                            </div>
                                            <div class="media-body">
                                                <div class="d-inline-block mt-2">{{ n.project_type_deliverable.deliverable_name }}</div>
                                            </div>
                                            <div class="float-right mt-1">
                                                <div class="p-2">
                                                    <i class="uil-download-alt font-size-18"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>

                        <div v-else class="w-100 d-flex justify-content-center mt-4">
                            <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width:30%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
<style scoped>
</style>