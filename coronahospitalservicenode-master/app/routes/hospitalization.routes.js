module.exports = app => {
    const hospitalization = require("../controllers/hospitalization.controller.js");

    let router = require("express").Router();

    // Create a new hospitalization
    router.post("/", hospitalization.create);

    router.get("/:patient_id", hospitalization.findHospitalization);

    router.delete("/:patient_id", hospitalization.delete);

    app.use('/api/hospitalization', router);
};