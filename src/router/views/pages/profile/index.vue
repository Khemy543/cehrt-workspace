<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import UserCard from './user-card'
import EditProfile from './edit-profile.vue'
import ChangePassword from './change-password.vue'
export default {
  page: {
    title: 'Profile',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    UserCard,
    EditProfile,
	ChangePassword
  },
  data() {
    return {
      title: 'Profile',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    }
  },
  computed: {
    user() {
      return this.$store ? this.$store.state.auth.currentUser : {} || {}
    },
    initials() {
      return this.$store ? this.$store.state.auth.userInitials : '' || ''
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-4">
        <UserCard :user="user" :initials="initials" />
      </div>

      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <b-tabs class="navtab-bg" pills justified>
              <b-tab title="Edit Profile" active>
                <EditProfile :user="user" :initials="initials" />
              </b-tab>
              <b-tab title="Change Password">
                <ChangePassword />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
