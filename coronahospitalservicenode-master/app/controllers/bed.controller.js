const UTILS_CONTROLLER = require('./util.helper');
const Bed = require("../models/bed.model.js");


exports.getAvailableBeds = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Bed.getNextAvailableBeds(req.params.hospital_id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found bed for hospital with id ${req.params.hospital_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving bed for hospital with id " + req.params.hospital_id
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

exports.findAvailableBeds = (req, res) => {

    UTILS_CONTROLLER.validateToken(req.headers.authorization).then(() => {
        Bed.getAvailableBeds((err, data) => {
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