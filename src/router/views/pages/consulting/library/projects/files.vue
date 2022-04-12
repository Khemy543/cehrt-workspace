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
            library: [1]
        }
    },

    created() {
        // this.getProjectsLibrary()
    },
    methods: {
        async getProjectsLibrary() {
            try {
                this.loading = true;
                const response = await this.$http.get(`/fetch/projects`);

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
                                <h4 class="header-title mt-0 mb-1">Project Library</h4>
                                <p class="sub-header">view all project files</p>
                            </div>
                            <div>
                                <button type="button" class="btn btn-danger mr-4 mb-3 mb-sm-0" @click="openModal">
                                    <i class="uil-plus mr-1"></i> Add Directory
                                </button>
                            </div>
                        </div>

                        <div v-if="library.length > 0">
                            <div class="row mt-4">
                                <router-link v-for="n in 10" :key="n" to="" class="col-md-3">
                                    <div class="p-2 border rounded mb-4">
                                        <div class="media">
                                            <div class="avatar-sm font-weight-bold mr-3">
                                                <span class="avatar-title rounded bg-soft-primary text-primary">
                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                </span>
                                            </div>
                                            <div class="media-body">
                                                <div class="d-inline-block mt-2">Report.docx</div>
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

                        <div v-else class="w-100 d-flex justify-content-center">
                            <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width:30%" />
                        </div>
                    </div>
                </div>
            </div>
        </div></Layout>
</template>
<style scoped></style>