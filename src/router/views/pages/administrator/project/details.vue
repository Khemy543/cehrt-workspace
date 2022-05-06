<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
    page: {
        title: 'Projects',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout, PageHeader },
    data() {
        return {
            loading: true,
            project: {},
            contractForm: {},
            title: 'Project Overview',
            items: [
                {
                    text: 'Cehrt',
                    to: '/',
                },
                {
                    text: 'Projects',
                    to: '/',
                },
                {
                    text: 'Project Name',
                    active: true,
                },
            ],
            contractFile: null,
            insuranceFile: null,
            permitFile: null,
            reviewFile: null,
            correspondents: [
                {
                    id: 1,
                    file: null
                }
            ]
        }
    },
    computed: {
        initials() {
            return 'AB'
        },
    },
    created() {
        this.getProjectDetials()
    },
    methods: {
        handleContractChange({ target }) {
            this.contractFile = target.files[0];
        },
        handleInsuranceChange({ target }) {
            this.insuranceFile = target.files[0];
        },
        handlePermitChange({ target }) {
            this.permitFile = target.files[0]
        },
        handleReveiwCommentChange({ target }) {
            this.reviewFile = target.files[0]
        },
        handleChangeCorrespondent(e, corresItem) {
            const index = this.correspondents.findIndex(item => item.id === corresItem.id);

            this.$set(this.correspondents, index, { ...corresItem, corespondent_path: e.target.files[0] })
        },
        async saveProjectData() {
            try {
                const formData = new FormData();
                if (this.contractFile && typeof(this.contractFile) !== 'string') {
                    formData.append('contract', this.contractFile);
                }
                if (this.insuranceFile && typeof(this.insuranceFile) !== 'string') {
                    formData.append('insurance', this.insuranceFile);
                }
                if (this.permitFile && typeof(this.permitFile) !== 'string') {
                    formData.append('permit', this.permitFile);
                }
                if (this.reviewFile && typeof(this.reviewFile) !== 'string') {
                    formData.append('review_comment', this.reviewFile);
                }
                this.correspondents.forEach((file) => {
                    if(file && typeof(file.corespondent_path) !== 'string') {
                        formData.append('corespondents[]', file.corespondent_path)
                    }
                })
                formData.append('_method', 'PATCH');

                const response = await this.$http.post(`/admin/add/project/${this.$route.params.id}/corespondents`, formData);

                if (response) {
                    this.$bvToast.toast('File saved successfully', {
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

        async getProjectDetials() {
            try {
                this.loading = true
                const response = await this.$http.get(`/admin/fetch/project/${this.$route.params.id}/corespondents`)

                if (response && response.data) {
                    this.project = response.data
                    this.contractFile = response.data.contract;
                    this.insuranceFile = response.data.insurance;
                    this.permitFile = response.data.permit;
                    this.reviewFile = response.data.review_comment;
                    this.correspondents = response.data.corespondents;
                    this.items[2].text = response.data.name
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
        createUrl(file) {
            if (file && typeof (file) === 'object') {
                return window.URL.createObjectURL(file);
            }

            if (file && typeof (file) === 'string') {
                return `${process.env.API_BASE_URL}${file.replace('/', '')}`
            }
            return null;
        },
        addNewCorrespondant() {
            this.correspondents.push({
                id: this.correspondents[this.correspondents.length - 1].id + 1,
                file: null
            })
        },
        removeCorrespondent(id) {
            if (this.correspondents.length > 1) {
                this.correspondents = this.correspondents.filter(item => item.id !== id)
            }
        }
    }
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div v-if="loading" class="d-flex justify-content-center">
            <b-spinner type="grow" variant="primary"></b-spinner>
        </div>
        <div v-else>
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-body p-0">
                            <div class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between">
                                <div class="page-title" style="padding:0">
                                    <h4 class="mt-0">
                                        Project: {{ project.name }}
                                        <div class="badge font-size-13 font-weight-normal ml-3" :class="
                                            project.status === 'overdue'
                                                ? ' badge-danger'
                                                : project.status === 'ongoing'
                                                    ? 'badge-primary'
                                                    : 'badge-success'
                                        ">{{ project.status }}</div>
                                    </h4>
                                    <p>{{ project.description }}</p>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-primary" @click="saveProjectData">Save
                                        Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row d-flex">
                <div class="col-xl-8">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mt-0 header-title">Project Documents</h6>

                            <ul class="list-unstyled activity-widget">
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-16 mt-2 mb-1">
                                                Contract
                                            </h5>
                                            <div v-if="createUrl(contractFile)" class="row">
                                                <a :href="createUrl(contractFile)" target="_blank" class="col-6">
                                                    <div class="p-2 border rounded mb-4">
                                                        <div class="media">
                                                            <div class="avatar-sm font-weight-bold mr-3">
                                                                <span
                                                                    class="avatar-title rounded bg-soft-primary text-primary">
                                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                                </span>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="d-inline-block mt-2">Contract.docx</div>
                                                            </div>
                                                            <!-- <div class="float-right mt-1">
                                                                <div class="p-2">
                                                                    <i class="uil-download-alt font-size-18"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div v-else>
                                                <input ref="contract" type="file" @change="handleContractChange" />
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            
                                            <button type="button" class="btn btn-soft-danger btn-sm mx-2"
                                                @click="contractFile = null">
                                                <i class="uil uil-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-16 mt-2 mb-1">
                                                Insurance
                                            </h5>
                                            <div v-if="createUrl(insuranceFile)" class="row">
                                                <a :href="createUrl(insuranceFile)" target="_blank" class="col-6">
                                                    <div class="p-2 border rounded mb-4">
                                                        <div class="media">
                                                            <div class="avatar-sm font-weight-bold mr-3">
                                                                <span
                                                                    class="avatar-title rounded bg-soft-primary text-primary">
                                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                                </span>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="d-inline-block mt-2">Insurance.docx</div>
                                                            </div>
                                                            <!-- <div class="float-right mt-1">
                                                                <div class="p-2">
                                                                    <i class="uil-download-alt font-size-18"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div v-else>
                                                <input type="file" @change="handleInsuranceChange" />
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            
                                            <button type="button" class="btn btn-soft-danger btn-sm mx-2"
                                                @click="insuranceFile = null">
                                                <i class="uil uil-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <div class=" d-flex">
                                                <h5 class="font-size-16 mt-2 mb-1">
                                                    Correspondent
                                                </h5>
                                                <button type="button" class="btn btn-primary btn-sm mx-4"
                                                    @click="addNewCorrespondant">
                                                    <i class="uil-plus font-size-10"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-for="(deliverable, index) in correspondents" :key="deliverable.id"
                                        class="media d-flex justify-content-between align-items-center mb-2">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-14 mt-2 mb-1">
                                                {{ deliverable.name }}
                                            </h5>
                                            <div v-if="createUrl(correspondents[index].corespondent_path)" class="row">
                                                <a :href="createUrl(correspondents[index].corespondent_path)" target="_blank"
                                                    class="col-6">
                                                    <div class="p-2 border rounded mb-4">
                                                        <div class="media">
                                                            <div class="avatar-sm font-weight-bold mr-3">
                                                                <span
                                                                    class="avatar-title rounded bg-soft-primary text-primary">
                                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                                </span>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="d-inline-block mt-2">correspondent.docx
                                                                </div>
                                                            </div>
                                                            <!-- <div class="float-right mt-1">
                                                                <div class="p-2">
                                                                    <i class="uil-download-alt font-size-18"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div v-else>
                                                <input ref="contract" type="file"
                                                    @change="(e) => handleChangeCorrespondent(e, correspondents[index])" />
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            
                                            <button type="button" class="btn btn-soft-danger btn-sm mx-2"
                                                @click="removeCorrespondent(deliverable.id)">
                                                <i class="uil uil-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-16 mt-2 mb-1">
                                                Permit
                                            </h5>
                                            <div v-if="createUrl(permitFile)" class="row">
                                                <a :href="createUrl(permitFile)" target="_blank" class="col-6">
                                                    <div class="p-2 border rounded mb-4">
                                                        <div class="media">
                                                            <div class="avatar-sm font-weight-bold mr-3">
                                                                <span
                                                                    class="avatar-title rounded bg-soft-primary text-primary">
                                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                                </span>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="d-inline-block mt-2">Permit.docx</div>
                                                            </div>
                                                            <!-- <div class="float-right mt-1">
                                                                <div class="p-2">
                                                                    <i class="uil-download-alt font-size-18"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div v-else>
                                                <input type="file" @change="handlePermitChange" />
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                           
                                            <button type="button" class="btn btn-soft-danger btn-sm mx-2"
                                                @click="permitFile = null">
                                                <i class="uil uil-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-16 mt-2 mb-1">
                                                Review Comment
                                            </h5>
                                            <div v-if="createUrl(reviewFile)" class="row">
                                                <a :href="createUrl(reviewFile)" target="_blank" class="col-6">
                                                    <div class="p-2 border rounded mb-4">
                                                        <div class="media">
                                                            <div class="avatar-sm font-weight-bold mr-3">
                                                                <span
                                                                    class="avatar-title rounded bg-soft-primary text-primary">
                                                                    <i class="uil-file-plus-alt font-size-18"></i>
                                                                </span>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="d-inline-block mt-2">Review-comment.docx
                                                                </div>
                                                            </div>
                                                            <!-- <div class="float-right mt-1">
                                                                <div class="p-2">
                                                                    <i class="uil-download-alt font-size-18"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div v-else>
                                                <input type="file" @change="handleReveiwCommentChange" />
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                           
                                            <button type="button" class="btn btn-soft-danger btn-sm mx-2"
                                                @click="reviewFile = null">
                                                <i class="uil uil-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
<style scoped>
.hidden {
    display: hidden;
}
</style>