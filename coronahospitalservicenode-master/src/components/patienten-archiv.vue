<template>
  <div class="page-heading-container">
    <h2 class="sub-heading page-heading">Patienten Archiv</h2>
    <h3 class="sub-heading page-desc">Sie finden hier eine Liste aller Patienten bereits wieder entlassenen
      Patienten.</h3>
  </div>

  <div class="bed-assignment-container">
    <div class="assignment">
      <div class="assignment-desc">
        <h4>Liste aller Patienten, die das Krankenhaus schon verlassen haben.</h4>

      </div>

      <div class="assignment-patient-table">
        <form method="post">
          <table class="table table-hover">
            <caption>Liste von Patienten die das Krankenhaus bereits verlassen haben</caption>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Vorname</th>
              <th scope="col">Nachname</th>
              <th scope="col">Geburtsdatum</th>
              <th scope="col">Straße</th>
              <th scope="col">H-Nr.</th>
              <th scope="col">PLZ</th>
              <th scope="col">Stadt</th>
              <th scope="col">Bundesland</th>
              <th scope="col">Land</th>
              <th scope="col">Eintrittsdatum</th>
              <th scope="col">Austrittsdatum</th>
            </tr>
            <!-- iterate over patients -->
            <tr v-for="patient in patients" :key="patient">
              <!-- iterate over each value of a patient -->
              <td v-for="value in patient" :key="value">
                <!-- display the value -->
                {{ value }}
              </td>
            </tr>

          </table>

        </form>
      </div>
    </div>

    <div class="dismissal">

    </div>
  </div>

</template>

<script>
import PatientDataService from "@/services/PatientDataService";
import router from "@/router";
import UserDataService from "@/services/UserDataService";

export default {
  data() {
    return {
      patients: null,
    }
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

    //get Patients from Archive
    PatientDataService.getArchive().then(response => {
      console.log(response);
      this.patients = response.data;
    }).catch((error) => {
      console.log(error);

      if (error.response.status === 401) {
        //unauthorized

        //send logout to server
        UserDataService.logout({token: this.$store.state.token});

        //update state
        this.$store.commit('updateTokenData',
            {
              token: '',
              validUntil: ''
            });

        //redirect to login screen
        router.push('/');
      }
    });
  },
}
</script>