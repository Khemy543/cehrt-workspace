<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { dateDifference } from '@src/utils/format-date.js';

export default {
    page: {
        title: 'Requested Leave',
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
            title: 'Requested Leave',
            items: [
                {
                    text: 'Cehrt',
                    to: '/',
                },
                {
                    text: 'Requested Leave',
                    to: '',
                    active: true,
                },
            ],
            leaveRequests: [],
            loading: false
        }
    },
    created() {
        this.fetchPendingRequestedLeave()
    },
    methods: {
        async fetchPendingRequestedLeave() {
            this.loading = true
            try {
                const response = await this.$http.get(`/fetch/supervisor/pending/leave/requests`);

                if (response && response.data) {
                    this.leaveRequests = response.data
                    this.loading = false
                }
            } catch (error) {
                this.$bvToast.toast('Something happened, Please try again later', {
                    title: 'Error',
                    autoHideDelay: 5000,
                    appendToast: false,
                    variant: 'danger',
                    toastClass: 'text-white',
                })
            }
        },

        getDifference(later, earlier) {
            return dateDifference(later, earlier);
        }
    },

}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div v-if="loading" class="d-flex justify-content-center">
            <b-spinner type="grow" variant="primary"></b-spinner>
        </div>
        <div v-else class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4 class="header-title mt-0 mb-1">Requested Leave</h4>
                                <p class="sub-header">view, accept and reject requested leave</p>
                            </div>
                        </div>

                        <div v-if="leaveRequests.length > 0" class="table-responsive">
                            <table class="table mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Leave Type</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Reason</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(request, index) in leaveRequests" :key="request.id">
                                        <th scope="row">{{ index + 1 }}</th>
                                        <td>{{ request.user }}</td>
                                        <td>
                                            <div
                                                class="badge"
                                                :class="{
                                                    'badge-soft-warning': `${request.type}` === 'Compassionate',
                                                    'badge-soft-success':
                                                        `${request.type}` === 'Maternity',
                                                    'badge-soft-danger': `${request.type}` === 'Sick',
                                                    'badge-soft-secondary': `${request.type}` === 'Others',
                                                    'badge-soft-primary': `${request.type}` === 'Annual',
                                                }"
                                            >{{request.type }}</div>
                                        </td>
                                        <td>{{ request.start_date }} - {{ request.end_date }} ({{ getDifference(request.end_date, request.start_date) + 1}})</td>
                                        <td>{{ request.reason }}</td>
                                        <td>
                                            <b-dropdown
                                                variant="link"
                                                class="position-absolute"
                                                toggle-class="p-0 text-muted arrow-none"
                                            >
                                                <template v-slot:button-content>
                                                    <i class="uil uil-ellipsis-v font-size-14"></i>
                                                </template>
                                                <b-dropdown-item
                                                    :to="`/request/${request.id}/details`"
                                                    variant="secondary"
                                                >
                                                    <i class="uil uil-exit mr-2"></i>View
                                                </b-dropdown-item>
                                                <!-- <b-dropdown-divider></b-dropdown-divider>
                                                <b-dropdown-item
                                                    href="javascript: void(0);"
                                                    variant="success"
                                                >
                                                    <i class="uil uil-edit mr-2"></i>Approve
                                                </b-dropdown-item>
                                                <b-dropdown-item
                                                    href="javascript: void(0);"
                                                    variant="danger"
                                                >
                                                    <i class="uil uil-trash-alt mr-2"></i>Reject
                                                </b-dropdown-item> -->
                                            </b-dropdown>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-else class="w-100 d-flex justify-content-center">
                            <img
                                :src="require('@assets/svgs/empty.svg')"
                                alt="no projects"
                                style="width:30%"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
