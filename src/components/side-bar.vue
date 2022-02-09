<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { authComputed } from '@state/helpers'
import Appmenu from './app-menu'

/**
 * Left sidebar component - contains mainly the application menu
 */
export default {
	components: { VuePerfectScrollbar, Appmenu },
	props: {
		isCondensed: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		department: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	data() {
		return {
			settings: {
				minScrollbarLength: 60,
			},
			initials: this.$store? this.$store.state.auth.userInitials : '' || ''
		}
	},
	computed: {
		...authComputed,
	}
}
</script>

<template>
	<!-- ========== Left Sidebar Start ========== -->
	<div class="left-side-menu">
		<div class="media user-profile mt-2 mb-2 d-flex align-items-center">
			<div 
			style="width:40px; height:40px; border-radius:100px;"
			class="mr-2 d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold">
				{{ initials }}
			</div>

			<div class="media-body">
				<h6 class="pro-user-name mt-0 mb-0">{{ user.firstname }} {{ user.lastname }}</h6>
				<span class="pro-user-desc">{{ department.name }}</span>
			</div>
			<b-dropdown variant="black" class="align-self-center" toggle-class="p-0">
				<template v-slot:button-content>
					<feather type="chevron-down" class="align-middle"></feather>
				</template>

				<b-dropdown-item to="/profile" class="notify-item">
					<feather
						type="user"
						class="icon-dual icon-xs mr-2 align-middle"
					></feather>
					<span>My Account</span>
				</b-dropdown-item>

				<!-- <b-dropdown-item href="javascript:void(0);" class="notify-item">
					<feather
						type="settings"
						class="icon-dual icon-xs mr-2 align-middle"
					></feather>
					<span>Settings</span>
				</b-dropdown-item> -->

				<!-- <b-dropdown-item href="javascript:void(0);" class="notify-item">
					<feather
						type="help-circle"
						class="icon-dual icon-xs mr-2 align-middle"
					></feather>
					<span>Support</span>
				</b-dropdown-item> -->

				<b-dropdown-item to="/departments" class="notify-item">
					<feather
						type="repeat"
						class="icon-dual icon-xs mr-2 align-middle"
					></feather>
					<span>Switch Department</span>
				</b-dropdown-item>

				<b-dropdown-divider></b-dropdown-divider>

				<b-dropdown-item to="/logout" class="notify-item">
					<feather
						type="log-out"
						class="icon-dual icon-xs mr-2 align-middle"
					></feather>
					<span>Logout</span>
				</b-dropdown-item>
			</b-dropdown>
		</div>

		<div class="sidebar-content">
			<VuePerfectScrollbar
				v-if="!isCondensed"
				v-once
				class="slimscroll-menu"
				:settings="settings"
			>
				<div id="sidebar-menu">
					<Appmenu :department="department" />
				</div>
			</VuePerfectScrollbar>
			<div v-else id="sidebar-menu">
				<Appmenu :department="department" />
			</div>
		</div>
		<!-- Sidebar -left -->
	</div>
	<!-- Left Sidebar End -->
</template>

<style lang="scss">
.slimscroll-menu {
	height: 100%;
}
.ps > .ps__scrollbar-y-rail {
	width: 8px !important;
	background-color: transparent !important;
}
.ps > .ps__scrollbar-y-rail > .ps__scrollbar-y,
.ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail > .ps__scrollbar-y,
.ps > .ps__scrollbar-y-rail:active > .ps__scrollbar-y,
.ps > .ps__scrollbar-y-rail:hover > .ps__scrollbar-y {
	width: 6px !important;
}
</style>
