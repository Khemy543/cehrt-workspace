<script>
/**
 * A simple stat widget
 */
export default {
  props: {
    department: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectDepartment() {
      this.$emit('select-department', this.department)
    },
  },
}
</script>

<template>
  <div
    class="card"
    style="cursor:pointer; height: 200px; padding:10px;"
    @click="selectDepartment"
  >
    <div class="align-self-center">
      <img
        :src="department.icon"
        alt=""
        style="height:120px; border-radius:100px;"
      />
    </div>
    <div class="card-body p-0">
      <div class="py-4 px-3">
        <h4
          class="text-muted text-uppercase font-size-12 font-weight-bold"
          style="text-align: center;"
          >{{ department.name }}</h4
        >
      </div>
    </div>
  </div>
</template>
