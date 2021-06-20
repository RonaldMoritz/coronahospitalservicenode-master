import http from "../http-common";

class HospitalDataService {
    getSelection() {
        return http.get(`/hospital/selection`);
    }
    getUtilization() {
        return http.get(`/hospital/utilization`);
    }
    getIndividualUtilization() {
        return http.get(`/hospital/individualutilization`);
    }
}

export default new HospitalDataService();