<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div>
        
    </div>
  </Layout>
</template>
<script>
import PageHeader from '@components/page-header'
import Layout from '@layouts/main.vue'
export default {
  components: {
    PageHeader,
    Layout,
  },
  data() {
    return {
      title: 'Leave Report',
      items: [
        {
          text: 'Chert',
          href: '/',
        },
        {
          text: 'Leave Report',
          active: true,
        },
      ],
    }
  },
  created() {
    this.getLeaveData();
  },
  methods: {
    async getLeaveData() {
      try {
        const response = await this.$http.get(
          '/admin/fetch/leave/request/stats'
        )

        if (response) {
        }
      } catch (error) {}
    },
  },
}
</script>
