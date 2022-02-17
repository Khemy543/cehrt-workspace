<script>
import { layoutComputed, authMethods } from '@state/helpers'
import Topbar from '@components/topbar'
import SideBar from '@components/side-bar'
import Footer from '@components/footer'

export default {
  components: { Topbar, SideBar, Footer },
  data() {
    return {
      isMenuCondensed: false,
      isMobileMenuOpened: false,
      department: this.$store
        ? this.$store.state.auth.userDepartment
        : {} || {},
      form: {},
    }
  },
  computed: {
    ...layoutComputed,
    user() {
      return this.$store ? this.$store.state.auth.currentUser : {} || {}
    },
    show() {
      return this.user.must_change_password ? this.user.must_change_password === 1 : false
    }
  },
  created: () => {
    document.body.classList.remove('authentication-bg')
    document.body.classList.remove('authentication-bg-pattern')
    document.body.removeAttribute('data-layout')
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        navigator.userAgent
      )
    ) {
      if (window.screen.width >= 728 && window.screen.width <= 1028) {
        document.body.classList.add('left-side-menu-condensed')
      }
    }
  },
  methods: {
    ...authMethods,
    toggleMenu() {
      document.body.classList.toggle('left-side-menu-condensed')
      this.isMenuCondensed = !this.isMenuCondensed
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
          navigator.userAgent
        )
      ) {
        this.isMobileMenuOpened = !this.isMobileMenuOpened
        document.body.classList.toggle('sidebar-enable')
        if (window.screen.width <= 425) {
          document.body.classList.remove('left-side-menu-condensed')
        }
      }
    },
    hideRightSidebar() {
      document.body.classList.remove('right-bar-enabled')
    },
    tryChangePassword() {
		const { newPassword, confirmPassword} = this.form;

		if(newPassword !== confirmPassword) {
			return this.$bvToast.toast('Passwords do not match!', {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
		}
	
      return this.changePassword({ ...this.form, firstTime: true })
        .then((data) => {
          this.$bvToast.toast('Password changed successfully', {
            title: 'Success',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'success',
          })
        })
        .catch(() => {
          this.$bvToast.toast('Something happend, please try again', {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        })
    },
  },
}
</script>

<template>
  <div id="wrapper">
    <Topbar :user="user" :is-menu-opened="isMobileMenuOpened" />
    <SideBar
      :is-condensed="isMenuCondensed"
      :user="user"
      :department="department"
    />
    <b-modal
      :visible="show"
      title="Change Password"
      title-class="font-18"
      hide-footer
      cancel-disabled
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
    >
      <form @submit.prevent="tryChangePassword">
        <b-form-group id="input-group-1" label="Password" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.newPassword"
            type="password"
            required
            placeholder="New Password"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-1"
          label="Confirm Password"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
          ></b-form-input>
        </b-form-group>
        <button type="submit" class="btn btn-primary">Change Password</button>
      </form>
      <template v-slot:modal-footer>
        <div></div>
      </template>
    </b-modal>
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
      <div class="content">
        <!-- Start Content-->
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
