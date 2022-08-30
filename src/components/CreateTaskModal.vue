<template>
  <b-modal v-model="show" :title="formTitle" title-class="font-18" hide-footer>
    <form @submit.prevent="action(form)">
      <b-form-group id="name" label="Task name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          required
          placeholder="Enter name of task"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="assignees" label="Assign to" label-for="input-1">
        <b-form-select id="input-1" v-model="form.assignee_id">
          <option value="">Select user</option>
          <option v-for="user in staff" :key="user.id" :value="user.id">{{
            user.name
          }}</option>
        </b-form-select>
      </b-form-group>

      <b-form-group id="reviewer" label="Reviewer" label-for="input-1">
        <b-form-select id="input-1" v-model="form.reviewer_id">
          <option value="">Select reviewer</option>
          <option v-for="user in staff" :key="user.id" :value="user.id">{{
            user.name
          }}</option>
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Task priority"
        label-for="input-1"
      >
        <b-form-select id="input-1" v-model="form.priority" required>
          <option value="">Select priority</option>
          <option
            v-for="priority in ['low', 'medium', 'high']"
            :key="priority"
            :value="priority"
            style="text-transform: capitalize;"
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
import { dateFormate, isDateAfter } from '../utils/format-date'

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
    formTitle: {
      type: String,
      default: 'Craete Task',
    },
    task: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        priority: '',
        assignee_id: '',
        reviewer_id: '',
        start_date: dateFormate(new Date())
      },
      staff: [],
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
    getConsultingId() {
      return this.$store.state.auth.userDepartment.id
    }
  },
  watch: {
    task(newTask) {
      this.form = {}
      if (newTask) {
        this.form = {
          ...newTask,
          priority: newTask.priority.toLowerCase() || '',
          assignee_id: newTask.assignee.id || '',
          reviewer_id: newTask.reviewer.id || '',
        }
      } else {
        this.form = {
          priority: '',
          assignee_id: '',
          reviewer_id: '',
        }
      }
    },
    form(newForm) {
      if (isDateAfter(newForm.start_date, newForm.end_date)) {
        this.form.end_date = this.form.start_date
      }
    }
  },
  created() {
    this.getStaff()
  },
  methods: {
    async getStaff() {
      try {
        const response = await this.$http.get(`/fetch/${this.getConsultingId}/department-staff`)

        if (response) {
          this.staff = response.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style scoped></style>
