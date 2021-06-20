const sql = require("./db.js");

// constructor
const Hospitalization = function (hospitalization) {
    this.bed_no = hospitalization.bed_no;
    this.hospital_id = hospitalization.hospital_id;
    this.patient_id = hospitalization.patient_id;
    this.admission = hospitalization.admission;

};

Hospitalization.create = (newHospitalization, result) => {
    sql.query("INSERT INTO hospitalization SET ?", newHospitalization, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newHospitalization});
    });
};

Hospitalization.getHospitalizationForPatientId = (patient_id, result) => {
    sql.query("SELECT * " +
        "FROM hospitalization " +
        "WHERE  hospitalization.patient_id = " + patient_id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Hospitalization.remove = (patient_id, result) => {
    sql.query("DELETE FROM hospitalization WHERE patient_id = ?", patient_id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Hospitalization with the patient_id
            result({kind: "not_found"}, null);
            return;
        }

        result(null, res);
    });
};

module.exports = Hospitalization;
