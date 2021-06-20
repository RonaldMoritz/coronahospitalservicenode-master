const UTILS_CONTROLLER = require('./util.helper');
const Hospitalization = require("../models/hospitalization.model.js");


exports.create = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Hospitalization
        const hospitalization = new Hospitalization({
            bed_no: req.body.bed_no,
            hospital_id: req.body.hospital_id,
            patient_id: req.body.patient_id,
            admission: req.body.admission,
        });

        // Save Hospitalization in the database
        Hospitalization.create(hospitalization, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the hospitalization."
                });
            else res.send(data);
        });
    }).catch((error) => {
        if (error.status === 401) {
            //error occurred
            res.status(error.status).send({
                message: error.msg
            });
        }
    });
};

exports.findHospitalization = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Hospitalization.getHospitalizationForPatientId(req.params.patient_id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Hospitalization for Patient with id ${req.params.patient_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving bed for hospital with id " + req.params.patient_id
                    });
                }
            } else res.send(data);
        });
    }).catch((error) => {
        if (error.status === 401) {
            //error occurred
            res.status(error.status).send({
                message: error.msg
            });
        }
    });
};

exports.delete = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Hospitalization.remove(req.params.patient_id, (err) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Hospitalization with id ${req.params.patient_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete Hospitalization with id " + req.params.patient_id
                    });
                }
            } else res.send({message: `Hospitalization was deleted successfully!`});
        });
    }).catch((error) => {
        if (error.status === 401) {
            //error occurred
            res.status(error.status).send({
                message: error.msg
            });
        }
    });
};