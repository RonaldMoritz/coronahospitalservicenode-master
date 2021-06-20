const sql = require("./db.js");

// constructor
const Bed = function (bed) {
    this.bed_no = bed.bed_no;
    this.floor = bed.floor;
    this.room = bed.room;
    this.hospital_id = bed.hospital_id;
};

Bed.getNextAvailableBeds = (hospital_id, result) => {
    sql.query("SELECT bed.bed_no, bed.hospital_id " +
        "FROM bed " +
        "LEFT JOIN hospitalization h ON bed.bed_no = h.bed_no AND bed.hospital_id = h.hospital_id " +
        "WHERE h.bed_no IS NULL AND bed.hospital_id =" + hospital_id +
        ";", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Bed.getAvailableBeds = (result) => {
    sql.query("SELECT bed.hospital_id, count(bed.hospital_id) AS amount_of_free_beds " +
        "FROM bed " +
        "LEFT JOIN hospitalization h ON bed.bed_no = h.bed_no AND bed.hospital_id = h.hospital_id " +
        "WHERE h.bed_no IS NULL " +
        "GROUP BY bed.hospital_id", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
};


module.exports = Bed;
