const UTILS_CONTROLLER = require('./util.helper');
const PatientArchive = require("../models/patientArchive.model.js");


exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    let tokenCheckResult = UTILS_CONTROLLER.validateToken(req.headers.authorization);
    console.log(tokenCheckResult);
    if (tokenCheckResult.status === 401) {
        //eror occured
        res.status(tokenCheckResult.status).send({
            message: tokenCheckResult.msg
        });
        return;
    }

    // Create a patientArchive
    const patientArchive = new PatientArchive({

        bed_no: req.body.bed_no,
        hospital_id: req.body.hospital_id,
        patient_id: req.body.patient_id,
        admission: req.body.admission,
        discharge: req.body.discharge
    });

    // Save patientArchive in the database
    PatientArchive.create(patientArchive, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the patientArchive."
            });
        else res.send(data);
    });
};