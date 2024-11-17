<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import graph from '@/src/msalConfig/graph'

/**
 * Logout component
 */
export default {
	page: {
		title: 'Log out',
		meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
	},
	components: { Layout },
    created(){
        this.tryLogout()
    },
	methods: {
		...authMethods,
		// Try to log out the user 
		tryLogout() {
			return this.logOut({
				email: this.email,
				password: this.password,
			})
				.then((token) => {
					this.isAuthError = false
					// Redirect to login page
					this.clearToken()
				})
				.catch( async () => {
                    this.clearToken();
				})
		},
	},
}
</script>

<template>
	<Layout>
		<!-- end row -->
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center align-items-center vh-100">
                    <div class=" text-center">
                         <b-spinner type="grow" variant="primary"></b-spinner>
                        <div>Loggin out...</div>
                    </div>
				</div>
				<!-- end row -->
			</div>
			<!-- end container -->
		</div>
	</Layout>
</template>

<style lang="scss" module></style>
