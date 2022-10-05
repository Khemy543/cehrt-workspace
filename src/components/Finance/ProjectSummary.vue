<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mt-0 header-title">Summary of Project Finances </h6>
          <button class="btn btn-primary" @click="toggleEdit">Edit</button>
        </div>

        <div class="contact-details mt-5">
          <div class="table-responsive mb-0">
            <table class="table mb-0">
              <thead class="thead-light table-bordered">
                <tr>
                  <th scope="col">CONTRACT DETAILS</th>
                  <th scope="col">EXPENDITURE DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    >Professional Fee - GHS
                    {{
                      formateMoney(project.contract_amount_profession_fees)
                    }}</td
                  >
                  <td
                    >Professional Fee - GHS
                    {{ formateMoney(totalProfessionalFees) }}</td
                  >
                </tr>
                <tr>
                  <td
                    >Reimbursable - GHS
                    {{ formateMoney(project.contract_amount_reimbursable) }}</td
                  >
                  <td
                    >Reimbursable - GHS
                    {{ formateMoney(project.expenditure_reimbursable) }}</td
                  >
                </tr>
                <tr>
                  <td
                    >Tax Amount - GHS
                    {{ formateMoney(project.contract_amount_tax_amount) }}</td
                  >
                  <td
                    >Finder's Fee - GHS
                    {{ formateMoney(project.expenditure_finders_fee) }}</td
                  >
                </tr>

                <tr>
                  <td
                    ><b
                      >Contract Amount - GHS
                      {{ formateMoney(contractAmount) }}</b
                    ></td
                  >
                  <td
                    >Tax - GHS
                    {{ formateMoney(project.expenditure_miscellaneous) }}</td
                  >
                </tr>
                <tr>
                  <td></td>
                  <td
                    ><b
                      >Expenditure Amount - GHS
                      {{ formateMoney(expenditure) }}</b
                    ></td
                  >
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class=" mt-5">
          <h4
            >Amount Paid By Client
            <span>({{ formateMoney(amountPaid) }})</span></h4
          >
          <div class="table-responsive mb-0">
            <table class="table mb-0">
              <thead class="thead-light table-bordered">
                <tr>
                  <th scope="col" rowspan="2">Deliverable</th>
                  <th scope="col" rowspan="2">Amount</th>
                  <th scope="col" colspan="2" style="text-align:center"
                    >Taxes Paid</th
                  >
                </tr>
                <tr>
                  <th scope="col">VAT/NHIL/GETFUND</th>
                  <th scope="col">Withholding Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="deliverable in deliverables" :key="deliverable.id">
                  <td>{{ deliverable.name }}</td>
                  <td
                    >{{
                      formateMoney(deliverable.deliverable_fee_amount_paid) ||
                        'N/A'
                    }}
                    ({{ deliverable.amount_paid_percentage || 0 }}%)</td
                  >
                  <td>{{
                    deliverable.vat_nhil_get_fund
                      ? `GHS ${formateMoney(deliverable.vat_nhil_get_fund)}`
                      : 'N/A'
                  }}</td>
                  <td>{{
                    deliverable.with_holding_tax
                      ? `GHS ${formateMoney(deliverable.with_holding_tax)}`
                      : 'N/A'
                  }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-5">
            <h4>Invoice</h4>
            <div class="table-responsive mb-0">
              <table class="table mb-0">
                <thead class="thead-light table-bordered">
                  <tr>
                    <th scope="col">Deliverable</th>
                    <th scope="col">Status</th>
                    <th scope="col">Submitted Date</th>
                    <th scope="col">Days Left</th>
                    <th scope="col">Date Paid</th>
                    <th scope="col">File</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="deliverable in invoices" :key="deliverable.id">
                    <td>{{ deliverable.name }}</td>
                    <td
                      ><div
                        class="badge badge-success"
                        :class="{
                          'badge-danger':
                            `${deliverable.invoice_status}` === 'unpaid',
                        }"
                        >{{
                          deliverable.invoice_status
                            ? deliverable.invoice_status
                            : 'unpaid'
                        }}</div
                      ></td
                    >
                    <td>{{
                      deliverable.invoice_submitted_date
                        ? formateDate(deliverable.invoice_submitted_date)
                        : 'N/A'
                    }}</td>
                    <td>{{
                      deliverable.invoice_status === 'unpaid'
                        ? daysLeft(
                            deliverable.invoice_submitted_date,
                            deliverable.invoice_days
                          )
                        : 'N/A'
                    }}</td>
                    <td>{{
                      deliverable.invoice_payment_date
                        ? formateDate(deliverable.invoice_payment_date)
                        : 'N/A'
                    }}</td>
                    <td>
                      <File
                        v-if="deliverable.invoice"
                        :path="deliverable.invoice"
                        :name="`Invoice - ${deliverable.name}`"
                        type="pdf"
                      />
                      <span v-else>N/A</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mt-3 card">
          <div class="card-body">
            <OutStandingPayments :view="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import formateAmount from '@src/utils/formate-money.js'
import {
  getAddedDate,
  dateDifference,
  formateDate,
} from '@/src/utils/format-date'
import File from '../file.vue'
import OutStandingPayments from './OutStandingPayments.vue'

export default {
  name: 'ProjectSummary',
  components: { File, OutStandingPayments },
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    contractAmount: {
      type: String,
      default: null,
    },
    amountPaid: {
      type: String,
      default: null,
    },
    expenditure: {
      type: String,
      default: null,
    },
    invoices: {
      type: Array,
      default: () => [],
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    deliverables: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalProfessionalFees() {
      let total = 0

      for (const dev of this.project.deliverables) {
        total = total + Number(dev.deliverable_professional_fees)
      }

      return total.toFixed(2)
    },
  },
  methods: {
    toggleEdit() {
      this.$emit('toggle-edit')
    },
    formateMoney(amount) {
      return formateAmount(amount)
    },
    daysLeft(date, days) {
      const dueDate = getAddedDate(date, days)
      const daysLeft = dateDifference(dueDate, new Date())
      if (daysLeft > 0) {
        return `${daysLeft} days left`
      } else if (daysLeft === 0) {
        return `Is due today`
      } else if (!date) {
        return 'N/A'
      } else {
        return `Is due ${Math.abs(daysLeft)} ago`
      }
    },
    formateDate,
  },
}
</script>
<style scoped>
.header-title {
  text-transform: uppercase;
}
h4 {
  text-transform: uppercase;
  font-size: 15px;
  margin-top: 30px;
}

.contact-details ul {
  padding-left: 0 !important;
}

.contact-details ul li {
  list-style: none;
}
</style>
