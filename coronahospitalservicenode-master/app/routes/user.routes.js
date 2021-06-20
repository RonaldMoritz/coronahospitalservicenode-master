module.exports = app => {
    const user = require("../controllers/user.controller.js");

    let router = require("express").Router();

    // Retrieve Login credentials
    router.post("/", user.getToken);

    //logout
    router.post('/logout', user.logout)

    app.use('/api/user', router);
};