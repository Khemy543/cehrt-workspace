<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { FormWizard, TabContent } from 'vue-form-wizard'

import {
  required,
  email,
  minLength,
  sameAs,
  maxLength,
  minValue,
  maxValue,
  numeric,
  url,
  alphaNum,
} from 'vuelidate/lib/validators'
import PersonalIformation from './personal-information.vue'
import WorkInformation from './work-information.vue'

export default {
  page: {
    title: 'Add Staff',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, PersonalIformation, FormWizard, TabContent, WorkInformation },
  data() {
    return {
      title: 'Add Staff',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'Add Staff',
          active: true,
        },
      ],
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      submit: false,
      submitted: false,
      formsubmit: false,
      typesubmit: false,
    }
  },
  validations: {
    form: {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') },
    },
    horizontal: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') },
      website: { required, url },
    },
    range: {
      minlen: { required, minLength: minLength(6) },
      maxlength: { required, maxLength: maxLength(6) },
      between: { required, minLength: minLength(5), maxLength: maxLength(10) },
      minval: { required, minValue: minValue(6) },
      maxval: { required, maxValue: maxValue(6) },
      rangeval: { required, minValue: minValue(6), maxValue: maxValue(100) },
      expr: { required },
    },
    typeform: {
      name: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') },
      email: { required, email },
      url: { required, url },
      digit: { required, numeric },
      number: { required, numeric },
      alphanum: { required, alphaNum },
      textarea: { required },
    },
  },
  methods: {
    validateStep(name) {
			var refToValidate = this.$refs[name]
			return refToValidate.validate()
		},
    /**
     * Basic Form submit
     */
    handleSubmit(e) {
      this.submitted = true

      // stop here if form is invalid
      this.$v.$touch()
    },
    /**
     * Horizontal form submit
     */
    horizontalForm(e) {
      this.formsubmit = true
      // stop here if form is invalid
      this.$v.$touch()
    },
    /**
     * Range validation form submit
     */
    rangeform(e) {
      this.submit = true
      // stop here if form is invalid
      this.$v.$touch()
    },
    /**
     * Validation type submit
     */
    typeForm(e) {
      this.typesubmit = true
      // stop here if form is invalid
      this.$v.$touch()
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row d-flex justift-content-center">
      <div class="col-lg-12">
        <div class="card">
					<div class="card-body">
						<p class="mt-0 mb-1">Enter Staff Information</p>
						<form-wizard color="#5369f8" error-color="#ff5c75">
							<tab-content
								title="Personal Information"
								:before-change="() => validateStep('PersonalIformation')"
							>
								<PersonalIformation ref="PersonalIformation" @on-validate="mergePartialModels" />
							</tab-content>
							<tab-content
								title="Work Information"
								:before-change="() => validateStep('workInformation')"
							>
								<WorkInformation ref="workInformation" @on-validate="mergePartialModels" />
							</tab-content>
							<tab-content title="Finish">
								<div class="row">
									<div class="col-12">
										<div class="text-center">
											<h2 class="mt-0">
												<i class="mdi mdi-check-all"></i>
											</h2>
											<h3 class="mt-0">Thank you !</h3>

											<p class="w-75 mb-2 mx-auto">
												Quisque nec turpis at urna dictum luctus. Suspendisse
												convallis dignissim eros at volutpat. In egestas mattis
												dui. Aliquam mattis dictum aliquet.
											</p>

											<div class="mb-3">
												<div class="custom-control custom-checkbox">
													<input
														id="customCheck1"
														type="checkbox"
														class="custom-control-input"
													/>
													<label class="custom-control-label" for="customCheck1"
														>I agree with the Terms and Conditions</label
													>
												</div>
											</div>
										</div>
									</div>
									<!-- end col -->
								</div>
								<!-- end row -->
							</tab-content>
						</form-wizard>
					</div>
				</div>
        <!-- end card--->
      </div>
      
    </div>
    <!-- end row -->
  </Layout>
</template>
