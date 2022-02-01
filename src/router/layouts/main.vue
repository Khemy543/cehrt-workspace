<script>
import { layoutComputed } from '@state/helpers'
import Topbar from '@components/topbar'
import SideBar from '@components/side-bar'
import Footer from '@components/footer'

export default {
	components: { Topbar, SideBar, Footer },
	data() {
		return {
			isMenuCondensed: false,
			isMobileMenuOpened: false,
			user: this.$store ? this.$store.state.auth.currentUser : {} || {},
			department: this.$store ? this.$store.state.auth.userDepartment : {} || {}
		}
	},
	computed: {
		...layoutComputed,
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
