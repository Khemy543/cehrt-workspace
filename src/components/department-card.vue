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
      <div class="media py-4 px-3">
        <div class="media-body d-flex align-items-center">
          <span
            class="text-muted text-uppercase font-size-12 font-weight-bold"
            >{{ department.name }}</span
          >
        </div>
        <div class="align-self-center">
            <img :src="department.icon" alt="" style="height:60px; border-radius:100px;" />
        </div>
      </div>
    </div>
  </div>
</template>
