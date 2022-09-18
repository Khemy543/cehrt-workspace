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
            <td>{{ task.total_days }}</td>
            <td>{{ task.rate_currency }} {{ task.rate }}</td>
            <td>{{ task.rate_currency }} {{ Number(task.total_days * task.rate)  }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'PaymentTable',
  props: {
    tasks: {
        type: Array,
        default: () => ([])
    }
  }
}
</script>
<style scoped></style>
