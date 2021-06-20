<template>
  <div class="page-heading-container">
    <h2 class="sub-heading page-heading">Auslastung</h2>
    <h3 class="sub-heading page-desc">Auf dieser Seite finden Sie Statistiken und Daten zur aktuellen
      Auslastung.</h3>
  </div>
  <div class="utilization-container">
    <div class="hospital-occupancy-table-container">

      <div class="utilization-heading-container">
        <h4 class="utilization-heading">Kreisdiagramm: Auslastung gesamt</h4>
      </div>

      <!-- Approach with instyle css-->
      <figure class="pie-chart" v-for="util in overall_rounded" :key="util"
              :style="pieStyle">
        <figcaption>
          Belegte Betten {{ util.occupancy }}%
          <span class="used-beds"></span><br>
          Freie Betten {{ util.free }}%
          <span class="free-beds"></span>
        </figcaption>
      </figure>

      <div class="utilization-heading-container">
        <h4 class="utilization-heading">Tabelle: Auslastung gesamt</h4>
      </div>
      <table class="table">
        <caption></caption>
        <tr>
          <th scope="col">Belegte Betten</th>
          <th scope="col">Freie Betten</th>
          <th scope="col">Betten gesamt</th>
          <th scope="col">Freie Betten in %</th>
          <th scope="col">Belegte Betten in %</th>
        </tr>
        <tr v-for="util in utilization" :key="util">
          <td>{{ util.sum_beds_in_use }}</td>
          <td>{{ util.sum_free_beds }}</td>
          <td>{{ util.sum_capacity }}</td>
          <td>{{ 100 - util.overall_occupancy_percentage }} %</td>
          <td>{{ util.overall_occupancy_percentage }} %</td>
        </tr>
      </table>
      <div class="hospital-occupancy-container">
        <div class="utilization-heading-container">
          <h4 class="utilization-heading">Balkendiagramm: Auslastung der Krankenhäuser in %</h4>
        </div>
        <!-- Approach with chart.js-->
        <div class="bar-chart">
          <canvas id="myChart"></canvas>
        </div>
      </div>
      <div class="utilization-heading-container">
        <h4 class="utilization-heading">Tabelle: Auslastung der Krankenhäuser</h4>
      </div>

      <table class="table hospital-occupancy-table">
        <caption></caption>
        <tr>
          <th scope="col">Krankenhaus</th>
          <th scope="col">Belegte Betten</th>
          <th scope="col">Freie Betten</th>
          <th scope="col">Bettenkapazität</th>
          <th scope="col">Auslastung in %</th>
        </tr>
        <tr v-for="individualUtilization in individualUtilizationsObj" :key="individualUtilization">
          <td>{{ individualUtilization.name }}</td>
          <td>{{ individualUtilization.beds_in_use }}</td>
          <td>{{ individualUtilization.amount_of_free_beds }}</td>
          <td>{{ individualUtilization.max_capacity }}</td>
          <td>{{ individualUtilization.occupancy_in_percent }}</td>
        </tr>
      </table>
    </div> <!-- end hospital-occupancy-table-container-->
  </div> <!--end utilization container-->

</template>

<script>
import HospitalDataService from "@/services/HospitalDataService";
import UserDataService from "@/services/UserDataService";
import router from "@/router";

export default {
  data() {
    return {
      utilization: [],
      individualUtilizationsObj: [],
      overall_rounded: [],
      free: 0,
      occupancy: 0,
      hospitalId: 0,
      labels: [],
      barChartData: []
    }
  },
  computed: {
    pieStyle() {
      return {
        background:
            "radial-gradient(circle closest-side, transparent 61%, white 0), conic-gradient(#3d9970 0, #3d9970 " + this.free
            + "%, #ff443d 0, #ff443d " + this.occupancy + "%)"
      };
    },
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
    HospitalDataService.getUtilization().then(response => {
      this.utilization = response.data;
      for (const [varId, util] of Object.entries(this.utilization)) {
        this.occupancy = parseInt(util.overall_occupancy_percentage);
        this.free = 100 - parseInt(util.overall_occupancy_percentage);
        let data = {
          id: varId,
          occupancy: this.occupancy,
          free: this.free,
        }
        this.overall_rounded.push(data);
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

    HospitalDataService.getIndividualUtilization().then(response => {
      this.individualUtilizationsObj = response.data;
      for (let i = 0; i < this.individualUtilizationsObj.length; i++) {
        this.labels.push(this.individualUtilizationsObj[i].name);
        this.barChartData.push(this.individualUtilizationsObj[i].occupancy_in_percent)
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

  updated() {
    let ctx = document.getElementById('myChart').getContext('2d');
    // eslint-disable-next-line no-undef
    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'horizontalBar',
      // The data for our dataset
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Auslastung in %',
          backgroundColor: 'rgb(255, 68, 61)',
          borderColor: 'rgb(255, 68, 61)',
          data: this.barChartData
        }]
      },
      // Configuration options go here
      options: {
        animation: {
          duration: 1000,
          easing: 'linear'
        }
      }
    });
    chart.resize();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
