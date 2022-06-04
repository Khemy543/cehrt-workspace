<script>
import appConfig from '@src/app.config'
import auth from './msalConfig/auth'
import graph from './msalConfig/graph'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  async created() {
      auth.configure('3082b7e9-5aca-4942-a4a3-1a796b8bf037', false)
      // Restore any cached or saved local user
      this.user = auth.user()
      console.log(`configured ${auth.isConfigured()}`)

      await graph.getFiles()
    
  },
}
</script>

<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Design variables and utilities from src/design.
@import '@design';
</style>
