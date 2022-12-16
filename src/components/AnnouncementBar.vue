<template>
  <div
    class="sidebar"
    :style="{ right: `${width}px` }"
    :class="{ 'padding-show': width >= 0 }"
    v-click-outside="clickOutside"
  >
    <div class="top">
      <h5>Announcements</h5>
      <a href="javascript:void(0)" class="closebtn" @click="closeNav">×</a>
    </div>

    <div class="mt-4">
      <div
        class="announcement-card "
        v-for="announcement in announcements"
        :key="announcement.id"
      >
        <p class="date">{{ formateDateTime( announcement.created_at || new Date()) }}</p>
        <h5>{{ announcement.title }}</h5>
        <p v-html="announcement.message"></p>
      </div>
    </div>

    <div v-if="loading" class=" d-flex justify-content-center">
      <b-spinner type="grow" variant="primary"></b-spinner>
    </div>

    <div v-if="links.next" class="row mb-3 mt-2">
      <div class="col-12">
        <div class="text-center">
          <div class="btn btn-white" @click="getAnnouncements(links.next, status)">
            <feather
              type="loader"
              class="icon-dual icon-xs mr-2 align-middle"
            ></feather
            >Load more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formateDateTime } from '@utils/format-date'
export default {
  name: 'AnnouncementBar',
  props: {
    width: {
      type: Number,
      default: -350,
    },
  },
  data() {
    return {
      announcements: [],
      page: 1,
      links: {},
      loading: false
    }
  },
  created() {
    this.getAnnouncements()
  },
  methods: {
    formateDateTime,
    closeNav() {
      this.$emit('set-width', -350)
    },
    clickOutside() {
      console.log(this.width)
    },
    async getAnnouncements(link = null) {
      try {
        this.loading = true;
        const response = await this.$http.get( link || `admin/announcement`)

        if (response) {
          const { data, meta, links } = response.data
          if(this.page > 1) {
              this.announcements = [...this.announcements, ...data]
          }else {
            this.announcements = data;
          }
          this.links = links
          this.page = meta.current_page
        }
      } catch (error) {
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }finally {
        this.loading = false
      }
    },
  },
  watch: {
    width() {
        this.getAnnouncements()
    }
  }
}
</script>
<style>
.sidebar {
  height: 100%;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background-color: #eff1f5;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 40px;
  border-radius: 20px;
  padding-bottom: 30px;
  width: 350px;
  overflow-y: scroll;
}

.padding-show {
  padding-left: 20px;
  padding-right: 20px;
}

.sidebar .top {
  display: flex;
  justify-content: space-between;
  font-size: 36px;
  align-items: center;
  position: fixed;
  background-color: #eff1f5;
  top: 0;
  width: 310px;
}

.sidebar .announcement-card {
  border-radius: 16px;
  padding: 10px 16px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e9e9f6;
  background-color: white;
}

.sidebar .date {
  font-size: 10px;
  text-align: right;
}
</style>
