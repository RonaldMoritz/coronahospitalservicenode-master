const UTILS_CONTROLLER = require('./util.helper');
const Patient = require("../models/patient.model.js");


exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    console.log('In patient.controller and authentication with ', req.headers.authorization);

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        // Create a Patient
        const patient = new Patient({

            //  patient_id : req.body.patient_id,
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            birth_date: req.body.birth_date,
            sex: req.body.sex,
            symptoms: req.body.symptoms,
            insurance: req.body.insurance,
            street: req.body.street,
            house_no: req.body.house_no,
            zip_code: req.body.zip_code,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country

        });

        // Save Patient in the database
        Patient.create(patient, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Patient."
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


exports.findAll = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Patient.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving patients."
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

exports.findPatientsWithoutBed = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Patient.getPatientsWithoutBed((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving patients."
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

exports.findPatientsInHospitalization = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Patient.getPatientsInHospitalization((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving patients."
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

exports.findPatientsInArchive = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Patient.getPatientsInArchive((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving patients."
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