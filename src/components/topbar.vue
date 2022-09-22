<script>
import { authComputed } from '@state/helpers'
import { PublicClientApplication } from '@azure/msal-browser';
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
	/* components: {
		VuePerfectScrollbar,
	}, */
	props: {
		user: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		isMenuOpened: {
			type: Boolean,
			default: false,
		},

		department: {
			type: Object,
			required: false,
			default: () => ({})
		}

	},
	data() {
		return {
			account: undefined,
			github: 'https://github.com/cmatskas',
			twitter: 'https://twitter.com/christosmatskas',
			signin: 'https://microsoft.com',
		}
	},
	computed: {
		...authComputed,
		initials() {
			return this.$store ? this.$store.state.auth.userInitials : '' || '';
		}
	},
	created() {
		this.$msalInstance = new PublicClientApplication(
			this.$store.state.auth.msalConfig,
		);
	},
	mounted() {
		const accounts = this.$msalInstance.getAllAccounts();
		if (accounts.length === 0) {
			return;
		}
		this.account = accounts[0];
		this.$emitter.emit('login', this.account);
	},
	methods: {
		toggleMenu() {
			this.$parent.toggleMenu()
		},
		async SignIn() {
			await this.$msalInstance
				.loginPopup({})
				.then(() => {
					const myAccounts = this.$msalInstance.getAllAccounts();
					this.account = myAccounts[0];
					this.$emitter.emit('login', this.account);
				})
				.catch(error => {
					console.error(`error during authentication: ${error}`);
				});
		},
		async SignOut() {
			await this.$msalInstance
				.logout({})
				.then(() => {
					this.$emitter.emit('logout', 'logging out');
				})
				.catch(error => {
					console.error(error);
				});
		},
	},
}
</script>

<template>
	<!-- Topbar Start -->
	<div class="navbar navbar-expand flex-column flex-md-row navbar-custom">
		<div class="container-fluid">
			<!-- LOGO -->
			<a href="/" class="navbar-brand mr-0 mr-md-2 logo">
				<span class="logo-lg">
					<img src="@assets/images/cehrt-logo.png" alt="logo" height="50px" style="object-fit: cover; object-position: center;"/>
				</span>
				<span class="logo-sm">
					<img src="@assets/images/cehrt-small-logo.png" alt="logo" />
				</span>
			</a>

			<ul class="navbar-nav bd-navbar-nav flex-row list-unstyled menu-left mb-0">
				<li class>
					<button class="button-menu-mobile open-left disable-btn" :class="{ open: isMenuOpened }"
						@click="toggleMenu">
						<feather type="menu" class="menu-icon align-middle"></feather>
						<feather type="x" class="close-icon"></feather>
					</button>
				</li>
			</ul>

			<ul class="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0">

				<div>
					<b-dropdown class="float-right" variant="black" right toggle-class="p-0">
						<template v-slot:button-content>
							<div class="d-flex">
								<div style="width:40px; height:40px; border-radius:100px;"
									class="mr-2 d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold">
									{{ initials }}</div>
								<h6>{{ department.name }}</h6>
							</div>
						</template>

						<b-dropdown-item to="/profile" class="notify-item">
							<feather type="user" class="icon-dual icon-xs mr-2 align-middle"></feather>
							<span>{{ user.firstname }} {{ user.lastname }}</span>
						</b-dropdown-item>

						<b-dropdown-item to="/departments" class="notify-item">
							<feather type="repeat" class="icon-dual icon-xs mr-2 align-middle"></feather>
							<span>Switch Department</span>
						</b-dropdown-item>

						<b-dropdown-divider></b-dropdown-divider>

						<b-dropdown-item to="/logout" class="notify-item">
							<feather type="log-out" class="icon-dual icon-xs mr-2 align-middle"></feather>
							<span>Logout</span>
						</b-dropdown-item>
					</b-dropdown>
				</div>

				<b-nav-item-dropdown right class="notification-list align-self-center profile-dropdown"
					toggle-class="nav-user mr-0">
					<template v-slot:button-content>
						<div class="media user-profile">
							<img src="@assets/images/users/avatar-7.jpg" alt="user-image"
								class="rounded-circle align-self-center" />
							<div class="media-body text-left">
								<h6 class="pro-user-name ml-2 my-0">
									<span>{{ user.name }}</span>
									<span class="pro-user-desc text-muted d-block mt-1">Administrator</span>
								</h6>
							</div>
							<feather type="chevron-down" class="ml-2 align-self-center"></feather>
						</div>
					</template>
					<b-dropdown-item href="/pages/profile" class="notify-item p-0">
						<feather type="user" class="icon-dual icon-xs mr-2"></feather>
						<span>My Account</span>
					</b-dropdown-item>

					<b-dropdown-item href="javascript:void(0);" class="notify-item p-0">
						<feather type="settings" class="icon-dual icon-xs mr-2"></feather>
						<span>Settings</span>
					</b-dropdown-item>

					<b-dropdown-item href="javascript:void(0);" class="notify-item p-0">
						<feather type="help-circle" class="icon-dual icon-xs mr-2"></feather>
						<span>Support</span>
					</b-dropdown-item>

					<b-dropdown-item href="pages-lock-screen.html" class="notify-item p-0">
						<feather type="lock" class="icon-dual icon-xs mr-2"></feather>
						<span>Lock Screen</span>
					</b-dropdown-item>

					<b-dropdown-divider></b-dropdown-divider>

					<b-dropdown-item to="/logout" class="notify-item p-0">
						<feather type="log-out" class="icon-dual icon-xs mr-2"></feather>
						<span>Logout</span>
					</b-dropdown-item>
				</b-nav-item-dropdown>
			</ul>
		</div>
	</div>
	<!-- end Topbar -->
</template>

<style lang="scss">
.noti-scroll {
	height: 220px;
}

.ps>.ps__scrollbar-y-rail {
	width: 8px !important;
	background-color: transparent !important;
}

.ps>.ps__scrollbar-y-rail>.ps__scrollbar-y,
.ps.ps--in-scrolling.ps--y>.ps__scrollbar-y-rail>.ps__scrollbar-y,
.ps>.ps__scrollbar-y-rail:active>.ps__scrollbar-y,
.ps>.ps__scrollbar-y-rail:hover>.ps__scrollbar-y {
	width: 6px !important;
}

.button-menu-mobile {
	outline: none !important;
}
</style>
