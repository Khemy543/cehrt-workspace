<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { FormWizard, TabContent } from 'vue-form-wizard'

import PersonalIformation from './personal-information.vue'
import WorkInformation from './work-information.vue'

export default {
  page: {
    title: 'Add Staff',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    PersonalIformation,
    FormWizard,
    TabContent,
    WorkInformation,
  },
  data() {
    return {
      title: 'Add Staff',
      items: [
        {
          text: 'Cehrt',
          to: '/',
        },
        {
          text: 'User Management',
          to: '/user-management/staff',
        },
        {
          text: 'Add Staff',
          active: true,
        },
      ],
      submit: false,
      submitted: false,
      formsubmit: false,
      typesubmit: false,
      finalModel: {},
    }
  },
  methods: {
    validateStep(name) {
      var refToValidate = this.$refs[name]
      return refToValidate.validate()
    },
    mergePartialModels(model, isValid) {
      if (isValid) {
        // merging each step model into the final model
        this.finalModel = Object.assign({}, this.finalModel, model)
      }
    },
    getIds(departments) {
      return departments.map((items) => items.id)
    },
    makeToast({ title, message, type }) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        appendToast: false,
        variant: type,
      })
    },
    async addStaff() {
      const {
        firstName,
        lastName,
        address,
        email,
        phone,
        title,
        startDate,
        maritalStatus,
        workLocation,
        workPhone,
        birthDate,
        nhia,
        ghanaCardId,
        otherNames,
        preferredName,
        supervisor,
        spouseName,
        spouseEmployer,
        spousePhone,
        alternatePhone,
        departments,
        staffId,
        nameOfNextOfKin,
        relationshipOfNextOfKin,
        addressOfNextOfKin,
        postalAddressOfKin,
        telNextOfKin,
        emailNextOfKin
      } = this.finalModel
      try {
        const response = await this.$http.post('/admin/add/staff', {
          othernames: otherNames,
          preferred_name: preferredName,
          firstname: firstName,
          lastname: lastName,
          address,
          email,
          phone_number: phone,
          title,
          start_date: startDate,
          marital_status: maritalStatus,
          dob: birthDate,
          NHIA_number: nhia,
          ghana_card_number: ghanaCardId,
          supervisor_id: Number(supervisor),
          ...(maritalStatus === 'married'
            ? {
              spouse_name: spouseName,
              spouse_employer: spouseEmployer,
              spouse_work_phone: spousePhone,
            }
            : {}),
          alternative_phone_number: alternatePhone,
          department_ids: this.getIds(departments),
          staff_id: staffId,
          work_location: workLocation,
          work_phone_number: workPhone,
          next_of_king_name: nameOfNextOfKin,
          next_of_king_relation: relationshipOfNextOfKin,
          next_of_king_house_address: addressOfNextOfKin,
          next_of_king_email: emailNextOfKin,
          next_of_king_phone_number: telNextOfKin,
          next_of_king_postal_address: postalAddressOfKin
        })

        if (response) {
          this.makeToast({
            title: 'Success',
            message: 'Staff created successfully',
            type: 'success',
          })
          // this.$router.push('/user-management/staff')
        }
      } catch (error) {
        let message = 'Something happend, Please try again later'
        if (error.response) {
          const { status, data } = error.response

          if (status === 422) {
            message = data.errors[Object.keys(data.errors)[0]]
          }
        }
        this.makeToast({
          title: 'Error',
          message,
          type: 'danger',
        })
      }
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
            <form-wizard color="#5369f8" error-color="#ff5c75" @on-complete="addStaff">
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
                      <h3 class="mt-0">Add New Staff !</h3>

                      <p class="w-75 mb-2 mx-auto">Click on the finish button to add staff.</p>

                      <!-- <div class="mb-3">
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
                      </div>-->
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
