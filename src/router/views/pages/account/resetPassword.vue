<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

export default {
	page: {
		title: 'Forget Password',
		meta: [
			{ name: 'description', content: `Forget Password to ${appConfig.title}` },
		],
	},
	components: { Layout },
	data() {
		return {
			error:"",
			tryingToReset: false,
			isResetError: false,
			isSuccess: false,
			successMessage: null,
            form: {}
		}
	},
	computed: {},
	methods: {
		...authMethods,
		// Try to register the user in with the email, fullname
		// and password they provided.
		tryToReset() {
			const { password, confirm_password:confirmPassword } = this.form;

			if(password !== confirmPassword) {
				this.error = 'Passwords must be the same'
				this.isResetError = true
				return;
			}
			this.tryingToReset = true;
			this.form = { ...this.form, token: this.$route.query.token };
			// Reset the authError if it existed.
			this.error = null
			return this.resetPassword(this.form)
				.then((data) => {
					this.tryingToReset = false
					this.isResetError = false
					this.$bvToast.toast('Password reset successful', {
						title: 'Success',
						autoHideDelay: 5000,
						appendToast: false,
						variant: 'success',
					})
					this.$router.push({ name: 'login' })
				})
				.catch((error) => {
					this.tryingToReset = false
					this.error = error ? error.response.data.message : ''
					this.isResetError = true
					this.isSuccess = false
				})
		},
	},
}
</script>

<template>
	<Layout>
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-6">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-12 p-5">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo"
													>CEHRT WORKSPACE</h3
												>
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">Reset Password</h6>
										<p class="text-muted mt-1 mb-5"
											>Enter a new password.</p
										>

										<b-alert
											v-model="isResetError"
											variant="danger"
											dismissible
											>{{ error }}</b-alert
										>

										<b-alert
											v-model="isSuccess"
											variant="success"
											dismissible
											>{{ successMessage }}</b-alert
										>
										<form
											action="#"
											class="authentication-form"
											@submit.prevent="tryToReset"
										>
											<div class="form-group">
												<label class="form-control-label">New Password</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="icon-dual"></feather>
														</span>
													</div>
													<input
														id="password"
														v-model="form.password"
														type="password"
														class="form-control"
														placeholder="Password"
													/>
												</div>
											</div>

                                            <div class="form-group">
												<label class="form-control-label">Confirm Password</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="icon-dual"></feather>
														</span>
													</div>
													<input
														id="cpassword"
														v-model="form.confirm_password"
														type="password"
														class="form-control"
														placeholder="Confirm password"
													/>
												</div>
											</div>

											<div class="form-group mb-0 text-center">
												<button class="btn btn-primary btn-block" type="submit"
													>Submit</button
												>
											</div>
										</form>
									</div>
								</div>
							</div>
							<!-- end card-body -->
						</div>
						<!-- end card -->

						<div class="row mt-3">
							<div class="col-12 text-center">
								<p class="text-muted">
									Back to
									<router-link
										tag="a"
										to="/login"
										class="text-primary font-weight-bold ml-1"
										>Login</router-link
									>
								</p>
							</div>
							<!-- end col -->
						</div>
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
