<template>
  <div class="page-heading-container">
    <h2 class="sub-heading page-heading">Corona Hospital Service</h2>
    <h3 class="sub-heading page-desc">Verwalten Sie Gesundheitseinrichtungen in Österreich!</h3>
  </div>


  <div class="home-style">
    <div>
      <h4>Patientenerfassung</h4>
      <p>Auf der Patientenerfassung können neue Patienten eingetragen werden.</p>
    </div>

    <div>
      <h4>Corona-Betten-Zuweisung</h4>
      <p>Auf der Corona-Betten-Zuweisung können den neu aufgenommen Patienten ein Krankenhaus zugewiesen werden.</p>
    </div>

    <div>
      <h4>Patientenentlassung</h4>
      <p>Auf der Seite Patiententlassug können genesene/verstorbene Patienten aus dem Krankenhaus entlassen werden.</p>
    </div>

    <div>
      <h4>Auslastung</h4>
      <p>Die Auslastung gibt Statistiken und Daten zur Auslastung der Krankenhäuser.</p>
    </div>

    <div>
      <h4>Patienten-Archiv</h4>
      <p>Im Patienten-Archiv sind alle bereits entlassenen Patienten mit Ein- und Austrittsdatum zu finden.</p>
    </div>
  </div>

</template>

<script>
import router from "@/router";
import UserDataService from "@/services/UserDataService";

export default {
  name: 'index',
  props: {
    msg: String
  },

  mounted() {
    if (this.$store.state.token.length <= 0) {
      let cookieToken = this.$cookie.getCookie('user_token');
      if (cookieToken == null) {
        router.push('/');
        return;
      }
      if (cookieToken.length > 0) {
        //refresh
        this.$store.commit('updateTokenData', {token: cookieToken, validUntil: ''});
        //set http header
        UserDataService.updateHTTPHeader(cookieToken);
      } else {
        router.push('/');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
