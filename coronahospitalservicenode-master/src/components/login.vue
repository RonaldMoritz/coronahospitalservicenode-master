<template>
  <div class="login-screen">
    <div class="login-form">
      <h1>Login</h1>

      <label for="user_name">Username</label>
      <input id="user_name" type="text" placeholder="Enter Username" name="user_name" ref="user_name" required>

      <label for="user_password">Passwort</label>
      <input id="user_password" type="password" placeholder="Enter Password" name="user_password" ref="user_password"
             required>

      <button class="btn btn-success" id="login-button" v-on:click.once="loginButtonClicked">Login</button>
    </div>
  </div>
</template>

<script>
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  name: "login",

  data() {
    return {
      loginResponse: null
    }
  },

  methods: {
    async loginButtonClicked() {
      //disable button
      document.getElementById('login-button').disabled = true;

      //get values from input form
      let user_name_var = this.$refs.user_name.value;
      let user_password_var = this.$refs.user_password.value;

      //use this credentials to get a login token
      await UserDataService.getAcessToken({
        "user_name": user_name_var,
        "user_password": user_password_var
      }).then(response => {

        if (response.data.token == null) {
          //Credentials incorrect
          console.error('Login Failed: User token data is empty!');
          alert('Login Credentials incorrect!');
          location.reload();
          return;
        }
        console.log('Credentials OK!');
        this.loginResponse = response.data

      }).catch(e => {
        console.log(e);
        alert('Login Credentials incorrect');
        location.reload();
      });

      //set http header
      UserDataService.updateHTTPHeader(this.loginResponse.token);

      //commit vuex variables
      this.$store.commit('updateTokenData', this.loginResponse);

      this.$cookie.setCookie('user_token', this.loginResponse.token, {
        expire: '1d',
        path: '/',
        domain: '',
        secure: '',
        sameSite: '',
      });

      await router.push('/index');
    }
  },

  mounted() {
    if (this.$store.state.token.length > 0) {
      router.push('/index');
    }
  }
}
</script>

<style scoped>
.login-screen {
  max-width: 500px;
  margin: auto;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.btn-success {
  margin-top: 20px;
}

h1 {
  text-align: center;
}

</style>