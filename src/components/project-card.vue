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
      return this.project.project_sector ? this.project.project_sector.name : ''
    },
    projectStatus() {
      return this.project.status || 'Pending'
    },
    isProjectPage() {
      return this.$route.name === 'Projects'
    },
    assignees() {
      const uniqueIds = []
      const unique = this.project.assignees.filter(element => {
        const isDuplicate = uniqueIds.includes(element.id);

        if (!isDuplicate) {
          uniqueIds.push(element.id);

          return true;
        }

        return false;
      });

      return unique;
    }
  },
  methods: {
    getInitials(name) {
      return name
          .match(/\b(\w)/g)
          .join('')
          .toUpperCase()
    },
  }
}
</script>

<template>
  <router-link
    :tag="isProjectPage ? 'a' : 'div'"
    :to="isProjectPage ? `details/${project.id}` : '#'"
    class="col-xl-4 col-lg-6"
  >
    <div class="card border" style="height: 380px">
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
        <p class="text-uppercase font-size-12 mb-2 text-primary">{{
          project.client
        }}</p>
        <h5>
          <a href="javascript: void(0)" class="text-dark title_text">{{ project.name }}</a>
        </h5>
        <p class="text-muted mb-4 description_text">{{
          project.description
        }}</p>
      </div>
      <div class="card-body position-absolute" style="bottom: 0; left: 0; right: 0">
        <div v-if="assignees.length > 0" class="route d-flex" >
          <div
              v-for="user in assignees"
              :id="`${user.id}-assignee`"
              :key="user.id"
              class="rounded-circle default-avatar member-overlap-item d-flex justify-content-center align-items-center"

          >
            <b-tooltip
            :target="`${user.id}-assignee`"
            triggers="hover"
            placement="bottom"
            >{{ user.name }}</b-tooltip>
            {{ getInitials(user.name) }}
          </div>
        </div>
        <div v-else>
          No Assignees
        </div>
        <div class=" mt-3">
          <div class="border-top pt-4">
            <ul class="list-inline">
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
              variant="success"
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
#grid_groups_wrapper {
  max-width: 800px;
}

.title_text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.default-avatar {
  background-color: #5369f8;
  font-weight: 500;
  color: #fff;
  font-size: 16px;
}

.default-avatar,
.member-overlap-item {
  height: 50px;
  width: 50px;
}

.table td,
.table th {
  padding: 0.75rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
}

.member-overlap-item {
  margin-right: -10px;
  border: 2px solid #fff;
}

.group {
  min-height: 40px;
  height: auto;
  line-height: 1.6rem;
}

.grid-icon {
  vertical-align: middle;
  line-height: 1;
}

.group-class {
  height: 1rem;
  line-height: 4rem;
  vertical-align: middle;
}
</style>
