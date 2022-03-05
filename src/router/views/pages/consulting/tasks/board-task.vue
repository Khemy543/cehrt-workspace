<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  computed: {
    initals() {
      return this.task.assignee.name ? this.task.assignee.name.match(/\b(\w)/g).join('').toUpperCase() : "GA";
    }
  },
  methods: {
    showEditModal() {
      this.$emit('showEditModal', this.task)
    }
  }
}
</script>
<template>
  <div class="card border mb-0">
    <div class="card-body p-3">
      <b-dropdown
        variant="link"
        class="float-right"
        toggle-class="p-0 text-muted arrow-none"
      >
        <template v-slot:button-content>
          <i class="uil uil-ellipsis-v font-size-14"></i>
        </template>
        <b-dropdown-item href="javascript: void(0);" @click="showEditModal"
          ><i class="uil uil-edit-alt mr-2"></i>Edit</b-dropdown-item
        >
        <b-dropdown-item v-if="task.assignee.id" href="javascript: void(0);"
          ><i class="uil uil-sync mr-2"></i>Change Assignee</b-dropdown-item
        >
        <b-dropdown-item v-else href="javascript: void(0);"
          ><i class="uil uil-user-plus mr-2"></i>Assign To</b-dropdown-item
        >
        <b-dropdown-item v-if="task.reviewer.id" href="javascript: void(0);"
          ><i class="uil uil-sync mr-2"></i>Change Reviewer</b-dropdown-item
        >
        <b-dropdown-item v-else href="javascript: void(0);"
          ><i class="uil uil-exit mr-2"></i>Add Reviewer</b-dropdown-item
        >
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item href="javascript: void(0);" variant="danger">
          <i class="uil uil-trash mr-2"></i>Delete
        </b-dropdown-item>
      </b-dropdown>

      <h6 class="mt-0 mb-2 font-size-15">
        <a href="javascript: void(0);" class="text-body">{{ task.name }}</a>
      </h6>

      <span v-if="task.priority === 'High'" class="badge badge-soft-danger"
        >High</span
      >

      <span v-else-if="task.priority === 'Medium'" class="badge badge-soft-info"
        >{{ task.priority }}</span
      >

      <span v-else class="badge badge-soft-success">Low</span>

      <p class="mb-0 mt-4">
        <!-- <img
          :src="task.user"
          alt="user-img"
          class="avatar-xs rounded-circle mr-2"
        /> -->

        <span v-if="task.assignee.id" class="avatar-xs rounded-circle mr-2 bg-primary mb-2 p-2 text-white">
          {{initals}}
        </span>

        <span v-else >
          Unassigned
        </span>
        <br />
        <br/>
        <span class="text-nowrap align-middle font-size-13 mr-2">
          <i class="uil uil-comments-alt text-muted mr-1"></i
          >{{ task.comments || 0 }}
        </span>

        <span class="text-nowrap align-middle font-size-13">
          <i class="uil uil-check-square mr-1 text-muted"></i
          >{{ task.subTasks || 0 }}
        </span>
        <small class="float-right text-muted">
          <i class="uil uil-calendar-alt text-muted mr-1"></i
          >{{ task.formatted_end_date }}
          
          <span v-if="task.is_due" class="text-nowrap align-middle font-size-15">
          <i class="uil uil-windsock ml-1 text-danger"></i
          >
        </span></small>

      </p>
    </div>
    <!-- end card-body -->
  </div>
</template>
