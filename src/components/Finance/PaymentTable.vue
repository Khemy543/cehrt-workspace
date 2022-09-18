<template>
  <div class="table-responsive mt-4 mb-0">
    <table class="table mb-0">
      <thead class="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Staff</th>
          <th scope="col">Days</th>
          <th scope="col">Rate</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="task.assignee">
          <td>{{ index + 1 }}</td>
          <td>{{ task.assignee || 'N/A' }}</td>
          <td>{{ task.total_days || 'N/A' }}</td>
          <td>{{ getTaskRate(task.rate_currency, task.rate) }}</td>
          <td
            >{{ task.rate_currency }}
            {{amountFormte(Number(task.total_days * task.rate)) }}</td
          >
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import formateAmount from '@src/utils/formate-money.js'
export default {
  name: 'PaymentTable',
  props: {
    deliverable: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    allTasks() {
      let allTasks = [...this.deliverable.tasks];

      for (const task of this.deliverable.tasks) {
        allTasks = [...allTasks, ...task.subtasks]
      }
      return allTasks
    },
    tasks() {
      let uniqueUsers = []
      for (const task of this.allTasks) {
        const index = task.assignee
          ? uniqueUsers.findIndex((vtask) => vtask.assignee === task.assignee)
          : -10
        if (index > -1) {
          const uTask = uniqueUsers[index]
          uniqueUsers[index] = {
            ...uTask,
            total_days: Number(uTask.total_days + task.allocated_days),
          }
        } else if (index !== -10) {
          uniqueUsers.push({ ...task, total_days: task.allocated_days })
        }
      }
      return uniqueUsers
    },
  },
  methods: {
    getTaskRate(currency, rate) {
      return rate ? `${currency} ${rate}` : 'N/A'
    },
    amountFormte(amount) {
      return formateAmount(amount);
    }
  },
}
</script>
<style scoped></style>
