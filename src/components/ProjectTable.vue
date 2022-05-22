<template>
  <div class="card">
    <div class="card-body p-0">
      <div class="card-title border-bottom p-3 mb-0 w-100">
      <div class="row page-title" style="padding:0">
        <div class="col-sm-12 col-xl-12">
          <h4>Projects</h4>
        </div>
      </div>
        <table class="table mb-0">
          <thead class="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Proposal</th>
            <th scope="col">Client</th>
            <th scope="col">Project Type</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(project, index) in projects"
              :key="project.id"
              :title="project.description"
              style="cursor: pointer"
              @click="goToProjet(project.id)"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ project.name }}</td>
            <td>{{ project.client }}</td>
            <td>
              {{
                project.project_type && project.project_type.name
              }}
            </td>
            <td>
              <span
                  class="badge"
                  :class="{
                          'badge-soft-warning':
                            `${project.status}` === 'pending',
                          'badge-soft-success':
                            `${project.status}` === 'completed',
                          'badge-soft-danger':
                            `${project.status}` === 'overdue',
                           'badge-soft-primary':
                            `${project.status}` === 'active',
                        }"
              >{{ project.status }}</span
              >
            </td>
          </tr>
          </tbody>
        </table>
  </div>

  </div>
  </div>
</template>

<script>
export default {
  props: {
    projects: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    goToProjet(id) {
      this.$router.push(`/project/details/${id}`)
    }
  }
}
</script>

<style scoped>

</style>