<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mt-0 header-title">Outstanding Payments</h6>
            <button v-if="!view" class="btn btn-primary" @click="show = true">Add</button>
          </div>
          <div v-if="outstandingpayment.length > 0" class="table-responsive mt-4 mb-0">
            <table class="table">
              <thead class="thead-light">
                <tr class="table mb-0">
                  <th scope="col">#</th>
                  <th scope="col">Name / Item</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Purpose</th>
                  <th v-if="!view" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in outstandingpayment" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td
                    >GHS {{ item.amount && Number(item.amount).toFixed(2) }}</td
                  >
                  <td>{{ item.purpose }}</td>
                  <td v-if="!view">
                    <button
                      type="button"
                      variant="danger"
                      class="btn btn-soft-danger btn-sm"
                      @click="deleteOutstandingPayment(item)"
                    >
                      <i class="uil uil-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center mt-5">
            <h4>No outstanding Payments</h4>
            <div>
              <img :src="require('@assets/svgs/empty.svg')" alt="no projects" style="width: 200px"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      v-model="show"
      title="Add Outstanding Payment"
      title-class="font-18"
      hide-footer
      size="md"
    >
      <form @submit.prevent="addOutstandingPayment">
        <b-form-group id="name" label="Name" label-for="name">
          <b-form-input
            id="name"
            v-model="form.name"
            required
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="amount" label="Amount" label-for="amount">
          <b-form-input
            id="amount"
            v-model="form.amount"
            required
            placeholder="Amount"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Purpose">
          <b-form-textarea
            id="purpose"
            v-model="form.purpose"
            placeholder="Purpose of payment"
            rows="4"
          >
          </b-form-textarea>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: 'OutStandingPayment',
  props: {
    view: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      outstandingpayment: [],
      form: {},
      show: false,
    }
  },
  created() {
    this.getOutstandingPayments()
  },
  methods: {
    async getOutstandingPayments() {
      try {
        const response = await this.$http.get(
          `/finance/fetch/project/${this.$route.params.id}/outstanding-payment`
        )

        if (response) {
          this.outstandingpayment = response.data
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
    deleteOutstandingPayment(item) {
      this.$swal({
        title: 'Are you sure you want to delete outsanding payment?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `/finance/delete/${item.id}/project-outstanding-payment`
            )
            if (response) {
              this.outstandingpayment = this.outstandingpayment.filter(
                (payment) => payment.id !== item.id
              )
              this.$bvToast.toast('Outstanding payment deleted', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
                toastClass: 'text-white',
              })
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
        }
      })
    },
    async addOutstandingPayment() {
      try {
        const response = await this.$http.post(
          `finance/add/project/${this.$route.params.id}/outstanding-payment`,
          this.form
        )

        if (response) {
          this.outstandingpayment.push(response.data)
          this.form = {}
          this.show = false
          this.$bvToast.toast('Outstanding payment created', {
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
  },
}
</script>
