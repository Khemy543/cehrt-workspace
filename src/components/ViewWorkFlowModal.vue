<template>
  <b-modal
    v-model="show"
    :title="workFlow && workFlow.name"
    title-class="font-18"
    hide-footer
    centered
  >
    <div>
      <div class="row mt-3">
        <div class="col-lg-12">
          <div class="left-timeline pl-4">
            <ul class="list-unstyled events">
              <li v-for="(task, index) in workFlow && workFlow.work_flow_tasks" :key="task.id" class="event-list">
                <div>
                  <div class="media">
                    <div class="event-date text-center mr-4">
                      <div class="avatar-sm rounded-circle bg-soft-primary">
                        <span
                          class="font-size-16 avatar-title text-primary font-weight-semibold"
                          >{{ index + 1 }}</span
                        >
                      </div>
                    </div>
                    <div class="media-body">
                      <div class="card d-inline-block">
                        <div class="card-body">
                          <h5 class="mt-0">{{ task.task_name }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    workFlow: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Boolean,
      required: true,
    },
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
}
</script>

<style scoped></style>
