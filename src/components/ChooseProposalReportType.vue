<template>
  <b-modal
    v-model="show"
    title="Choose report type"
    title-class="font-18"
    hide-footer
    size="lg"
  >
    
  </b-modal>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        show: {
            get(){
                return this.value;
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>

<style scoped></style>
