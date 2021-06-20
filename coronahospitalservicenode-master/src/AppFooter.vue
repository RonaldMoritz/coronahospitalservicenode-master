<template>
  <div class="layout-footer" v-if="isLoggedIn">
    <div class="impress-menu-item">
      <router-link to="/impress" class="link">Impressum/Datenschutz</router-link>
      <button class="btn btn-outline-danger" v-on:click.once="logout">LOGOUT</button>
    </div>
  </div>
</template>

<script>
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  name: "AppFooter",
  computed: {
    isLoggedIn() {
      console.log(this.$store.state.token);
      return this.$store.state.token.length > 0;
    }
  },
  methods: {
    logout() {
      //send logout to server
      UserDataService.logout({token: this.$store.state.token});

      //update state
      this.$store.commit('updateTokenData',
          {
            token: '',
            validUntil: ''
          });

      //remove cookie
      this.$cookie.removeCookie('user_token');

      //redirect to login screen
      router.push('/');
    }
  }
}
</script>

<style scoped>
.impress-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-outline-danger {
  margin-top: 10px;
}
</style>