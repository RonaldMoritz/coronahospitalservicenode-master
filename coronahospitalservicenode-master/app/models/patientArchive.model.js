const sql = require("./db.js");

// constructor
const PatientArchive = function (patientArchive) {
    this.bed_no = patientArchive.bed_no;
    this.hospital_id = patientArchive.hospital_id;
    this.patient_id = patientArchive.patient_id;
    this.admission = patientArchive.admission;
    this.discharge = patientArchive.discharge;
};

PatientArchive.create = (newPatientArchive, result) => {
    sql.query("INSERT INTO patient_archive SET ?", newPatientArchive, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newPatientArchive});
    });
};


module.exports = PatientArchive;
