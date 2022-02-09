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
    }
  }
}
</script>

<template>
  <router-link :to="`details/1`" class="col-xl-4 col-lg-6">
    <div class="card border">
      <div class="card-body">
        <div
            class="badge badge-success float-right"
            :class="{
              'badge-warning': `${projectStatus}` === 'Pending',
            }"
            >{{ projectStatus }}</div
          >
        <p
          class="text-uppercase font-size-12 mb-2 text-primary"
          >{{ project.client }}</p
        >
        <h5 cl>
          <a href="javascript: void(0)" class="text-dark">{{ project.name }}</a>
        </h5>
        <p class="text-muted mb-4">{{ project.description }}</p>

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
                    >Due date</b-tooltip
                  >
                  <i class="uil uil-calender mr-1"></i>
                  {{ project.end_date }}
                </a>
              </li>
              <li class="list-inline-item pr-2">
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
                  {{ project.comment || 0 }}
                </a>
              </li>
            </ul>
          </div>
          <div class="pt-2">
            <b-progress
              :value="project.progress || 10"
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
