<template>
  <b-modal v-model="show" :title="formTitle" title-class="font-18" hide-footer>
    <form @submit.prevent="action(form)">
      <b-form-group
        id="input-group-1"
        label="Work flow title"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter title of work flow"
        ></b-form-input>
      </b-form-group>

      <div class=" d-flex justify-content-between align-items-center mb-4">
        <h5 style="font-size:14px;">Add work flow tasks</h5>

        <button
          type="button"
          class="btn btn-primary mr-4 mb-3 mb-sm-0"
          @click="addNewRow"
        >
          <i class="uil-plus mr-1"></i>
        </button>
      </div>
      <div
        v-for="(task, key) in form.tasks"
        :key="task.id || task.fake_id"
        class=" row"
      >
        <div class="col-10">
          <b-form-group>
            <b-form-input
              v-model="form.tasks[key].task_name"
              type="text"
              required
              placeholder="Task name"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-2">
          <button
            type="button"
            variant="danger"
            class="btn btn-soft-danger btn-sm"
            @click="tryDeleteTask(task)"
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
    workflow: {
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
        tasks: [
          {
            fake_id: `#${1}`,
            task_name: '',
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
    workflow(newValue) {
      this.form.name = (newValue && newValue.name) || ''
      this.form.tasks = (newValue && newValue.work_flow_tasks) || [
        {
          fake_id: `#${1}`,
          task_name: '',
        },
      ]
    },
  },
  methods: {
    addNewRow() {
      const lastIndex = this.form.tasks.length - 1
      if (this.form.tasks[lastIndex].task_name !== '') {
        this.form.tasks.push({
          fake_id: `#${1}`,
          task_name: '',
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

    async deleteTask(task) {
      try {
        const response = await this.$http.delete(
          `/delete/${task.id}/workflow/task`
        )

        if (response) {
          const { tasks } = this.form
          this.form.tasks = tasks.filter((item) => item.id !== task.id)
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

    tryDeleteTask(task) {
      if (task.id) {
        return this.deleteTask(task)
      } else {
        const { tasks } = this.form
        this.form.tasks = tasks.filter((item) => item !== task)
      }
    },
  },
}
</script>

<style scoped></style>
