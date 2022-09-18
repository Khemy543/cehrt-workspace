<template>
  <div class="card">
    <div class="card-body">
      <h6 class="mt-0 header-title">Summary of Project Finances </h6>

      <div class="contact-details mt-2 row">
        <div class="col-md-6">
          <h4>Contract Details</h4>

          <ul>
            <li
              >Professional Fee - GHS
              {{ formateMoney(project.contract_amount_profession_fees) }}</li
            >
            <li
              >Reimbursable - GHS
              {{ formateMoney(project.contract_amount_reimbursable) }}</li
            >
            <li
              >Tax Amount - GHS
              {{ formateMoney(project.contract_amount_tax_amount) }}</li
            >
            <li>Contract Amount - GHS {{ formateMoney(contractAmount) }}</li>
          </ul>
        </div>
        <div class="col-md-6">
          <h4>Expenditure Details</h4>

          <ul>
            <li
              >Professional Fee - GHS
              {{ formateMoney(totalProfessionalFees) }}</li
            >
            <li
              >Reimbursable - GHS
              {{ formateMoney(project.expenditure_reimbursable) }}</li
            >
            <li
              >Finder's Fee - GHS
              {{ formateMoney(project.expenditure_finders_fee) }}</li
            >
            <li
              >Miscellaneous - GHS
              {{ formateMoney(project.expenditure_miscellaneous) }}</li
            >
            <li>Expenditure Amount - GHS {{ formateMoney(expenditure) }}</li>
          </ul>
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
              <tr
                v-for="deliverable in project.deliverables"
                :key="deliverable.id"
              >
                <td>{{ deliverable.name }}</td>
                <td>{{ deliverable.deliverable_fee_amount_paid }} (%)</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-5">
        <h4>Invoice</h4>
        <div class="table-responsive mb-0">
          <table class="table mb-0">
            <thead class="thead-light table-bordered">
              <tr>
                <th scope="col">Deliverable</th>
                <th scope="col">Status</th>
                <th scope="col">Days Left</th>
                <th scope="col">Date Paid</th>
                <th scope="col">File</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="deliverable in project.deliverables"
                :key="deliverable.id"
              >
                <td>{{ deliverable.name }}</td>
                <td
                  ><div
                    class="badge badge-danger"
                    :class="{
                      'badge-success':
                        `${deliverable.invoice_status}` === 'unpaid' ||
                        `${deliverable.invoice_status}` === null,
                    }"
                    >{{
                      deliverable.invoice_status
                        ? deliverable.invoice_status
                        : 'unpaid'
                    }}</div
                  ></td
                >
                <td>N/A</td>
                <td>N/A</td>
                <td>
                  <a
                    v-if="deliverable.invoice"
                    :href="deliverable.invoice"
                    target="_blank"
                  >
                    <img
                      :src="getIcon('invoice.pdf')"
                      alt="invoice file"
                      class="icon-image"
                    />
                  </a>
                  <span v-else>N/A</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import formateAmount from '@src/utils/formate-money.js'
import { getIcon } from '@/src/utils/helpers.js'

export default {
  name: 'ProjectSummary',
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
    formateMoney(amount) {
      return formateAmount(amount)
    },
    getIcon,
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
