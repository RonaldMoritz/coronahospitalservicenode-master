import http from "../http-common";

class PatientArchiveDataService {
    create(data) {
        return http.post(`/patientarchive/`, data);
    }
}

export default new PatientArchiveDataService();