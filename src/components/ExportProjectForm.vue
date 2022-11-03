<template>
  <b-modal
    v-model="show"
    :title="title"
    title-class="font-18"
    hide-footer
    size="lg"
    :cancel-disabled="loading"
    :hide-header-close="loading"
    :no-close-on-backdrop="loading"
    :no-close-on-esc="loading"
  >
    <form @submit.prevent="action(form)">
      <b-form-group
        id="input-group-1"
        label="Project Title"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Title of Project"
        >
        </b-form-input>
      </b-form-group>
      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Project Country"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.country"
              type="text"
              required
              placeholder="Project country"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <label class="col-md-12">Regions</label>
          <multiselect
            v-model="form.regionIds"
            :options="regionOptions"
            label="region"
            track-by="id"
            :multiple="true"
          ></multiselect>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Project District"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.district"
              type="text"
              required
              placeholder="Project District"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <!-- <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Project Year"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.year"
              type="text"
              required
              placeholder="Project year"
            >
            </b-form-input>
          </b-form-group>
        </div> -->
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="Project Summary / Narrative description">
            <b-form-textarea
              id="input-1"
              v-model="form.description"
              placeholder="Description of project"
              rows="4"
            >
            </b-form-textarea>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="Description of service provided">
            <div
              id="taskDesk"
              style="height: 100px; position: relative; z-index: 100;"
            >
              <vue-editor
                v-model="form.service_description"
                :editor-options="editorOptions"
              ></vue-editor>
            </div>
          </b-form-group>
        </div>
      </div>

      <div class=" row">
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Name of Client Contact Person"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.client_name"
              type="text"
              placeholder="Name of Client Contact Person"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Phone number"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.client_contact"
              type="text"
              placeholder="Phone number of contact person"
            >
            </b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Address of client"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.client_address"
              type="text"
              placeholder="Address of client"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group
            id="input-group-1"
            label="Value of Service / Contract Amount"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.contract_amount"
              type="text"
              disabled
              placeholder="Value of service"
            >
            </b-form-input>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <b-form-group
            id="input-group-1"
            label="Start Date"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.start_date"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-6">
          <b-form-group id="input-group-1" label="End Date" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.end_date"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="d-flex mb-2">
        <label for="">Professional Experts</label>
        <button
          type="button"
          class="btn btn-soft-primary btn-sm ml-4"
          @click="addProfessionalExpert"
        >
          <i class="uil uil-plus"></i>
        </button>
      </div>
      <div
        v-for="(prof, index) in form.professional_expects"
        :key="`prof-${prof.id}`"
        class="row"
      >
        <div class="col-md-6">
          <b-form-group id="input-group-1" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.professional_expects[index].name"
              type="text"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div :class="form.professional_expects.length > 1 ? 'col-md-5' : 'col-md-6'">
          <b-form-group id="input-group-1" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.professional_expects[index].role"
              type="text"
              required
              placeholder="Role"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div v-if="form.professional_expects.length > 1" class="col-1">
          <button
            type="button"
            variant="danger"
            class="btn btn-soft-danger btn-sm"
            @click="tryDeleteProfExperts(index)"
          >
            <i class="uil uil-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="d-flex mb-2">
        <label for="">Associated consultants / Partners</label>
        <button
          type="button"
          class="btn btn-soft-primary btn-sm ml-4"
          @click="addPartners"
        >
          <i class="uil uil-plus"></i>
        </button>
      </div>
      <div
        v-for="(part, index) in form.associated_consultants"
        :key="`part-${part.id}`"
        class="row"
      >
        <div class="col-md-6">
          <b-form-group id="input-group-1" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.associated_consultants[index].name"
              type="text"
              placeholder="Name"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div :class="form.associated_consultants.length > 1 ? 'col-md-5' : 'col-md-6'">
          <b-form-group id="input-group-1" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.associated_consultants[index].role"
              type="text"
              placeholder="Role"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <div v-if="form.associated_consultants.length > 1" class="col-1">
          <button
            type="button"
            variant="danger"
            class="btn btn-soft-danger btn-sm"
            @click="tryDeleteAssoConsultants(index)"
          >
            <i class="uil uil-trash-alt"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </b-modal>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.bubble.css'
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect,
    VueEditor,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Function,
      required: true,
    },
    project: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: 'Export Project To Library',
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorOptions: {
        theme: 'bubble',
      },
      form: {
        regionIds: [],
        professional_expects: [
          {
            id: 1,
            name: '',
            role: '',
          },
        ],
        associated_consultants: [
          {
            id: 1,
            name: '',
            role: '',
          },
        ],
      },
      regionOptions: [],
      tempRegions: [
        {
          id: 1,
          name: 'Ahafo Region',
          districts: [
            {
              id: 1,
              name: 'Asunafo North Municipal',
            },
            {
              id: 2,
              name: 'Asunafo South District',
            },
            {
              id: 3,
              name: 'Asutifi North District',
            },
            {
              id: 4,
              name: 'Asutifi South District',
            },
            {
              id: 5,
              name: 'Tano North Municipal',
            },
            {
              id: 6,
              name: 'Tano South Municipal',
            },
          ],
        },
        {
          id: 2,
          name: 'Central Region',
          districts: [
            {
              id: 1,
              name: 'Abura/Asebu/Kwamankese District',
            },
            {
              id: 2,
              name: 'Agona East District',
            },
            {
              id: 3,
              name: 'Agona West Municipal ',
            },
            {
              id: 4,
              name: 'Ajumako/Enyan/Essiam District',
            },
            {
              id: 5,
              name: 'Asikuma Odoben Brakwa District',
            },
            {
              id: 6,
              name: 'Assin Central Municipal',
            },
            {
              id: 7,
              name: 'Assin North District',
            },
            {
              id: 8,
              name: 'Assin South District',
            },
            {
              id: 9,
              name: 'Awutu Senya East Municipal',
            },
            {
              id: 10,
              name: 'Awutu Senya West District',
            },
            {
              id: 11,
              name: 'Cape Coast Metropolitan ',
            },
            {
              id: 12,
              name: 'Effutu Municipal',
            },
            {
              id: 13,
            },
          ],
        },
        {
          id: 3,
          name: 'Eastern Region',
          districts: [
            {
              id: 1,
              name: 'Berekum Municipal',
            },
            {
              id: 2,
              name: 'Berekum Municipal',
            },
            {
              id: 3,
              name: 'Berekum Municipal',
            },
            {
              id: 4,
              name: 'Berekum Municipal',
            },
            {
              id: 5,
              name: 'Berekum Municipal',
            },
            {
              id: 6,
              name: 'Berekum Municipal',
            },
          ],
        },
        {
          id: 4,
          name: 'Greater Accra Region',
          districts: [
            {
              id: 1,
              name: 'Berekum Municipal',
            },
            {
              id: 2,
              name: 'Berekum Municipal',
            },
            {
              id: 3,
              name: 'Berekum Municipal',
            },
            {
              id: 4,
              name: 'Berekum Municipal',
            },
            {
              id: 5,
              name: 'Berekum Municipal',
            },
          ],
        },
      ],
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    project(newValue) {
      this.form = {
        ...this.form,
        name: newValue.name,
        start_date: newValue.raw_start_date || '',
        end_date: newValue.raw_end_date || '',
        description: newValue.description,
        contract_amount: (
          Number(newValue.contract_amount_profession_fees) +
          Number(newValue.contract_amount_reimbursable) +
          Number(newValue.contract_amount_tax_amount)
        ).toFixed(2),
      }
    },
  },
  created() {
    this.getRegions()
  },
  methods: {
    tryDeleteAssoConsultants(index) {
      if (this.form.associated_consultants.length > 1) {
        this.form.associated_consultants.splice(index, 1)
      }
    },
    tryDeleteProfExperts(index) {
      if (this.form.professional_expects.length > 1) {
        this.form.professional_expects.splice(index, 1)
      }
    },
    addProfessionalExpert() {
      this.form.professional_expects.push({
        id:
          this.form.professional_expects[
            this.form.professional_expects.length - 1
          ].id + 1,
        name: '',
        role: '',
      })
    },
    addPartners() {
      this.form.associated_consultants.push({
        id:
          this.form.associated_consultants[
            this.form.associated_consultants.length - 1
          ].id + 1,
        name: '',
        role: '',
      })
    },
    async getRegions() {
      try {
        const response = await this.$http.get(`/fetch/regions`)

        if (response) {
          this.regionOptions = response.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style scoped>
::v-deep .quillWrapper .ql-container .ql-editor {
  min-height: 100px !important;
}

.quillWrapper {
  height: 100% !important;
}
</style>
