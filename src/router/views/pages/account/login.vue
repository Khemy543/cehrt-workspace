<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

/**
 * Login component
 */
export default {
	page: {
		title: 'Log in',
		meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
	},
	components: { Layout },
	data() {
		return {
			email: '',
			password: '',
			authError: null,
			tryingToLogIn: false,
			isAuthError: false,
		}
	},
	methods: {
		...authMethods,
		// Try to log the user in with the email
		// and password they provided.
		tryToLogIn() {
			this.tryingToLogIn = true
			// Reset the authError if it existed.
			this.authError = null;
			const { redirectFrom } = this.$route.query;
			return this.logIn({
				email: this.email,
				password: this.password,
			})
				.then((token) => {
					this.tryingToLogIn = false
					this.isAuthError = false
					// Redirect to the originally requested page, or to the home page
					this.$router.push({ name: 'departments', query : { redirectFrom } })
				})
				.catch((error) => {
					this.tryingToLogIn = false
					this.authError = error.response ? error.response.data.error : 'Something happened, please try again later'
					this.isAuthError = true
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
				<div class="row justify-content-center">
					<div class="col-xl-10">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-md-6 p-5">
										<div class="mx-auto mb-5">
											<a routerLink="/">
												<img src="@assets/images/cehrt-small-logo.png" alt="logo" height="50"/>
												<span class="d-inline h5 ml-2 text-logo" style="color:#009a44;">CEHRT WORKSPACE</span>
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">Welcome back!</h6>
										<p class="text-muted mt-1 mb-4">
											Enter your email address and password to access your workspace
										</p>

										<b-alert
											v-model="isAuthError"
											variant="danger"
											dismissible
											>{{ authError }}</b-alert
										>

										<b-form
											class="authentication-form"
											@submit.prevent="tryToLogIn"
										>
											<div class="form-group">
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather
																type="mail"
																class="align-middle icon-dual"
															></feather>
														</span>
													</div>
													<b-form-input
														id="input-1"
														v-model="email"
														type="text"
														required
														placeholder="Enter email"
													></b-form-input>
												</div>
											</div>
											<div class="form-group mt-4">
												<label class="form-control-label">Password</label>
												<router-link
													to="forget-password"
													class="float-right text-muted text-unline-dashed ml-1"
													>Forgot your password?</router-link
												>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather
																type="lock"
																class="align-middle icon-dual"
															></feather>
														</span>
													</div>
													<b-form-input
														id="password"
														v-model="password"
														type="password"
														required
														placeholder="Enter your password"
													></b-form-input>
												</div>
											</div>
											<div class="form-group mb-4">
												<div class="custom-control custom-checkbox">
													<input
														id="checkbox-signin"
														type="checkbox"
														class="custom-control-input"
														checked
													/>
													<label
														class="custom-control-label"
														for="checkbox-signin"
													>
														Remember me
													</label>
												</div>
											</div>
											<b-form-group id="button-group" class="mt-4 mb-1">
												<b-button
													type="submit"
													variant="primary"
													class="btn-block"
													>Log In</b-button
												>
											</b-form-group>
										</b-form>
									</div>
									<div class="col-lg-6 d-none d-md-inline-block">
										<div class="auth-page-sidebar">
											<div class="overlay"></div>
											<div class="auth-user-testimonial">
												<p class="font-size-24 font-weight-bold text-white mb-1"
													>Cerht Workspace</p
												>
												<p class="lead"
													>"Making things simple to use"</p
												>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- end card-body -->
						</div>
						<!-- end card -->
						<!-- end row -->
					</div>
					<!-- end col -->
				</div>
				<!-- end row -->
			</div>
			<!-- end container -->
		</div>
	</Layout>
</template>

<style lang="scss" module></style>
