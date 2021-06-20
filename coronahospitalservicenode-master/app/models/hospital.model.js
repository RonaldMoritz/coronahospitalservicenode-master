const sql = require("./db.js");

// constructor
const Hospital = function (hospital) {
    this.hospital_id = hospital.hospital_id;
    this.name = hospital.name;
    this.street = hospital.street;
    this.house_no = hospital.house_no;
    this.zip_code = hospital.zip_code;
    this.city = hospital.city;
    this.state = hospital.state;
    this.country = hospital.country;
    this.max_capacity = hospital.max_capacity;
};

Hospital.getHospitalSelection = result => {
    sql.query("SELECT hospitals.hospital_id, hospitals.name, hospitals_biu.beds_in_use, hospitals.max_capacity" +
        " FROM hospitals" +
        " NATURAL JOIN (" +
        " SELECT hospitalization.hospital_id, count(hospital_id) AS beds_in_use" +
        " FROM hospitalization" +
        " GROUP BY hospital_id) AS hospitals_biu" +
        " WHERE max_capacity > beds_in_use" +
        " GROUP BY hospitals.hospital_id;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Hospital.getUtilizationValues = result => {
    sql.query("SELECT  sum(hospitals_biu.beds_in_use) AS sum_beds_in_use, " +
        "(sum(hospitals.max_capacity) - sum(hospitals_biu.beds_in_use)) AS sum_free_beds, " +
        "sum(hospitals.max_capacity)    AS sum_capacity, " +
        "(sum(hospitals_biu.beds_in_use) * 100 / sum(hospitals.max_capacity)) AS overall_occupancy_percentage " +
        "FROM hospitals " +
        "NATURAL JOIN (  SELECT hospitalization.hospital_id, count(hospital_id) AS beds_in_use " +
        "FROM hospitalization " +
        "GROUP BY hospital_id ) AS hospitals_biu;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Hospital.getIndividualUtilizationValues = result => {
    sql.query("SELECT  hospitals.hospital_id, " +
        "hospitals.name, " +
        "hospitals_biu.beds_in_use, " +
        "hospitals.max_capacity, " +
        "(hospitals_biu.beds_in_use * 100 / hospitals.max_capacity) AS occupancy_in_percent, " +
        "(hospitals.max_capacity - hospitals_biu.beds_in_use) AS amount_of_free_beds " +
        "FROM hospitals " +
        "NATURAL JOIN (  SELECT hospitalization.hospital_id, count(hospital_id) AS beds_in_use " +
        "FROM hospitalization " +
        "GROUP BY hospital_id) AS hospitals_biu " +
        "GROUP BY hospitals.hospital_id;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};


module.exports = Hospital;
