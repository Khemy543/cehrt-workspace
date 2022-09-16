<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => { }
    },
    initials: {
      type: String,
      default: ''
    }
  }
}
</script>
<template>
  <div class="card">
    <div class="card-body">
      <div class="text-center mt-3">
        <!-- <img
					src="@assets/images/users/avatar-7.jpg"
					alt
					class="avatar-lg rounded-circle"
        />-->
        <div class="w-100 d-flex justify-content-center">
          <div
            style="width:60px; height:60px; border-radius:100px;"
            class="mr-2 d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold"
          >{{ initials }}</div>
        </div>
        <h5 class="mt-2 mb-0">{{ user.firstname }} {{ user.other_names }} {{ user.lastname }}</h5>
        <h6 class="text-muted font-weight-normal mt-2 mb-0">SIN: {{ user.staff_id }}</h6>
        <!-- <h6 class="font-weight-normal mt-1 mb-4"></h6> -->
      </div>

      <!-- profile  -->
      <div class="mt-3 pt-2 border-top">
        <h4 class="mb-3 font-size-15">Contact Information</h4>
        <div class="table-responsive">
          <table class="table table-borderless mb-0 text-muted">
            <tbody>
              <tr>
                <th scope="row">Email</th>
                <td>{{ user.email }}</td>
              </tr>
              <tr>
                <th scope="row">Phone</th>
                <td>{{ user.phone_number }}</td>
              </tr>
              <tr v-if="user.alternate_phone">
                <th scope="row">Work Phone</th>
                <td>{{ user.phone_number }}</td>
              </tr>
              <tr>
                <th scope="row">Work Phone</th>
                <td>{{ user.phone_number }}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>{{ user.address }}</td>
              </tr>
              <tr>
                <th scope="row">Rate</th>
                <td>{{ user.rate_currency }} {{ Number(user.rate).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3 pt-2 border-top">
        <h4 class="mb-3 font-size-15">Department</h4>
        <label
          v-for="department in user.departments"
          :key="department.id"
          class="badge badge-soft-primary mr-2"
        >{{ department.name }}</label>
      </div>
    </div>
  </div>
  <!-- end card -->
</template>
