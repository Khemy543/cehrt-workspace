<template>
  <a :href="path" target="_blank">
    <div class="icon-wrapper">
      <div class="icon-image-wrapper">
        <div class="icon-image">
          <img :src="image" :alt="type" />
        </div>
      </div>
      <h4 class="mt-1">{{ name }}</h4>
      <b-dropdown
        v-if="deletable"
        variant="link"
        class=" position-absolute drop"
        toggle-class="p-0 text-muted arrow-none"
      >
        <template v-slot:button-content>
          <i class="uil uil-ellipsis-v font-size-14"></i>
        </template>
        <b-dropdown-item
          href="javascript: void(0);"
          variant="danger"
          @click="deleteFile"
        >
          <i class="uil uil-trash-alt mr-2"></i>Delete
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </a>
</template>
<script>
import pdf from '../assets/svgs/pdf.png'
import word from '../assets/svgs/word.svg'
import excel from '../assets/svgs/excel.svg'
export default {
  name: 'File',
  props: {
    id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    image() {
      switch (this.type) {
        case 'word':
          return word
        case 'pdf':
          return pdf
        case 'excel':
          return excel
        default:
          return word
      }
    },
  },
  methods: {
    deleteFile() {
      this.$emit('delete', { id: this.id, webUrl: this.path })
    },
  },
}
</script>
<style scoped lang="scss">
a {
  display: contents;
}
.icon-wrapper {
  width: 154px;
  border-radius: 5px;
  padding: 20px 4px;
  position: relative;

  .drop {
    position: absolute;
    display: none;
    top: 10px;
    right: 10px;
  }
  &:hover {
    .drop {
      display: block;
    }
    background: #edeff4;
  }
  h4 {
    font-size: 11px;
    color: #6c757d !important;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
}
.icon-image-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.icon-image {
  box-shadow: 0 1px 3px 1px rgb(1 1 0 / 5%);
  --webkit-box-shadow: 0 1px 3px 1px rgb(1 1 0 / 5%);
  min-width: 60px;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 30px;
    height: 30px;
  }
}
</style>
