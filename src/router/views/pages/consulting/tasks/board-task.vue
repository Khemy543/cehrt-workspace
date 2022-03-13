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
    },
    priority() {
      return this.task.priority.toLowerCase()
    }
  },
  methods: {
    showEditModal() {
      this.$emit('showEditModal', this.task)
    },
    goTotask() {
      return this.$router.push(`/task/${this.task.id}/details?hasSubTask=${this.task.hasSubTask}&subtask=false`)
    },
    deleteTask() {
      this.$swal({
        title: 'Do you want to delete task?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if(isConfirmed) {
          try {
            const response = await this.$http.delete(`/delete/${this.task.id}/task`);

            if(response) {
              this.$bvToast.toast('Task deleted successful', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
              this.$emit('deleteTask', this.task)
            }
          } catch (error) {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
              toastClass: 'text-white',
            })
          }
        }
      })
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
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item variant="danger" @click="deleteTask">
          <i class="uil uil-trash mr-2"></i>Delete
        </b-dropdown-item>
      </b-dropdown>
      <div @click="goTotask">
      <h6 class="mt-0 mb-2 font-size-15">
        <a href="javascript: void(0);" class="text-body">{{ task.name }}</a>
      </h6>

      <span v-if="priority === 'high'" class="badge badge-soft-danger"
        >High</span
      >

      <span v-else-if="priority === 'medium'" class="badge badge-soft-info"
        >Medium</span
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
    </div>
    <!-- end card-body -->
  </div>
</template>
