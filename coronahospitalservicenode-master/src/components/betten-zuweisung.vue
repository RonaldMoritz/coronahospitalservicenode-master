<template>
  <div class="page-heading-container">
    <h2 class="sub-heading page-heading">Corona-Betten Zuweisung</h2>
    <h3 class="sub-heading page-desc">Weisen Sie bereits erfassten Patienten ein Bett eines Krankenhauses zu oder
      entfernen
      Sie genesene/verstorbene Patienten aus ihrem Bett.</h3>
  </div>

  <div class="bed-assignment-container">
    <div class="assignment">
      <div class="assignment-desc">
        <h4>Liste aller Patienten, die noch keinem Krankenhausbett zugeordnet sind.</h4>
        <p>Weisen Sie den Patienten mittels des Dropdowns ein Krankenhaus zu und klicken Sie unten auf
          "Zuweisen".</p>
      </div>

      <div class="assignment-patient-table">
        <table class="table table-hover">
          <caption>Liste von erfassten Patienten die noch keinem Bett zugewiesen wurden</caption>
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
            <th scope="col">Krankenhaus</th>
          </tr>
          <!-- iterate over patients -->
          <tr v-for="patient in patients" :key="patient">
            <!-- iterate over each value of a patient -->
            <td v-for="value in patient" :key="value">
              <!-- display the value -->
              {{ value }}
            </td>
            <!-- create an additional column for the hospital selection -->
            <td>
              <!-- assign selection to the patient ID value -->
              <select v-model="hospitalSelection[patient.patient_id]">
                <!-- create dropdown for hospitals -->
                <option v-for="hospital in hospitals" v-bind:value="{id: hospital.hospital_id, text:hospital.name}"
                        :key="hospital">
                  {{ hospital.name }}
                </option>
                <!-- default dropdown unselected -->
                <option value="-1" selected="selected">-</option>
              </select>
            </td>
          </tr>
        </table>
        <div class="action-bar">
          <button type="button" class="btn btn-success">
            <!-- call assignBeds function on click -->
            <input class="submit-button-label" @click="assignBeds" type="submit" value="Betten Zuweisen">
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import PatientDataService from "@/services/PatientDataService";
import HospitalDataService from "@/services/HospitalDataService";
import BedDataService from "@/services/BedDataService";
import HospitalizationDataService from "@/services/HospitalizationDataService";
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  data() {
    return {
      patients: null,
      hospitals: null,
      hospitalSelection: [],
      responseTimer: true,
      freeBedsObj: []
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
    PatientDataService.getWithoutBed().then(response => {
      this.patients = response.data;

      //create mapping array for the selection
      for (let i = 0; i < this.patients.length; i++) {
        let currPatientId = this.patients[i].patient_id;
        this.hospitalSelection[currPatientId] = -1;
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

    //get hospitals
    HospitalDataService.getSelection().then(response => {
      this.hospitals = response.data;
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

    //get capacities
    BedDataService.getAvailable().then(response => {
      this.hospitalCpacities = response.data;
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

    for (let i = 1; i < 10; i++) {
      BedDataService.getNextAvailable(i).then(response => {
        this.freeBedsObj.push(response.data);
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
  },

  methods: {
    //button click assignment
    assignBeds() {
      //////////VALIDATE SELECTION//////////

      //get array entries
      let entryCounter = 0;
      this.hospitalSelection.forEach(function () {
        entryCounter++;
      });

      //check if any value was assigned by summing up the id (when not assigned, id value is -1)
      let checkSum = 0;
      this.hospitalSelection.forEach(selection => checkSum += selection);
      if (entryCounter + checkSum === 0) {
        //nothing assigned

        console.log("Kein Krankenhaus ausgewählt!");
        location.reload();
        return;
      }

      //at least one hospital was assigned to a patient
      //check if there is enough space for the assignments

      //calculate the capacity that is needed
      let capacityCounter = [];
      this.hospitalCpacities.forEach(function (hospital) {
        capacityCounter[hospital.hospital_id] = 0;
      });
      this.hospitalSelection.forEach(function (selection) {
        if (selection !== -1) {
          capacityCounter[selection.id] += 1;
        }
      });

      //check if all capacities are valid
      for (let i = 0; i < capacityCounter.length - 1; i++) {
        if (capacityCounter[i + 1] > this.hospitalCpacities[i].amount_of_free_beds - 1) {
          console.log("Auswahl ungültig, mind. ein Krankenhaus würde durch die Auswahl überfüllt sein!");

          //todo show notification, invalid selection
          location.reload();
          return;
        }
      }

      //enough space for all assignments -> insert them in DB

      console.log(this.freeBedsObj);

      //assign beds that are fbootree in a hospital
      for (const [patientId, hospitalObj] of Object.entries(this.hospitalSelection)) {
        if (hospitalObj !== -1) {

          let hospitalIdOfPatient = hospitalObj.id;
          let freeBedNo = this.freeBedsObj[hospitalIdOfPatient - 1][0].bed_no; //the first free bed
          this.freeBedsObj[hospitalIdOfPatient - 1].shift(); //remove the assigned bed

          //get current date
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          let yyyy = today.getFullYear();

          today = yyyy + '-' + mm + '-' + dd;

          let newHospitalization = {
            bed_no: freeBedNo,
            hospital_id: hospitalIdOfPatient,
            patient_id: patientId,
            admission: today
          }


          //insert
          HospitalizationDataService.create(newHospitalization).then(response => {
            console.log('Inserted = ' + response.data);
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
