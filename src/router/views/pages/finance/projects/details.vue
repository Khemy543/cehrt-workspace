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
      invoice: [],
      amount_paid: 0,
      timeSheet: [],
      contractFile: null,
      insuranceFile: null,
      timeSheetFiles: [],
      deliverables: [],
      incomeObject: {
        amount: 0,
        expenditure: 0,
        income: 0
      },
      expenditure: {
        chartOptions: {
          colors: ['#5369f8', '#43d39e', '#f77e53', '#ffbe0b'],
          chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          xaxis: {
            categories: ['Amount Paid', 'Expenditure', 'Income'],
            axisBorder: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
          grid: {
            row: {
              colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.2,
            },
            borderColor: '#f3f4f7',
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return 'GHS ' + val
              },
            },
          },
        },
        series: [],
      },
      income: {
        chartOptions: {
          colors: ['#5369f8', '#43d39e', '#f77e53'],
          chart: {
            type: 'bar',
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          xaxis: {
            categories: ['Amount Paid', 'Expenditure', 'Income'],
            axisBorder: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
          grid: {
            row: {
              colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.2,
            },
            borderColor: '#f3f4f7',
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return  val + '%'
              },
            },
          },
        },
        series: [
          {
            name: 'Percentage',
            data: [0, 0, 0],
          },
        ],
      },
    }
  },
  computed: {
    initials() {
      return 'AB'
    },
    getProjectTypesDeliverables() {
      return (
        (this.project.project_type &&
          this.project.project_type &&
          this.project.project_type.deliverables) ||
        []
      )
    },
    contractAmount() {
      const {
        contract_amount_profession_fees: profFess,
        contract_amount_reimbursable: rem,
        contract_amount_tax_amount: tax,
      } = this.contractForm
      const total = Number(profFess) + Number(rem) + Number(tax)
      return total.toFixed(2)
    },
    getTaxAmount() {
      const { project_tax_amount: amt } = this.contractForm
      return Number(amt).toFixed(2)
    },
    getWithHoldingTax() {
      const { withholding_tax: amt } = this.contractForm
      return Number(amt).toFixed(2)
    },
  },
  watch: {
    incomeObject(newValue) {
      if(this.$refs.incomeChart) {
        this.$refs.incomeChart.updateSeries([{
          name: 'Percentage',
          data: [newValue.amount, newValue.expenditure, newValue.income],
        }], false, true)
      }
    }
  },
  created() {
    this.getProjectDetials()
  },
  methods: {
    formateAmount(amount) {
      return amount && amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getExpenditure() {
      const {
        expenditure_reimbursable: rem,
        expenditure_finders_fee: fee,
        expenditure_miscellaneous: mel,
      } = this.contractForm
      let total = Number(rem) + Number(fee) + Number(mel)

      for (const n of this.deliverables) {
        if (n.deliverable_professional_fees) {
          total = total + Number(n.deliverable_professional_fees)
        }
      }
      this.incomeObject = {
        amount: (Number(this.getAmountPaid()) / Number(this.getAmountPaid())) * 100,
        expenditure: Math.round((total / this.getAmountPaid()) * 100),
        income: Math.round(((this.getAmountPaid() - total) / this.getAmountPaid()) * 100)
      }
      return total.toFixed(2)
    },
    getAmountPaid() {
      let total = 0
      for (const n of this.deliverables) {
        if (n.deliverable_fee_amount_paid) {
          total = total + Number(n.deliverable_fee_amount_paid)
        }
      }
      // this.amount_paid = total.toFixed(2)
      this.income.series[0].data[0] = (total.toFixed(2) / total.toFixed(2)) * 100
      return total.toFixed(2)
    },
    async saveProjectData(show = false) {
      try {
        const response = await this.$http.patch(
          `/finance/update/${this.$route.params.id}/project`,
          this.contractForm
        )
        if (response) {
          if (show) {
            this.$bvToast.toast('Changes saved successfully', {
              title: 'Success',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'success',
              toastClass: 'text-white',
            })
          }
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
    handleContractChange({ target }) {
      this.contractFile = target.files[0]
    },
    handleInsuranceChange({ target }) {
      this.insuranceFile = target.files[0]
    },
    handleTimeSheetChange(e, id) {
      const index = this.timeSheet.findIndex((item) => item.id === id)
      const single = this.timeSheet.find((item) => item.id === id)

      this.$set(this.timeSheet, index, {
        ...single,
        timesheet: e.target.files[0],
      })
    },
    handleInvoiceChange(e, id) {
      const index = this.invoice.findIndex((item) => item.id === id)
      const single = this.invoice.find((item) => item.id === id)

      this.$set(this.invoice, index, { ...single, invoice: e.target.files[0] })
    },
    async saveContractFile(name, file) {
      try {
        const formData = new FormData()
        formData.append(name, file, file.name)
        formData.append('_method', 'PATCH')

        const response = await this.$http.post(
          `/finance/update/${this.$route.params.id}/project`,
          formData
        )

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

    async handleSaveItem(value, key, id) {
      try {
        const formData = new FormData()
        formData.append(`${key}`, value || 0)
        formData.append('_method', 'PATCH')
        const response = await this.$http.post(
          `finance/update/${id}/deliverable`,
          formData
        )

        if (response) {
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

    async saveDelivarableFile(item) {
      try {
        const formData = new FormData()
        for (const key in item) {
          console.log(`${key}` === 'id')
          if (`${key}` !== 'id' && `${key}` !== 'name') {
            formData.append(`${key}`, item[key])
          }
        }
        formData.append('_method', 'PATCH')

        if (typeof item['invoice'] === 'string') {
          formData.delete('invoice')
        }

        if (typeof item['timesheet'] === 'string') {
          formData.delete('timesheet')
        }

        const response = await this.$http.post(
          `finance/update/${item.id}/deliverable`,
          formData
        )

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
        const response = await this.$http.get(
          `/finance/fetch/${this.$route.params.id}/project`
        )

        if (response && response.data) {
          this.project = response.data
          this.contractFile = response.data.contract
          this.insuranceFile = response.data.insurance
          this.contractForm = {
            contract_amount_profession_fees:
              response.data.contract_amount_profession_fees || 0,
            contract_amount_reimbursable:
              response.data.contract_amount_reimbursable || 0,
            contract_amount_tax_amount:
              response.data.contract_amount_tax_amount || 0,
            expenditure_finders_fee: response.data.expenditure_finders_fee || 0,
            expenditure_miscellaneous:
              response.data.expenditure_miscellaneous || 0,
            expenditure_reimbursable:
              response.data.expenditure_reimbursable || 0,
            project_tax_amount: response.data.project_tax_amount || 0,
            withholding_tax: response.data.withholding_tax || 0,
          }
          response.data.deliverables.forEach((item) => {
            this.invoice.push({
              invoice: item.invoice,
              invoice_status: item.invoice_status || 'unpaid',
              invoice_days: item.invoice_days,
              name: item.name,
              id: item.id,
            })

            this.timeSheet.push({
              timesheet: item.timesheet,
              name: item.name,
              id: item.id,
            })

            this.deliverables.push({
              deliverable_fee_amount_paid: item.deliverable_fee_amount_paid,
              name: item.name,
              id: item.id,
              deliverable_professional_fees: item.deliverable_professional_fees,
            })
          })
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

    /* async deletProjectFile(id, key) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/project/{project}/files`
        )
      } catch (error) {}
    }, */
    openContractUpload() {
      this.$refs['contract'].click()
    },
    createUrl(file) {
      if (file && typeof file === 'object') {
        return window.URL.createObjectURL(file)
      }

      if (file && typeof file === 'string') {
        return `https://backend-api.cehrtghana.com/${file}`
      }
      return null
    },
    removeTimeSheet(timesheetItem) {
      const index = this.timeSheet.findIndex(
        (item) => item.id === timesheetItem.id
      )

      this.$set(this.timeSheet, index, { ...timesheetItem, timesheet: null })
    },
    removeInvoiceFile(invoiceItem) {
      const index = this.invoice.findIndex((item) => item.id === invoiceItem.id)

      this.$set(this.invoice, index, { ...invoiceItem, invoice: null })
    },
  },
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
              <div
                class="card-title border-bottom p-3 mb-0 w-100 d-flex justify-content-between"
              >
                <div class="page-title" style="padding:0">
                  <h4 class="mt-0">
                    Project: {{ project.name }}
                    <div
                      class="badge font-size-13 font-weight-normal ml-3"
                      :class="
                        project.status === 'overdue'
                          ? ' badge-danger'
                          : project.status === 'ongoing'
                          ? 'badge-primary'
                          : 'badge-success'
                      "
                      >{{ project.status }}</div
                    >
                  </h4>
                  <p>{{ project.description }}</p>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="saveProjectData(true)"
                    >Save Changes</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mt-0 pb-2 header-title">Income Graph</h5>
              <!-- Sales donut chart -->
              <apexchart
                ref="incomeChart"
                type="bar"
                height="304"
                :series="income.series"
                :options="income.chartOptions"
              ></apexchart>
              <!-- end sales chart -->
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mt-0 pb-2 header-title"
                >Expenditure Graph</h5
              >
              <!-- Sales donut chart -->
              <apexchart
                type="bar"
                height="304"
                :series="expenditure.series"
                :options="expenditure.chartOptions"
              ></apexchart>
              <!-- end sales chart -->
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
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-18 mt-2 mb-1">
                        Contract
                      </h5>
                      <div v-if="createUrl(contractFile)" class="row">
                        <a
                          :href="createUrl(contractFile)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
                            <div class="media">
                              <div class="avatar-sm font-weight-bold mr-3">
                                <span
                                  class="avatar-title rounded bg-soft-primary text-primary"
                                >
                                  <i class="uil-file-plus-alt font-size-18"></i>
                                </span>
                              </div>
                              <div class="media-body">
                                <div class="d-inline-block mt-2"
                                  >Contract.docx</div
                                >
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>

                      <div v-else>
                        <input
                          ref="contract"
                          type="file"
                          @change="handleContractChange"
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                        @click="saveContractFile('contract', contractFile)"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="contractFile = null"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>

                <li class="activity-list">
                  <div
                    class="media d-flex justify-content-between align-items-center"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-18 mt-2 mb-1">
                        Insurance
                      </h5>
                      <div v-if="createUrl(insuranceFile)" class="row">
                        <a
                          :href="createUrl(insuranceFile)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
                            <div class="media">
                              <div class="avatar-sm font-weight-bold mr-3">
                                <span
                                  class="avatar-title rounded bg-soft-primary text-primary"
                                >
                                  <i class="uil-file-plus-alt font-size-18"></i>
                                </span>
                              </div>
                              <div class="media-body">
                                <div class="d-inline-block mt-2"
                                  >Insurance.docx</div
                                >
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
                      <button
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                        @click="saveContractFile('insurance', insuranceFile)"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="insuranceFile = null"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li class="activity-list">
                  <h5 class="font-size-18 mt-2 mb-2">
                    Time Sheet
                  </h5>
                  <div
                    v-for="(deliverable, index) in timeSheet"
                    :key="deliverable.id"
                    class="media d-flex justify-content-between align-items-center mt-1"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-14 mt-2 mb-1">
                        {{ deliverable.name }}
                      </h5>
                      <div
                        v-if="createUrl(timeSheet[index].timesheet)"
                        class="row"
                      >
                        <a
                          :href="createUrl(timeSheet[index].timesheet)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
                            <div class="media">
                              <div class="avatar-sm font-weight-bold mr-3">
                                <span
                                  class="avatar-title rounded bg-soft-primary text-primary"
                                >
                                  <i class="uil-file-plus-alt font-size-18"></i>
                                </span>
                              </div>
                              <div class="media-body">
                                <div class="d-inline-block mt-2"
                                  >{{ deliverable.name }}-Timesheet.docx</div
                                >
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div v-else>
                        <input
                          ref="contract"
                          type="file"
                          @change="
                            (e) => handleTimeSheetChange(e, deliverable.id)
                          "
                        />
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                        @click="saveDelivarableFile(timeSheet[index])"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeTimeSheet(timeSheet[index])"
                      >
                        <i class="uil uil-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li class="activity-list">
                  <h5 class="font-size-18 mt-2 mb-2">
                    Invoice
                  </h5>
                  <div
                    v-for="(deliverable, index) in invoice"
                    :key="deliverable.id"
                    class="media d-flex justify-content-between align-items-center mb-4"
                  >
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-14 mt-2 mb-1">
                        {{ deliverable.name }}
                      </h5>
                      <div v-if="createUrl(invoice[index].invoice)" class="row">
                        <a
                          :href="createUrl(invoice[index].invoice)"
                          target="_blank"
                          class="col-6"
                        >
                          <div class="p-2 border rounded mb-4">
                            <div class="media">
                              <div class="avatar-sm font-weight-bold mr-3">
                                <span
                                  class="avatar-title rounded bg-soft-primary text-primary"
                                >
                                  <i class="uil-file-plus-alt font-size-18"></i>
                                </span>
                              </div>
                              <div class="media-body">
                                <div class="d-inline-block mt-2"
                                  >{{ deliverable.name }}-Invoice.docx</div
                                >
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
                        <input
                          ref="contract"
                          type="file"
                          @change="
                            (e) => handleInvoiceChange(e, deliverable.id)
                          "
                        />
                      </div>
                      <div class="d-flex mt-3">
                        <b-form-group
                          id="input-group-1"
                          label="Status"
                          label-for="input-1"
                        >
                          <b-form-select
                            v-model="deliverable.invoice_status"
                            class="mb-2"
                          >
                            <option
                              v-for="type in ['unpaid', 'paid']"
                              :key="type"
                              :value="type"
                              >{{ type }}</option
                            >
                          </b-form-select>
                        </b-form-group>
                        <b-form-group
                          id="input-group-1"
                          class=" mx-4"
                          label="Payment days"
                          label-for="input-1"
                        >
                          <b-form-input
                            id="input-1"
                            v-model="deliverable.invoice_days"
                            type="number"
                            required
                            placeholder="Days"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="d-flex">
                      <button
                        type="button"
                        class="btn btn-soft-primary btn-sm"
                        @click="saveDelivarableFile(invoice[index])"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        class="btn btn-soft-danger btn-sm mx-2"
                        @click="removeInvoiceFile(invoice[index])"
                      >
                        <i class="uil uil-trash"></i>
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
                        Contract Amount (GH {{ formateAmount(contractAmount) }})
                      </h5>
                    </div>
                  </div>
                  <div class="mt-4">
                    <b-form-group
                      id="input-group-1"
                      label="Professional Fees"
                      label-for="input-1"
                    >
                      <b-form-input
                        id="input-1"
                        v-model="contractForm.contract_amount_profession_fees"
                        type="number"
                        required
                        placeholder="Professional Fees"
                        @blur="saveProjectData(false)"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <b-form-group
                        id="input-group-1"
                        label="Reimbursable"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="contractForm.contract_amount_reimbursable"
                          type="number"
                          required
                          placeholder="Reimbursable"
                          @blur="saveProjectData(false)"
                        ></b-form-input>
                      </b-form-group>
                    </div>

                    <div class="col-md-6">
                      <b-form-group
                        id="input-group-1"
                        label="Tax"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="contractForm.contract_amount_tax_amount"
                          type="number"
                          required
                          placeholder="Tax"
                          @blur="saveProjectData(false)"
                        ></b-form-input>
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
                        Expenditure (GH {{ formateAmount(getExpenditure()) }})
                      </h5>
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="row">
                      <div
                        v-for="deliverable in deliverables"
                        :key="deliverable.id"
                        class="col-md-6"
                      >
                        <b-form-group
                          id="input-group-1"
                          :label="`Professional Fees (${deliverable.name})`"
                          label-for="input-1"
                        >
                          <b-form-input
                            id="input-1"
                            v-model="deliverable.deliverable_professional_fees"
                            type="number"
                            required
                            placeholder="Professional Fees"
                            @blur="
                              handleSaveItem(
                                deliverable.deliverable_professional_fees,
                                'deliverable_professional_fees',
                                deliverable.id
                              )
                            "
                          >
                          </b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <b-form-group
                        id="input-group-1"
                        label="Reimbursable"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="contractForm.expenditure_reimbursable"
                          type="number"
                          required
                          placeholder="Reimbursable"
                          @blur="saveProjectData(false)"
                        ></b-form-input>
                      </b-form-group>
                    </div>

                    <div class="col-md-6">
                      <b-form-group
                        id="input-group-1"
                        label="Finder's fee"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="contractForm.expenditure_finders_fee"
                          type="number"
                          required
                          placeholder="Finder's Fee"
                          @blur="saveProjectData(false)"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-md-12">
                      <b-form-group
                        id="input-group-1"
                        label="Miscellaneous"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="contractForm.expenditure_miscellaneous"
                          type="number"
                          required
                          placeholder="Miscellaneous"
                          @blur="saveProjectData(false)"
                        ></b-form-input>
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
                        Tax (GH {{ formateAmount(getTaxAmount) }})
                      </h5>
                    </div>
                  </div>
                  <div class="mt-4">
                    <b-form-group
                      id="input-group-1"
                      label="Tax Amount"
                      label-for="input-1"
                    >
                      <b-form-input
                        id="input-1"
                        v-model="contractForm.project_tax_amount"
                        type="number"
                        required
                        placeholder="Tax amount"
                        @blur="saveProjectData(false)"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </li>
              </ul>

              <ul class="list-unstyled activity-widget">
                <li class="activity-list">
                  <div class="media d-flex justify-content-between">
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-2 mb-1">
                        Amount Paid (GH {{ formateAmount(getAmountPaid()) }})
                      </h5>
                    </div>
                  </div>
                  <div class="row mt-4">
                    <div
                      v-for="deliverable in deliverables"
                      :key="deliverable.id"
                      class="col-md-6"
                    >
                      <b-form-group
                        id="input-group-1"
                        :label="`Deliverable Fee (${deliverable.name})`"
                        label-for="input-1"
                      >
                        <b-form-input
                          id="input-1"
                          v-model="deliverable.deliverable_fee_amount_paid"
                          type="number"
                          required
                          placeholder="Deliverable Fee"
                          @blur="
                            handleSaveItem(
                              deliverable.deliverable_fee_amount_paid,
                              'deliverable_fee_amount_paid',
                              deliverable.id
                            )
                          "
                        >
                        </b-form-input>
                      </b-form-group>
                    </div>
                  </div>

                  <div class=" mt-4">
                    <div class="media d-flex justify-content-between">
                      <div class="media-body overflow-hidden">
                        <h5 class="font-size-15 mt-2 mb-1">
                          Withholding Tax (GH
                          {{ formateAmount(getWithHoldingTax) }})
                        </h5>
                      </div>
                    </div>
                    <b-form-group
                      id="input-group-1"
                      label="Withholding Tax"
                      label-for="input-1"
                      class="mt-4"
                    >
                      <b-form-input
                        id="input-1"
                        v-model="contractForm.withholding_tax"
                        type="number"
                        required
                        placeholder="Withholding Tax"
                        @blur="saveProjectData(false)"
                      >
                      </b-form-input>
                    </b-form-group>
                  </div>
                  <!-- <div class="row mt-2">
                                        <div v-for="deliverable in getProjectTypesDeliverables" :key="deliverable.id"
                                            class="col-md-6">
                                            <b-form-group id="input-group-1"
                                                :label="`Mobilisation (${deliverable.deliverable_name})`"
                                                label-for="input-1">
                                                <b-form-input id="input-1" v-model="form.prof" type="number" required
                                                    placeholder="Mobilisation"></b-form-input>
                                            </b-form-group>
                                        </div>
                                    </div> -->
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
