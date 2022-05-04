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
            form: {},
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
        },
        getProjectTypes() {
            return this.project.project_type && this.project.project_type && this.project.project_type.deliverables || [];
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
                                    <button type="button" class="btn btn-primary">Save Changes</button>
                                </div>
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
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-18 mt-2 mb-1">
                                                Contract
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
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
                                    <div class="media d-flex justify-content-between align-items-center">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-18 mt-2 mb-1">
                                                Insurance
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
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
                                    <h5 class="font-size-18 mt-2 mb-2">
                                        Time Sheet
                                    </h5>
                                    <div v-for="deliverable in getProjectTypes" :key="deliverable.id"
                                        class="media d-flex justify-content-between align-items-center mt-1">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-14 mt-2 mb-1">
                                                {{ deliverable.deliverable_name }}
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
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
                                    <h5 class="font-size-18 mt-2 mb-2">
                                        Invoice
                                    </h5>
                                    <div v-for="deliverable in getProjectTypes" :key="deliverable.id"
                                        class="media d-flex justify-content-between align-items-center mb-4">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-14 mt-2 mb-1">
                                                {{ deliverable.deliverable_name }}
                                            </h5>
                                            <div>
                                                <input ref="contract" type="file" class="hidden" />
                                            </div>
                                            <div class="d-flex mt-3">
                                                <b-form-group id="input-group-1" label="Status"
                                                    label-for="input-1">
                                                    <b-form-select v-model="form" class="mb-2">
                                                        <option v-for="type in ['unpaid', 'paid']" :key="type"
                                                            :value="type">{{ type }}</option>
                                                    </b-form-select>
                                                </b-form-group>
                                                <b-form-group id="input-group-1" class=" mx-4" label="Payment days"
                                                    label-for="input-1">
                                                    <b-form-input id="input-1" v-model="form" type="number" required
                                                        placeholder="Days"></b-form-input>
                                                </b-form-group>
                                            </div>
                                        </div>
                                        <div class="d-flex">
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
                                        <div class="row">
                                            <div v-for="deliverable in getProjectTypes" :key="deliverable.id"
                                                class="col-md-6">
                                                <b-form-group id="input-group-1"
                                                    :label="`Professional Fees (${deliverable.deliverable_name})`"
                                                    label-for="input-1">
                                                    <b-form-input id="input-1" v-model="form" type="number" required
                                                        placeholder="Professional Fees"></b-form-input>
                                                </b-form-group>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Reimbursable" label-for="input-1">
                                                <b-form-input id="input-1" v-model="form" type="number" required
                                                    placeholder="Reimbursable"></b-form-input>
                                            </b-form-group>
                                        </div>

                                        <div class="col-md-6">
                                            <b-form-group id="input-group-1" label="Finder's fee" label-for="input-1">
                                                <b-form-input id="input-1" v-model="form" type="number" required
                                                    placeholder="Tax"></b-form-input>
                                            </b-form-group>
                                        </div>
                                        <div class="col-md-12">
                                            <b-form-group id="input-group-1" label="Miscellaneous" label-for="input-1">
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
                                                Tax (GH 1233.00)
                                            </h5>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <b-form-group id="input-group-1" label="Tax Amount" label-for="input-1">
                                            <b-form-input id="input-1" v-model="form" type="number" required
                                                placeholder="Tax amount"></b-form-input>
                                        </b-form-group>
                                    </div>
                                </li>
                            </ul>

                            <ul class="list-unstyled activity-widget">
                                <li class="activity-list">
                                    <div class="media d-flex justify-content-between">
                                        <div class="media-body overflow-hidden">
                                            <h5 class="font-size-15 mt-2 mb-1">
                                                Amount Paid (GH 1233.00)
                                            </h5>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div v-for="deliverable in getProjectTypes" :key="deliverable.id"
                                            class="col-md-6">
                                            <b-form-group id="input-group-1"
                                                :label="`Deliverable Fee (${deliverable.deliverable_name})`"
                                                label-for="input-1">
                                                <b-form-input id="input-1" v-model="form" type="number" required
                                                    placeholder="Deliverable Fee"></b-form-input>
                                            </b-form-group>
                                        </div>
                                    </div>
                                    <div class="row mt-2">
                                        <div v-for="deliverable in getProjectTypes" :key="deliverable.id"
                                            class="col-md-6">
                                            <b-form-group id="input-group-1"
                                                :label="`Mobilisation (${deliverable.deliverable_name})`"
                                                label-for="input-1">
                                                <b-form-input id="input-1" v-model="form" type="number" required
                                                    placeholder="Mobilisation"></b-form-input>
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