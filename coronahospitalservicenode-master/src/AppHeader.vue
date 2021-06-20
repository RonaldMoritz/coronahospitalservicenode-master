<template>
  <div class="layout-header">

    <h1 class="main-heading">Corona Hospital Service</h1>

    <div v-if="isLoggedIn" class="topnav row">
      <router-link to="/index" class="link">Home</router-link>
      <router-link to="/patienten-erfassung" class="link">Patientenerfassung</router-link>
      <router-link to="/betten-zuweisung" class="link">Corona-Betten Zuweisung</router-link>
      <router-link to="/leave-hospitalization" class="link">Patientenentlassung</router-link>
      <router-link to="/auslastung" class="link">Auslastung</router-link>
      <router-link to="/patienten-archiv" class="link">Patienten-Archiv</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      token: null,
    }
  },
  computed: {
    isLoggedIn() {
      console.log(this.$store.state.token);
      return this.$store.state.token.length > 0;
    }
  }
}
</script>

<style scoped>

</style>