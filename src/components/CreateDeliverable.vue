<template>
  <b-modal
    v-model="show"
    :title="title"
    title-class="font-18"
    hide-footer
  >
    <form @submit.prevent="action({ ...form, ...deliverable, file, filename })">
      <b-form-group
        id="input-group-1"
        label="Deliverable deadline"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.deadline"
          type="date"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-1"
        label="Upload Delivrable File"
        label-for="input-1"
      >
        <input
          id="input-1"
          type="file"
          @change="onFileChange"
        />
      </b-form-group>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
// import { signInWithMsal, getMsalToken} from '@src/msalConfig/auth.js'; 
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    action: {
      type: Function,
      required: true,
    },
    deliverable: {
      type: Object,
      default: () =>{}
    }
  },
  data() {
    return {
      form: {},
      file: "",
      filename: ''
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    title() {
      return this.deliverable && this.deliverable.deliverable_name || this.deliverable && this.deliverable.report_title;
    }
  },
  watch: {
    deliverable(newValue) {
      this.form = newValue
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
      this.filename = e.target.files[0].name;
    },
    /* async handleAction() {
      try { 
        const response = await getMsalToken()
        if(response) {
          this.action({ ...this.form, ...this.deliverable })
        }
      } catch (error) {
        
      }
    } */
  },
}
</script>

<style scoped></style>
