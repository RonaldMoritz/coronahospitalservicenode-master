const UTILS_CONTROLLER = require('./util.helper');
const Hospital = require("../models/hospital.model.js");


exports.findSelection = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Hospital.getHospitalSelection((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving hospital selection."
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

exports.findUtilizationValues = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Hospital.getUtilizationValues((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving data."
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

exports.findIndividualUtilizationValues = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Hospital.getIndividualUtilizationValues((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving data."
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