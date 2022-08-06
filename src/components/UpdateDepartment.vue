<template>
  <b-modal v-model="show" :title="formTitle" title-class="font-18" hide-footer>
    <form @submit.prevent="action(form)">
      <b-form-group id="input-group-1" label="Title" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter title of project type"
          disabled
        ></b-form-input>
      </b-form-group>

      <div class=" d-flex justify-content-between align-items-center mb-4">
        <h5 style="font-size:14px;">Add Position</h5>

        <button
          type="button"
          class="btn btn-primary mr-4 mb-3 mb-sm-0"
          @click="addNewRow"
        >
          <i class="uil-plus mr-1"></i>
        </button>
      </div>
      <div
        v-for="(position, key) in form.positions"
        :key="position.id || position.fake_id"
        class=" row"
      >
        <div class="col-10">
          <b-form-group>
            <b-form-input
              v-model="form.positions[key].name"
              type="text"
              required
              placeholder="Position name"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-2">
          <button
            type="button"
            variant="danger"
            class="btn btn-soft-danger btn-sm"
            @click="tryDeletePostition(position)"
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
    department: {
      type: Object,
      default: () => {},
    },
    formTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        positions: [
          {
            id: `#1`,
            names: '',
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
    department(newValue) {
      this.form.name = (newValue && newValue.name) || ''
      if (newValue && newValue.positions && newValue.positions.length > 0) {
        this.form.positions = newValue.positions.map((position) => ({
            id: position.id,
            name: position.name,
          }))
      } else {
        this.form.positions = [
          {
            id: `#1`,
            name: '',
          },
        ]
      }
    },
  },
  methods: {
    addNewRow() {
      const lastIndex = this.form.positions.length - 1
      if (this.form.positions[lastIndex].name !== '') {
        this.form.positions.push({
          id: `#${lastIndex + 1}`,
          name: '',
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

    async deletePosition(position) {
      try {
        const response = await this.$http.delete(
          `/admin/delete/${position.id}/department/position`
        )

        if (response) {
          const { positions } = this.form

          console.log(positions)

          if (positions.length <= 1) {
            this.form.positions = [
              {
                id: `#1`,
                name: '',
              },
            ]
          } else {
            this.form.positions = positions.filter(
              (item) => item.id !== positions.id
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

    tryDeletePostition(position) {
      if (typeof position.id === 'string' && position.id.includes('#')) {
        const { positions } = this.form
        this.form.positions = positions.filter(
          (item) => item.id !== position.id
        )
      } else {
        return this.deletePosition(position)
      }
    },
  },
}
</script>

<style scoped></style>
