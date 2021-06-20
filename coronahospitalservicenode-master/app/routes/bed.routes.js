module.exports = app => {
    const bed = require("../controllers/bed.controller.js");

    let router = require("express").Router();

    router.get("/nextavailable/:hospital_id", bed.getAvailableBeds);

    router.get("/available", bed.findAvailableBeds);

    app.use('/api/bed', router);
};