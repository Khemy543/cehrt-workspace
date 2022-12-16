<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'Announcements',
  page: {
    title: 'Announcements',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    VueEditor,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Announcements',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Announcements',
          to: '/user-management/staff',
          active: true,
        },
      ],
      loading: false,
      announcements: [],
      show: false,
      formtitle: 'Publish Announcement',
      editorOptions: {
        theme: 'bubble',
      },
      form: {},
    }
  },
  created() {
    this.getAnnouncements()
  },
  methods: {
    async getAnnouncements() {
      try {
        this.loading = true
        const response = await this.$http.get('admin/announcement')

        if (response) {
          const { data, meta } = response.data

          this.announcements = data
        }
      } catch (error) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      } finally {
        this.loading = false
      }
    },
    async createAnnouncement() {
      if (this.formtitle === 'Edit Annoucement') {
        return this.editAnnoucement()
      }
      try {
        const response = await this.$http.post('admin/announcement', this.form)

        if (response) {
          this.announcements.unshift(response.data)
          this.show = false
          this.$bvToast.toast('Announcment published successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
          this.form = {}
        }
      } catch (error) {
        console.log(error)
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    async editAnnoucement() {
      try {
        const response = await this.$http.patch(
          `admin/announcement/${this.form.id}`,
          this.form
        )

        if (response) {
          const index = this.announcements.findIndex(
            (item) => item.id === this.form.id
          )

          if (index > -1) {
            this.$set(this.announcements, index, response.data)
          }

          this.show = false
          this.formtitle = 'Publish Announcement'
          this.$bvToast.toast('Announcment updated successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        }
      } catch (error) {
        console.log(error)
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
        })
      }
    },
    deleteAnnouncement(annoucement) {
      this.$swal({
        title: 'Do you want to delete this announcement?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
        confirmButtonColor: '#ff5c75',
        denyButtonColor: '#4b4b5a',
      }).then(async ({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          try {
            const response = await this.$http.delete(
              `admin/announcement/${annoucement.id}`
            )

            if (response) {
              this.announcements = this.annoucements.filter(
                (item) => item.id !== annoucement.id
              )
              this.$bvToast.toast('Announcment deleted successfully', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false,
                variant: 'success',
              })
            }
          } catch {
            this.$bvToast.toast('Something happened, Please try again later', {
              title: 'Error',
              autoHideDelay: 5000,
              appendToast: false,
              variant: 'danger',
            })
          }
        }
      })
    },
    openModal(annoucement) {
      this.form = {
        ...annoucement,
      }
      this.show = true
      this.formtitle = 'Edit Annoucement'
    },
  },
}
</script>
<template>
  <Layout>
    <div class="page-title align-items-center d-flex justify-content-between">
      <h4 class="mb-1 mt-0">Announcements</h4>

      <div class="mt-4 mt-md-0">
        <button
          type="button"
          class="btn btn-danger mr-4 mb-3 mb-sm-0"
          @click="show = true"
        >
          <i class="uil-plus mr-1"></i> Publish Announcement
        </button>
      </div>
    </div>
    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>
    <div v-else class="row">
      <div v-if="announcements.length > 0" class="col-lg-12">
        <div class="row">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="col-xl-4 col-lg-6"
            style="height: 356px; margin-bottom: 20px;"
          >
            <div class="card border h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h5>
                    <a href="javascript: void(0)" class="text-dark">{{
                      announcement.title
                    }}</a>
                  </h5>
                  <b-dropdown
                    variant="link"
                    toggle-class="p-0 text-muted arrow-none"
                    right
                  >
                    <template v-slot:button-content>
                      <i class="uil uil-ellipsis-v font-size-14"></i>
                    </template>
                    <b-dropdown-item
                      href="javascript: void(0);"
                      variant="secondary"
                      @click="openModal(announcement)"
                    >
                      <i class="uil uil-edit mr-2"></i>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      href="javascript: void(0);"
                      variant="danger"
                      @click="deleteAnnouncement(announcement)"
                    >
                      <i class="uil uil-trash-alt mr-2"></i>Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </div>

                <p class="mt-2" v-html="announcement.message"></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="w-100 d-flex justify-content-center">
        <img
          :src="require('@assets/svgs/empty.svg')"
          alt="no projects"
          style="width:30%"
        />
      </div>
    </div>

    <b-modal
      v-model="show"
      :title="formtitle"
      title-class="font-18"
      hide-footer
      size="lg"
    >
      <form @submit.prevent="createAnnouncement">
        <div>
          <b-form-group
            id="input-group-1"
            label="Announcement Head"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.title"
              type="text"
              required
              placeholder="Announcement head"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div class="row">
          <div class="col-12">
            <label for="">Message</label>
            <div id="taskDesk">
              <vue-editor
                v-model="form.message"
                :editor-options="editorOptions"
              ></vue-editor>
            </div>
          </div>
          <!-- end col -->
        </div>
        <div class="d-flex justify-content-end mt-4">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
    </b-modal>
  </Layout>
</template>
