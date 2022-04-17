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
                'badge-warning': `${projectStatus}` === 'Pending',
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
        <p class="text-muted mb-4">{{ project.description }}</p>
      </div>
      <div class="card-body border-top">
        <div>
          <div>
            <ul class="list-inline">
              <li class="list-inline-item pr-1">
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
