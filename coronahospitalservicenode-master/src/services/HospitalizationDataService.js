import http from "../http-common";

class HospitalizationDataService {
    create(data) {
        return http.post(`/hospitalization/`, data);
    }
    get(patient_id) {
        return http.get(`/hospitalization/${patient_id}`);
    }
    delete(patient_id) {
        return http.delete(`/hospitalization/${patient_id}`);
    }
}

export default new HospitalizationDataService();