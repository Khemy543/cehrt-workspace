<template>
  <b-modal v-model="show" title="Create Task" title-class="font-18" hide-footer>
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
        <b-form-select id="input-1" v-model="form.assignee_id" required>
          <option value="">Select user</option>
          <option
            v-for="user in staff"
            :key="user.id"
            :value="user.id"
            >{{ user.name }}</option
          >
        </b-form-select>
      </b-form-group>

      <b-form-group id="reviewer" label="Reviewer" label-for="input-1">
        <b-form-select id="input-1" v-model="form.reviewer_id" required>
          <option value="">Select reviewer</option>
          <option
            v-for="user in staff"
            :key="user.id"
            :value="user.id"
            >{{ user.name }}</option
          >
        </b-form-select>
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

      <b-form-group id="input-group-1" label="Due date" label-for="input-1">
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
      default: false,
    },
  },
  data() {
    return {
      form: {
        priority: '',
        assignee_id: '',
        reviewer_id: ''
      },
      staff: []
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
  created() {
    this.getStaff()
  },
  methods: {
    async getStaff() {
      try {
        const response = await this.$http.get(`/fetch/all-staff`)

        if (response) {
          this.staff = response.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style scoped></style>
