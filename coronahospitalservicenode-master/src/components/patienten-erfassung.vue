<template>
  <div class="submit-form">

    <div class="page-heading-container">
      <h2 class="sub-heading page-heading">Patientenerfassung</h2>
      <h3 class="sub-heading page-desc">Für die Datenerfassung müssen alle Felder ausgefüllt werden.</h3>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="fname">Vorname:</label> <br>
          <input v-model="patient.first_name" type="text" id="fname" name="fname" placeholder="Vorname"
                 class="inpute-width" required>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container">
          <label for="lname">Nachname:</label><br>
          <input v-model="patient.second_name" type="text" id="lname" name="lname" placeholder="Nachname"
                 class="inpute-width" required>
        </div>
      </div>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="birth_date">Geburtsdatum:<br>
            <input v-model="patient.birth_date" type="date" id="birth_date" class="inpute-width" required>
          </label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container gender-input-container">
          <label for="male">Geschlecht:</label><br>
          <input v-model="patient.sex" type="radio" id="male" name="gender" value="male">
          <label for="male">Male</label>
          <input v-model="patient.sex" type="radio" id="female" name="gender" value="female">
          <label for="female">Female</label>
          <input v-model="patient.sex" type="radio" id="other" name="gender" value="other" required>
          <label for="other">Other</label>
        </div>
      </div>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="sym">Symptome:</label><br>
          <textarea v-model="patient.symptoms" id="sym" name="sym" placeholder="Symptome..."
                    class="inpute-width"
                    required></textarea>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container">
          <label for="insurance">Versicherung:</label><br>
          <input v-model="patient.insurance" type="text" id="insurance" name="insurance" placeholder="Versicherung"
                 class="inpute-width"
                 required>
        </div>
      </div>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="street">Straße:</label><br>
          <input v-model="patient.street" type="text" id="street" placeholder="Straße" class="inpute-width" required>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container">
          <label for="houseNo">Hausnummer:</label><br>
          <input v-model="patient.house_no" type="text" id="houseNo" placeholder="Hausnummer" class="inpute-width"
                 required>
        </div>
      </div>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="zipCode">PLZ:</label><br>
          <input type="text" v-model="patient.zip_code" id="zipCode" name="zipCode" placeholder="PLZ"
                 class="inpute-width" required>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container">
          <label for="city">Stadt:</label><br>
          <input v-model="patient.city" type="text" id="city" name="city" placeholder="Stadt" class="inpute-width"
                 required>
        </div>
      </div>
    </div>


    <div class="row input-row">
      <div class="col-md-6">
        <div class="name-container">
          <label for="state">Bundesland:</label><br>
          <input v-model="patient.state" type="text" id="state" name="state" placeholder="Bundesland"
                 class="inpute-width"
                 required>
        </div>
      </div>
      <div class="col-md-6">
        <div class="name-container">
          <label for="country">Land:</label><br>
          <input v-model="patient.country" type="text" id="country" name="country" placeholder="Land"
                 class="inpute-width"
                 required>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <button type="button" class="btn btn-success">
        <input class="submit-button-label" @click="savePatient" type="submit" value="Speichern">
      </button>
    </div>

  </div>
</template>

<script>
import PatientDataService from "@/services/PatientDataService";
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  name: 'index',

  data() {
    return {
      patient: {}
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
  },

  methods: {
    savePatient() {
      PatientDataService.create(this.patient)
          .then(response => {
            this.patient.id = response.data.id;
            console.log(response.data);
            //clear form values
            this.patient.first_name = this.patient.second_name = this.patient.birth_date = this.patient.sex = this.patient.symptoms = this.patient.insurance = this.patient.street = this.patient.house_no = this.patient.zip_code = this.patient.city = this.patient.state = this.patient.country = '';
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
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
