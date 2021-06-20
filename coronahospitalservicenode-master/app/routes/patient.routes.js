module.exports = app => {
    const patient = require("../controllers/patient.controller.js");

    let router = require("express").Router();

    // Create a new Patient
    router.post("/", patient.create);

    // Retrieve all Patients
    router.get("/", patient.findAll);

    // Retrieve all Patients without bed
    router.get("/withoutbed", patient.findPatientsWithoutBed);

    // Retrieve all Patients in hospitalization
    router.get("/inhospitalization", patient.findPatientsInHospitalization);

    // Retrieve all Patients in archive
    router.get("/archive", patient.findPatientsInArchive);

    app.use('/api/patient', router);
};