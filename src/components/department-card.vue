<script>
/**
 * A simple stat widget
 */
export default {
  props: {
    department: {
      type: Object,
      required: true
    }
  },
  methods : {
      selectDepartment(){
          this.$emit('select-department', this.department)
      }
  }
}
</script>

<template>
  <div class="card" style="cursor:pointer;" @click="selectDepartment">
    <div class="card-body p-0">
      <div class="media p-3">
        <div class="media-body">
          <span
            class="text-muted text-uppercase font-size-12 font-weight-bold"
            >{{ department.name }}</span
          >
          <h2 class="mb-0">{{ department.value }}</h2>
        </div>
        <div class="align-self-center">
          <span>
            <feather
              :type="`${department.icon}`"
              :class="`icon-lg align-middle icon-dual-${department.color}`"
            ></feather>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
