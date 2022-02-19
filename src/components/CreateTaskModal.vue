<template>
  <b-modal
    v-model="show"
    title="Create Task"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action(form)">
      <b-form-group id="name" label="Task name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter name of task"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="assignees" label="Assign to" label-for="input-1">
        <b-form-input
          id="assignees"
          v-model="form.assignees"
          type="text"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Project Title"
        label-for="input-1"
      >
        <b-form-select id="input-1" v-model="form.priority" required>
          <option value="">Select priority</option>
          <option
            v-for="priority in ['Low', 'Medium', 'High']"
            :key="priority"
            :value="priority"
            >{{ priority }}</option
          >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Due date"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.end_date"
          type="date"
          required
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
      required: true,
    },
    value: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      form: {
          priority: ""
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
      }
    } 
  }
}
</script>

<style scoped></style>
