const sql = require("./db.js");

// constructor
const Patient = function (patient) {
    this.patient_id = patient.patient_id;
    this.first_name = patient.first_name;
    this.second_name = patient.second_name;
    this.birth_date = patient.birth_date;
    this.sex = patient.sex;
    this.symptoms = patient.symptoms;
    this.insurance = patient.insurance;
    this.street = patient.street;
    this.house_no = patient.house_no;
    this.zip_code = patient.zip_code;
    this.city = patient.city;
    this.state = patient.state;
    this.country = patient.country;
};

Patient.create = (newPatient, result) => {
    sql.query("INSERT INTO patient SET ?", newPatient, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newPatient});
    });
};

Patient.getAll = result => {
    sql.query("SELECT * FROM patient", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Patient.getPatientsWithoutBed = result => {
    sql.query("SELECT patient.patient_id, " +
        "patient.first_name, " +
        "patient.second_name, " +
        "patient.birth_date, " +
        "patient.street, " +
        "patient.house_no, " +
        "patient.zip_code, " +
        "patient.city, " +
        "patient.state, " +
        "patient.country " +
        "FROM patient " +
        "LEFT JOIN patient_archive pa on patient.patient_id = pa.patient_id " +
        "LEFT JOIN hospitalization h ON patient.patient_id = h.patient_id " +
        "WHERE h.hospital_id IS NULL AND pa.discharge IS  NULL", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Patient.getPatientsInHospitalization = result => {
    sql.query("SELECT  patient.patient_id, " +
        "patient.first_name, " +
        "patient.second_name, " +
        "patient.birth_date, " +
        "patient.street, " +
        "patient.house_no, " +
        "patient.zip_code, " +
        "patient.city, " +
        "patient.state, " +
        "patient.country " +
        "FROM patient JOIN hospitalization h ON patient.patient_id = h.patient_id " +
        "ORDER BY patient.second_name ASC;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Patient.getPatientsInArchive = result => {
    sql.query("SELECT patient.patient_id, " +
        "patient.first_name, " +
        "patient.second_name, " +
        "patient.birth_date, " +
        "patient.street, " +
        "patient.house_no, " +
        "patient.zip_code, " +
        "patient.city, " +
        "patient.state, " +
        "patient.country, " +
        "admission, " +
        "discharge " +
        "FROM patient " +
        "Right JOIN patient_archive pa on patient.patient_id = pa.patient_id;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

module.exports = Patient;
