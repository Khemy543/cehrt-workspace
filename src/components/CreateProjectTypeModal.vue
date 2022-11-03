<template>
  <b-modal
    v-model="show"
    :title="formTitle"
    title-class="font-18"
    hide-footer
    :cancel-disabled="loading"
    :hide-header-close="loading"
    :no-close-on-backdrop="loading"
    :no-close-on-esc="loading"
  >
    <form @submit.prevent="action(form)">
      <b-form-group id="input-group-1" label="Title" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter title of project type"
        ></b-form-input>
      </b-form-group>

      <div class=" d-flex justify-content-between align-items-center mb-4">
        <h5 style="font-size:14px;">Add Project Deliverables</h5>

        <button
          type="button"
          class="btn btn-primary mr-4 mb-3 mb-sm-0"
          @click="addNewRow"
        >
          <i class="uil-plus mr-1"></i>
        </button>
      </div>
      <div
        v-for="(deliverable, key) in form.deliverables"
        :key="deliverable.id || deliverable.fake_id"
        class=" row"
      >
        <div class="col-10">
          <b-form-group>
            <b-form-input
              v-model="form.deliverables[key].deliverable_name"
              type="text"
              required
              placeholder="Deliverable name"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-2">
          <button
            type="button"
            variant="danger"
            class="btn btn-soft-danger btn-sm"
            @click="tryDeleteDeliverable(deliverable)"
          >
            <i class="uil uil-trash-alt"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    action: {
      type: Function,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    projectType: {
      type: Object,
      default: () => {},
    },
    formTitle: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        deliverables: [
          {
            fake_id: 1,
            deliverable_name: '',
          },
        ],
      },
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    projectType(newValue) {
      this.form.name = (newValue && newValue.name) || ''
      if (newValue.deliverables && newValue.deliverables.length > 0) {
        this.form.deliverables = newValue.deliverables
      } else {
        this.form.deliverables = [
          {
            id: `#1`,
            deliverable_name: '',
          },
        ]
      }
    },
  },
  methods: {
    addNewRow() {
      const lastIndex = this.form.deliverables.length - 1
      if (this.form.deliverables[lastIndex].deliverable_name !== '') {
        this.form.deliverables.push({
          id: `#${lastIndex + 1}`,
          deliverable_name: '',
        })
      } else {
        this.$bvToast.toast('Please fill current field', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },

    async deleteDeliverable(deliverable) {
      try {
        const response = await this.$http.delete(
          `delete/${deliverable.id}/project/type/deliverable`
        )

        if (response) {
          const { deliverables } = this.form

          if (deliverables.length <= 1) {
            this.form.deliverables = [
              {
                fake_id: 1,
                deliverable_name: '',
              },
            ]
          } else {
            this.form.deliverables = deliverables.filter(
              (item) => item.id !== deliverable.id
            )
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

    tryDeleteDeliverable(deliverable) {
      if (deliverable.id) {
        return this.deleteDeliverable(deliverable)
      } else {
        const { deliverables } = this.form
        this.form.tadeliverablessks = deliverables.filter(
          (item) => item !== deliverable
        )
      }
    },
  },
}
</script>

<style scoped></style>
