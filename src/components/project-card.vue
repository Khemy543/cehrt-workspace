<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    projectSector() {
      return this.project.project_sector? this.project.project_sector.name : ''
    },
    projectStatus() {
      return this.project.status || 'Pending'
    },
    isProjectPage() {
      return this.$route.name === 'Project';
    }
  }
}
</script>

<template>
  <router-link :to="isProjectPage ? `details/${project.id}` : '#'" class="col-xl-4 col-lg-6">
    <div class="card border">
      <div class="card-body">
        <slot name="status">
          <div
              class="badge badge-success float-right"
              :class="{
                'badge-warning': `${projectStatus}` === 'pending',
                'badge-danger': `${projectStatus}` === 'overdue',
              }"
              >{{ projectStatus }}</div
            >
          </slot>
        <p
          class="text-uppercase font-size-12 mb-2 text-primary"
          >{{ project.client }}</p
        >
        <h5 cl>
          <a href="javascript: void(0)" class="text-dark">{{ project.name }}</a>
        </h5>
        <p class="text-muted mb-4 description_text">{{ project.description }}</p>

        <div>
          <a href="javascript: void(0);">
            <img
              src="@assets/images/users/avatar-2.jpg"
              alt
              class="avatar-sm m-1 rounded-circle"
            />
          </a>
          <a href="javascript: void(0);">
            <img
              src="@assets/images/users/avatar-2.jpg"
              alt
              class="avatar-sm m-1 rounded-circle"
            />
          </a>
        </div>
      </div>
      <div class="card-body border-top">
        <div>
          <div>
            <ul class="list-inline">
              <!-- <li class="list-inline-item pr-1">
                <a
                  :id="`date-tooltip-${project.id}`"
                  href="javascript: void(0)"
                  class="text-muted d-inline-block bg-transparent"
                >
                  <b-tooltip
                    :target="`date-tooltip-${project.id}`"
                    triggers="hover"
                    placement="top"
                    >Due date</b-tooltip
                  >
                  <i class="uil uil-calender mr-1"></i>
                  {{ project.end_date }}
                </a>
              </li> -->
              <li class="list-inline-item pr-1">
                <a
                  :id="`task-tooltip-${project.id}`"
                  href="javascript: void(0)"
                  class="text-muted d-inline-block bg-transparent"
                >
                  <b-tooltip
                    :target="`task-tooltip-${project.id}`"
                    triggers="hover"
                    placement="top"
                    >Tasks</b-tooltip
                  >
                  <i class="uil uil-bars mr-1"></i>
                  {{ project.tasks || 0 }}
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  :id="`comment-tooltip-${project.id}`"
                  href="javascript: void(0)"
                  class="text-muted d-inline-block bg-transparent"
                >
                  <b-tooltip
                    :target="`comment-tooltip-${project.id}`"
                    triggers="hover"
                    placement="top"
                    >Comments</b-tooltip
                  >
                  <i class="uil uil-comments-alt mr-1"></i>
                  {{ project.comments || 0 }}
                </a>
              </li>
              <li class="list-inline-item pr-2">
                <a
                  :id="`date-tooltip-${project.id}`"
                  href="javascript: void(0)"
                  class="text-muted d-inline-block bg-transparent"
                >
                  <b-tooltip
                    :target="`date-tooltip-${project.id}`"
                    triggers="hover"
                    placement="top"
                    >Completed Tasks</b-tooltip
                  >
                  <i class="uil uil-check-square mr-1"></i>
                  {{ project.progress || 0 }}%
                </a>
              </li>
            </ul>
          </div>
          <div class="pt-2">
            <b-progress
              :value="project.progress || 0"
              variant="danger"
              height="5px"
              class="m-0"
            ></b-progress>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<style scoped>
.description_text {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>