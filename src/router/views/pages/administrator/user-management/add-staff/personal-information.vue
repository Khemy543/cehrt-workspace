<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      preferredName: '',
      otherNames: '',
      address: '',
      email: '',
      phone: '',
      alternatePhone: '',
      birthDate: '',
      ghanaCardId: '',
      maritalStatus: '',
      nhia: '',
      spouseName: '',
      spouseEmployer: '',
      spousePhone:''
    }
  },
  validations: {
    firstName: {
      required,
    },
    otherNames: {
      required: false,
    },
    alternatePhone: {
      required: false,
    },
    lastName: {
      required,
    },
    preferredName: {
      required,
    },
    address: {
      required,
    },
    email: {
      required,
    },
    phone: {
      required,
    },
    birthDate: {
      required,
    },
    ghanaCardId: {
      required,
    },
    nhia: {
      required,
    },
    maritalStatus: {
      required,
    },
    spouseName: {
      required: false
    },
    spousePhone: {
      required: false
    },
    spouseEmployer: {
      required: false
    },
    form: [
      'firstName',
      'lastName',
      'otherNames',
      'preferredName',
      'address',
      'email',
      'phone',
      'alternatePhone',
      'birthDate',
      'ghanaCardId',
      'nhia',
      'maritalStatus',
      'spouseName',
      'spousePhone',
      'spouseEmployer'
    ],
  },
  methods: {
    validate() {
      this.$v.form.$touch()
      var isValid = !this.$v.form.$invalid
      this.$emit('on-validate', this.$data, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.firstName.$error }"
        >
          <label class="col-md-3 col-form-label">First Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="firstName"
              class="form-control"
              :class="{ 'is-invalid': $v.firstName.$error }"
              placeholder="First name"
            />
            <span
              v-if="$v.firstName.$error && !$v.firstName.required"
              class="help-block invalid-feedback"
              >first name is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.lastName.$error }"
        >
          <label class="col-md-3 col-form-label">Last Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="lastName"
              class="form-control"
              :class="{ 'is-invalid': $v.lastName.$error }"
              placeholder="Last name"
            />
            <span
              v-if="$v.lastName.$error && !$v.lastName.required"
              class="help-block invalid-feedback"
              >last name is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div class="form-group mb-3">
          <label class="col-md-12 col-form-label">Other Names (optional)</label>
          <div class="col-md-12">
            <input v-model.trim="otherNames" class="form-control" placeholder="Other names" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.preferredName.$error }"
        >
          <label class="col-md-12 col-form-label">Preferred Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="preferredName"
              class="form-control"
              :class="{ 'is-invalid': $v.preferredName.$error }"
              placeholder="Preferred name"
            />
            <span
              v-if="$v.preferredName.$error && !$v.preferredName.required"
              class="help-block invalid-feedback"
              >preferred name is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.address.$error }"
        >
          <label class="col-md-12 col-form-label">Address</label>
          <div class="col-md-12">
            <input
              v-model.trim="address"
              class="form-control"
              :class="{ 'is-invalid': $v.address.$error }"
              placeholder="Address"
            />
            <span
              v-if="$v.address.$error && !$v.address.required"
              class="help-block invalid-feedback"
              >address is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.email.$error }">
          <label class="col-md-12 col-form-label">Email Address</label>
          <div class="col-md-12">
            <input
              v-model.trim="email"
              class="form-control"
              :class="{ 'is-invalid': $v.email.$error }"
              placeholder="Email address"
            />
            <span
              v-if="$v.email.$error && !$v.email.required"
              class="help-block invalid-feedback"
              >email is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.phone.$error }">
          <label class="col-md-12 col-form-label">Phone Number</label>
          <div class="col-md-12">
            <input
              v-model.trim="phone"
              class="form-control"
              :class="{ 'is-invalid': $v.phone.$error }"
              placeholder="Phone number"
            />
            <span
              v-if="$v.phone.$error && !$v.phone.required"
              class="help-block invalid-feedback"
              >phone is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3">
          <label class="col-md-12 col-form-label"
            >Alternate Phone Number(Optional)</label
          >
          <div class="col-md-12">
            <input v-model.trim="alternatePhone" class="form-control" placeholder="Altername phone number" />
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div
          class="form-group mb-3"
          :class="{ 'has-error': $v.birthDate.$error }"
        >
          <label class="col-md-12 col-form-label">Birth Date</label>
          <div class="col-md-12">
            <input
              v-model.trim="birthDate"
              class="form-control"
              type="date"
              :class="{ 'is-invalid': $v.birthDate.$error }"
            />
            <span
              v-if="$v.birthDate.$error && !$v.birthDate.required"
              class="help-block invalid-feedback"
              >birth date is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.ghanaCardId.$error }">
          <label class="col-md-12 col-form-label">Ghana Card ID</label>
          <div class="col-md-12">
            <input
              v-model.trim="ghanaCardId"
              class="form-control"
              :class="{ 'is-invalid': $v.ghanaCardId.$error }"
              placeholder="Ghana Card ID"
            />
            <span
              v-if="$v.ghanaCardId.$error && !$v.ghanaCardId.required"
              class="help-block invalid-feedback"
              >ghana card id is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class=" row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.nhia.$error }">
          <label class="col-md-12 col-form-label">NHIA Status & Number</label>
          <div class="col-md-12">
            <input
              v-model.trim="nhia"
              class="form-control"
              :class="{ 'is-invalid': $v.nhia.$error }"
              placeholder="NHIA status & number"
            />
            <span
              v-if="$v.nhia.$error && !$v.nhia.required"
              class="help-block invalid-feedback"
              >NHIA status & number is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
       <div class="form-group mb-3" :class="{ 'has-error': $v.maritalStatus.$error }">
          <label class="col-md-12 col-form-label">Marital Status</label>
          <div class="col-md-12">
            <select 
              v-model.trim="maritalStatus"
              class="form-control custom-select"
              :class="{ 'is-invalid': $v.maritalStatus.$error }"
            >
              <option disabled value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
            <span
              v-if="$v.maritalStatus.$error && !$v.maritalStatus.required"
              class="help-block invalid-feedback"
              >marital status is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="maritalStatus === 'married'" class=" row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.spouseName.$error }">
          <label class="col-md-12 col-form-label">Spouse's Name</label>
          <div class="col-md-12">
            <input
              v-model.trim="spouseName"
              class="form-control"
              :class="{ 'is-invalid': $v.spouseName.$error }"
              placeholder="Spouse's name"
            />
            <span
              v-if="$v.spouseName.$error && !$v.spouseName.required"
              class="help-block invalid-feedback"
              >spouse name is required</span
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.spousePhone.$error }">
          <label class="col-md-12 col-form-label">Spouse's Work Phone</label>
          <div class="col-md-12">
            <input
              v-model.trim="spousePhone"
              class="form-control"
              :class="{ 'is-invalid': $v.spousePhone.$error }"
              placeholder="Spouse's work phone"
            />
            <span
              v-if="$v.spousePhone.$error && !$v.spousePhone.required"
              class="help-block invalid-feedback"
              >spouse name is required</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="maritalStatus === 'married'" class=" row">
      <div class="col-md-6">
        <div class="form-group mb-3" :class="{ 'has-error': $v.spouseEmployer.$error }">
          <label class="col-md-12 col-form-label">Spouse's Employer</label>
          <div class="col-md-12">
            <input
              v-model.trim="spouseEmployer"
              class="form-control"
              :class="{ 'is-invalid': $v.spouseEmployer.$error }"
              placeholder="Spouse's employer"
            />
            <span
              v-if="$v.spouseEmployer.$error && !$v.spouseEmployer.required"
              class="help-block invalid-feedback"
              >spouse employer is required</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
