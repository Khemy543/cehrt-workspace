<script>
/**
 * Messages
 */
export default {
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    initials: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      form: {},
      titles: ['Mr', 'Mrs', 'Miss', 'Ing', 'Dr', 'Prof', 'other'],
    }
  },
  created() {
    this.form = { ...this.user }
  },
  methods: {
    async updateProfile() {},

    browse() {
      this.$refs['file'].click()
    },
    handleInputChange({ target }) {
      this.form.profile_pic = target.files[0]
    },

    async handleSubmitUpdateProfile() {
      try {
        const formData = new FormData()
        for (const key in this.form) {
          formData.append(`${key}`, this.form[key])
        }

        formData.append('_method', 'PUT')

        const response = await this.$http.post(
          `auth/${this.form.id}/account/update`,
          formData
        )

        if (response) {
        }
      } catch (error) {
        const { status, data } = error.response
        if (status === 422) {
          const { errors } = data
          return this.$bvToast.toast(errors[Object.keys(errors)[0]], {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: false,
            variant: 'danger',
          })
        }
        this.$bvToast.toast('Something happened, Please try again later', {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: false,
          variant: 'danger',
          toastClass: 'text-white',
        })
      }
    },
  },
}
</script>
<template>
  <div>
    <h5>Edit profile</h5>
    <form @submit.prevent="handleSubmitUpdateProfile">
      {{ form.profile_pic }}
      <div class="row">
        <div class="col-12 d-flex justify-content-center">
          <div
            style="width:60px; height:60px;"
            class="mr-2 d-flex align-items-center rounded-circle justify-content-center bg-primary text-white font-weight-bold position-relative"
          >
            {{ initials }}
           <!--  <div
              class="position-absolute bg-secondary rounded-circle d-flex justify-content-center align-items-center"
              style=" top:-2px; right:-2px;height:25px; width:25px; cursor:pointer;"
              @click="browse"
            >
              <i class="uil uil-camera"></i>
            </div>
            <input
              ref="file"
              type="file"
              class="d-none"
              accept=".jpeg, .jpg, .png"
              @change="handleInputChange"
            /> -->
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-6">
          <b-form-group id="title" label="Title" label-for="title">
            <b-form-select id="title" v-model="form.title" type="text" required>
              <option value>Title</option>
              <option v-for="title in titles" :key="title" :value="title">
                {{ title }}
              </option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group id="firstname" label="First Name" label-for="firstname">
            <b-form-input
              id="firstname"
              v-model="form.firstname"
              type="text"
              required
              placeholder="Enter first name"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class=" row">
        <div class="col-md-6">
          <b-form-group id="lastname" label="Last name" label-for="lastname">
            <b-form-input
              id="lastname"
              v-model="form.lastname"
              type="text"
              required
              placeholder="Enter last name"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="other_names"
            label="Other names(Optional)"
            label-for="other_names"
          >
            <b-form-input
              id="other_names"
              v-model="form.other_names"
              type="text"
              placeholder="Enter Other names"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="preferred_name"
            label="Preferred name"
            label-for="preferred_name"
          >
            <b-form-input
              id="preferred_name"
              v-model="form.preferred_name"
              type="text"
              required
              placeholder="Enter preferred name"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-form-group id="address" label="Address" label-for="address">
            <b-form-input
              id="address"
              v-model="form.address"
              type="text"
              required
              placeholder="Enter address"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group id="email" label="Email address" label-for="email">
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="phone_number"
            label="Phone number"
            label-for="phone_number"
          >
            <b-form-input
              id="phone_number"
              v-model="form.phone_number"
              type="text"
              required
              placeholder="Enter phone number"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="alternate_phone"
            label="Phone number(Optional)"
            label-for="alternate_phone"
          >
            <b-form-input
              id="alternate_phone"
              v-model="form.alternate_phone"
              type="text"
              placeholder="Enter alternate phone number"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group id="dob" label="Date of birth" label-for="dob">
            <b-form-input
              id="dob"
              v-model="form.dob"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="ghana_card_id"
            label="Ghana card ID"
            label-for="ghana_card_id"
          >
            <b-form-input
              id="ghana_card_id"
              v-model="form.ghana_card_number"
              type="text"
              required
              placeholder="Enter Ghana card id"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group id="nhia" label="NHIA number" label-for="nhia">
            <b-form-input
              id="nhia"
              v-model="form.NHIA_number"
              type="text"
              placeholder="Enter NHIA number"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="marital_status"
            label="Marital status"
            label-for="marital_status"
          >
            <b-form-select
              id="marital_status"
              v-model="form.marital_status"
              type="text"
              required
            >
              <option value>Select marital status</option>
              <option value="single">single</option>
              <option value="married">married</option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      <div v-if="form.marital_status === 'married'" class="row">
        <div class="col-md-6">
          <b-form-group
            id="spouse_name"
            label="Spouse's name"
            label-for="spouse_name"
          >
            <b-form-input
              id="spouse_name"
              v-model="form.spouse_name"
              type="text"
              required
              placeholder="Enter spouse's name"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="spouse_work_phone"
            label="Enter spouse work phone"
            label-for="spouse_work_phone"
          >
            <b-form-input
              id="spouse_work_phone"
              v-model="form.spouse_work_phone"
              type="text"
              required
              placeholder="Enter spouse's work phone"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div v-if="form.martial_status === 'married'" class="row">
        <div class="col-md-6">
          <b-form-group
            id="spouse_employer"
            label="Spouse's employer"
            label-for="spouse_employer"
          >
            <b-form-input
              id="spouse_employer"
              v-model="form.spouse_employer"
              type="text"
              required
              placeholder="Enter spouse's employer"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_name"
            label="Name of next of kin"
            label-for="next_of_king_name"
          >
            <b-form-input
              id="next_of_king_name"
              v-model="form.next_of_king_name"
              type="text"
              placeholder="Name of next of kin"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_relation"
            label="Relationship"
            label-for="next_of_king_relation"
          >
            <b-form-input
              id="next_of_king_relation"
              v-model="form.next_of_king_relation"
              type="text"
              placeholder="Enter relationship"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_email"
            label="Email of next of kin"
            label-for="next_of_king_email"
          >
            <b-form-input
              id="next_of_king_email"
              v-model="form.next_of_king_email"
              type="text"
              placeholder="Email of next of kin"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_phone_number"
            label="Phone number of next of kin"
            label-for="next_of_king_phone_number"
          >
            <b-form-input
              id="next_of_king_phone_number"
              v-model="form.next_of_king_phone_number"
              type="text"
              placeholder="Phone number of next of kin"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_postal_address"
            label="Postal address of next of kin"
            label-for="next_of_king_postal_address"
          >
            <b-form-input
              id="next_of_king_postal_address"
              v-model="form.next_of_king_postal_address"
              type="text"
              required
              placeholder="Enter postal address"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="next_of_king_house_address"
            label="House address of next of kin"
            label-for="next_of_king_house_address"
          >
            <b-form-input
              id="next_of_king_house_address"
              v-model="form.next_of_king_house_address"
              type="text"
              required
              placeholder="Enter house address"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
