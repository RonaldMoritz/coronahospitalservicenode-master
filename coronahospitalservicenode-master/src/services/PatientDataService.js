import http from "../http-common";

class PatientDataService {
    create(data) {
        return http.post(`/patient/`, data);
    }
    get() {
        return http.get(`/patient`);
    }
    getWithoutBed() {
        return http.get(`/patient/withoutbed`);
    }
    getInHospitalization() {
        return http.get(`/patient/inhospitalization`);
    }
    getArchive() {
        return http.get(`/patient/archive`);
    }
}

export default new PatientDataService();