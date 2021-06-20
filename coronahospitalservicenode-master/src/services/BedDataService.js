import http from "../http-common";

class BedDataService {
    getNextAvailable(hospital_id) {
        return http.get(`/bed/nextavailable/${hospital_id}`);
    }

    getAvailable() {
        return http.get(`/bed/available`);
    }

}

export default new BedDataService();