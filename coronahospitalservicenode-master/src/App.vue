<template>
  <app-header/>
  <div class="layout-main">
    <router-view/>
  </div>
  <app-footer/>
</template>

<script>
import AppHeader from "@/AppHeader";
import AppFooter from "@/AppFooter";


export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
  }
}
</script>

<style lang="scss">
@import "public/layout/styles.scss";
</style>
