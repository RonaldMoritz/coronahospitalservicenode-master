<template>
  <div class="page-heading-container">

  </div>

  <div class="bed-assignment-container">
    <div class="assignment">
      <div class="assignment-desc">

      </div>


      <div class="assignment-patient-table">
        <div class="page-heading-container">
          <h2 class="sub-heading page-heading">Patientenentlassung</h2>
          <h3 class="sub-heading page-desc">Wählen Sie mit der Checkbox die Patienten aus, die entlassen werden sollen
            und bestätigen Sie ihre Auswahl mit dem "Entlassen"-Button am Ende der Seite!</h3>
        </div>


        <table class="table table-hover">
          <caption>Liste von Patienten die im Hospitalization</caption>
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
            <th scope="col">Löschen</th>
          </tr>
          <!-- iterate over patients -->
          <tr v-for="patient in patients" :key="patient">
            <!-- iterate over each value of a patient -->
            <td v-for="value in patient" :key="value">
              <!-- display the value -->
              {{ value }}
            </td>

            <td>
              <!-- assign checkbox to the patient ID value -->

              <input type="checkbox" id="checkbox" v-model="patientallocation[patient.patient_id]">
            </td>
          </tr>
        </table>
        <div class="action-bar">
          <button type="button" class="btn btn-danger">
            <input class="submit-button-label" @click="deletePatient" type="submit" value="Entlassen">
          </button>
        </div>


      </div>
    </div>

    <div class="dismissal">

    </div>
  </div>
</template>

<script>
import PatientDataService from "@/services/PatientDataService";
import HospitalizationDataService from "@/services/HospitalizationDataService";
import PatientArchiveDataService from "@/services/PatientArchiveDataService";
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  data() {
    return {
      patients: null,
      patientallocation: [],
      newArchiveAntry: null
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

    //get patients
    PatientDataService.getInHospitalization().then(response => {
      this.patients = response.data;

      //create mapping array for the selection
      for (let i = 0; i < this.patients.length; i++) {
        let currPatientId = this.patients[i].patient_id;
        this.patientallocation[currPatientId] = -1;
      }
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

  methods: {
    //button Patient entlassen
    async deletePatient() {

      //get current date
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      for (const [patientId, checkboxvalue] of Object.entries(this.patientallocation)) {

        if (checkboxvalue && checkboxvalue !== -1) {

          await HospitalizationDataService.get(patientId).then(response => {
            let hospitalization = response.data;

            this.newArchiveAntry = {
              bed_no: hospitalization[0].bed_no,
              hospital_id: hospitalization[0].hospital_id,
              patient_id: hospitalization[0].patient_id,
              admission: hospitalization[0].admission,
              discharge: today
            }
          }).catch(e => {
            console.log(e);
          });


          console.log(this.newArchiveAntry);
          await PatientArchiveDataService.create(this.newArchiveAntry).then(response => {
            console.log(response.data);
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

          HospitalizationDataService.delete(patientId).then(response => {
            console.log(response.data);
            location.reload();
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
        }
      }
    }
  }


}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
