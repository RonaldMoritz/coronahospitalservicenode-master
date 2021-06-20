module.exports = app => {
    const hospital = require("../controllers/hospital.controller.js");

    let router = require("express").Router();

    // Retrieve hospital selection
    router.get("/selection", hospital.findSelection);

    // Retrieve utilization values
    router.get("/utilization", hospital.findUtilizationValues);

    // Retrieve all utilization values
    router.get("/individualutilization", hospital.findIndividualUtilizationValues);


    app.use('/api/hospital', router);
};