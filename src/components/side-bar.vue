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
			}
		}
	},
	computed: {
		...authComputed,
		isSupervisor() {
			return this.user.isSupervisor || false;
		}
	}
}
</script>

<template>
	<!-- ========== Left Sidebar Start ========== -->
	<div class="left-side-menu">
		<div class="sidebar-content mt-2">
			<VuePerfectScrollbar
				v-if="!isCondensed"
				v-once
				class="slimscroll-menu"
				:settings="settings"
			>
				<div id="sidebar-menu">
					<Appmenu :department="department" :is-supervisor="isSupervisor"/>
				</div>
			</VuePerfectScrollbar>
			<div v-else id="sidebar-menu">
				<Appmenu :department="department" :is-supervisor="isSupervisor"/>
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
