<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import TaskDetail from './task-detail'

export default {
  page: {
    title: 'Tasks List',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, TaskDetail },
  data() {
    return {
      title: 'Tasks List',
      items: [
        {
          text: 'Cerht',
          href: '/',
        },
        {
          text: 'Projects',
          href: '/',
        },
        {
          text: 'Deliverables',
          href: '/',
        },
        {
          text: 'Task',
          active: true,
        },
      ],
      task: null,
      loading: false,
      subtasks: []
    }
  },
  created() {
    const { hasSubTask } = this.$route.query
    this.getTask()
    if(hasSubTask) {
      this.getSubTasks()
    }
  },
  methods: {
    async getTask() {
      try {
        const isSubtask = this.$route.query.subtask;
        const url = isSubtask ? `/fetch/${this.$route.params.id}/sub-task` : `/fetch/${this.$route.params.id}/task`;
        this.loading = true
        const response = await this.$http.get(url);

        if (response) {
          this.task = response.data
          this.loading = false
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
    },

    async getSubTasks() {
      try {
        const response = await this.$http.get(`/fetch/${this.$route.params.id}/task/sub-tasks`)

        if (response) {
          this.subtasks = response.data;
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
    },

    updateTask(task) {
      this.task = task
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <!-- task details -->
      <div class="col-xl-6">
        <TaskDetail :task="task" :subtasks="subtasks" @updateTask="updateTask"/>
      </div>
      <div class="col-xl-6">
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <!-- cta -->
                <div class="row mt-3">
                  <div class="col">
                    <h5 class="mb-2 font-size-16">Comments</h5>

                    <div
                      v-for="comment of task.comments"
                      :key="`comment-${comment.id}`"
                      class="media mt-3 p-1 border-bottom pb-2"
                    >
                      <img
                        :src="comment.author_avatar"
                        class="mr-2 rounded-circle"
                        height="36"
                        alt=""
                      />
                      <div class="media-body">
                        <h5 class="mt-0 mb-0 font-size-14">
                          <span class="float-right text-muted font-size-12">{{
                            comment.posted_on
                          }}</span>
                          {{ comment.author }}
                        </h5>
                        <p class="mt-1 mb-0 text-muted">
                          {{ comment.text }}
                        </p>
                      </div>
                    </div>
                    <!-- end comment -->
                  </div>
                  <!-- end col -->
                </div>
                <div class="row mt-2">
                  <div class="col">
                    <div class="border rounded">
                      <form action="#" class="comment-area-box">
                        <textarea
                          rows="3"
                          class="form-control border-0 resize-none"
                          placeholder="Your comment..."
                        ></textarea>
                        <div class="p-2 bg-light">
                          <div class="float-right">
                            <button
                              type="submit"
                              class="btn btn-sm btn-success"
                            >
                              <i class="uil uil-message mr-1"></i>Submit
                            </button>
                          </div>
                          <div>
                            <a href="#" class="btn btn-sm px-1 btn-light">
                              <i class="uil uil-cloud-upload"></i>
                            </a>
                            <a href="#" class="btn btn-sm px-1 btn-light">
                              <i class="uil uil-at"></i>
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                    <!-- end .border-->
                  </div>
                  <!-- end col-->
                </div>
                <!-- end row -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>
  </Layout>
</template>
