module.exports = app => {
    const patientArchive = require("../controllers/patientArchive.controller.js");

    let router = require("express").Router();

    // Create a new patientArchive
    router.post("/", patientArchive.create);

    app.use('/api/patientarchive', router);
};