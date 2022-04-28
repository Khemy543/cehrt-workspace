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
            show: false,
            formtitle: 'Edit Project',
            showCreateDeliverable: false,
            loading: true,
            project: {},
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
            projectDeliverables: [],
            vDeliverable: {},
            showProjectDeletionModal: false,
            comment: "",
            comments: []
        }
    },
    computed: {
        initials() {
            return 'AB'
        }
    },
    created() {
        this.getProjectDetials()
    },
    methods: {
        async getProjectDetials() {
            try {
                this.loading = true
                const response = await this.$http.get(
                    `/fetch/${this.$route.params.id}/project`
                )

                if (response && response.data) {
                    this.project = response.data
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
        openContractUpload() {
            this.$refs['contract'].click();
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
                                <div class="row page-title" style="padding:0">
                                    <div class="col-sm-12 col-xl-12">
                                        <h4 class="mt-0">
                                            Project: {{ project.name }}
                                            <div class="badge font-size-13 font-weight-normal ml-3" :class="
                                                project.status === 'pending'
                                                    ? ' badge-danger'
                                                    : project.status === 'ongoing'
                                                        ? 'badge-warning'
                                                        : 'badge-success'
                                            ">{{ project.status }}</div>
                                        </h4>
                                    </div>
                                </div>

                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mt-0 header-title">Project Documents</h6>

                            <ul class="list-unstyled activity-widget">
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Contract
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
                                            <!-- <div class="d-flex justify-content-between">
                                            <div>
                                                <a :id="`task-tooltip-${deliverable.id}`" href="javascript: void(0)"
                                                    class="text-muted d-inline-block bg-transparent">
                                                    <b-tooltip :target="`task-tooltip-${deliverable.id}`"
                                                        triggers="hover" placement="top">Tasks</b-tooltip>
                                                    <i class="uil uil-bars mr-1"></i>
                                                    {{ deliverable.task || 0 }} task(s)
                                                </a>
                                            </div>
                                        </div> -->
                                        </div>
                                        <div class="d-flex">
                                            <button type="button" class="btn btn-soft-secondary btn-sm"
                                                @click="openContractUpload">
                                                <i class="uil uil-edit"></i>
                                            </button>

                                            <button type="button" class="btn btn-soft-primary ml-2 btn-sm">
                                                <i class="uil uil-edit-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Insurance
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
                                            <!-- <div class="d-flex justify-content-between">
                                            <div>
                                                <a :id="`task-tooltip-${deliverable.id}`" href="javascript: void(0)"
                                                    class="text-muted d-inline-block bg-transparent">
                                                    <b-tooltip :target="`task-tooltip-${deliverable.id}`"
                                                        triggers="hover" placement="top">Tasks</b-tooltip>
                                                    <i class="uil uil-bars mr-1"></i>
                                                    {{ deliverable.task || 0 }} task(s)
                                                </a>
                                            </div>
                                        </div> -->
                                        </div>
                                        <div class="d-flex">
                                            <button type="button" class="btn btn-soft-secondary btn-sm"
                                                @click="openContractUpload">
                                                <i class="uil uil-edit"></i>
                                            </button>

                                            <button type="button" class="btn btn-soft-primary ml-2 btn-sm">
                                                <i class="uil uil-edit-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Time Sheet
                                            </h5>
                                            <!-- <div class="d-flex justify-content-between">
                                            <div>
                                                <a :id="`task-tooltip-${deliverable.id}`" href="javascript: void(0)"
                                                    class="text-muted d-inline-block bg-transparent">
                                                    <b-tooltip :target="`task-tooltip-${deliverable.id}`"
                                                        triggers="hover" placement="top">Tasks</b-tooltip>
                                                    <i class="uil uil-bars mr-1"></i>
                                                    {{ deliverable.task || 0 }} task(s)
                                                </a>
                                            </div>
                                        </div> -->
                                        </div>
                                        <div class="d-flex">
                                            <button type="button" class="btn btn-soft-secondary btn-sm"
                                                @click="openContractUpload">
                                                <i class="uil uil-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Scoping Report
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
                                            <!-- <div class="d-flex justify-content-between">
                                            <div>
                                                <a :id="`task-tooltip-${deliverable.id}`" href="javascript: void(0)"
                                                    class="text-muted d-inline-block bg-transparent">
                                                    <b-tooltip :target="`task-tooltip-${deliverable.id}`"
                                                        triggers="hover" placement="top">Tasks</b-tooltip>
                                                    <i class="uil uil-bars mr-1"></i>
                                                    {{ deliverable.task || 0 }} task(s)
                                                </a>
                                            </div>
                                        </div> -->
                                        </div>
                                        <div class="d-flex">
                                            <button type="button" class="btn btn-soft-secondary btn-sm"
                                                @click="openContractUpload">
                                                <i class="uil uil-edit"></i>
                                            </button>

                                            <button type="button" class="btn btn-soft-primary ml-2 btn-sm">
                                                <i class="uil uil-edit-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Final Report
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
                                            <!-- <div class="d-flex justify-content-between">
                                            <div>
                                                <a :id="`task-tooltip-${deliverable.id}`" href="javascript: void(0)"
                                                    class="text-muted d-inline-block bg-transparent">
                                                    <b-tooltip :target="`task-tooltip-${deliverable.id}`"
                                                        triggers="hover" placement="top">Tasks</b-tooltip>
                                                    <i class="uil uil-bars mr-1"></i>
                                                    {{ deliverable.task || 0 }} task(s)
                                                </a>
                                            </div>
                                        </div> -->
                                        </div>
                                        <div class="d-flex">
                                            <button type="button" class="btn btn-soft-secondary btn-sm"
                                                @click="openContractUpload">
                                                <i class="uil uil-edit"></i>
                                            </button>

                                            <button type="button" class="btn btn-soft-primary ml-2 btn-sm">
                                                <i class="uil uil-edit-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mt-0 header-title">Project Finances</h6>

                            <ul class="list-unstyled activity-widget">
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Contract Amount (GH 1233.00)
                                            </h5>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <b-form-group id="input-group-1" label="Professional Fees" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Professional Fees"></b-form-input>
                                        </b-form-group>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Reimbursable" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Reimbursable"></b-form-input>
                                        </b-form-group>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Tax" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Tax"></b-form-input>
                                        </b-form-group>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <ul class="list-unstyled activity-widget">
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Expenditure (GH 1233.00)
                                            </h5>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <b-form-group id="input-group-1" label="Professional Fees" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Professional Fees"></b-form-input>
                                        </b-form-group>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Reimbursable" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Reimbursable"></b-form-input>
                                        </b-form-group>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Tax" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Tax"></b-form-input>
                                        </b-form-group>
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