<template>
  <b-modal
    :visible="show"
    title="Create Work Flow"
    :hide="close"
    :close="close"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action(form)">
      <b-form-group
        id="input-group-1"
        label="Project Title"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Title of Project"
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

      <b-form-group
        v-for="(task, key) in form.tasks"
        :id="`task-${task.id}`"
        :key="task.id"
      >
        <b-form-input
          :id="`input-${task.id}`"
          v-model="form.tasks[key].task_name"
          type="text"
          required
          placeholder="Task name"
        ></b-form-input>
      </b-form-group>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
      action: {
          type: Function,
          required: true
      },
      show: {
        type: Boolean,
        default: false
      }
  },
  data() {
    return {
      form: {
        name: '',
        tasks: [
          {
            id: 1,
            task_name: '',
          },
        ],
      }
    }
  },
  methods: {
    close() {},
    addNewRow() {
      const lastIndex = this.form.tasks.length - 1;
      if (this.form.tasks[lastIndex].task_name !== '') {
        this.form.tasks.push({
          id: this.form.tasks[lastIndex].id + 1,
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
  },
}
</script>

<style scoped></style>
