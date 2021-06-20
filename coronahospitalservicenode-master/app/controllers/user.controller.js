const User = require("../models/user.model.js");


exports.getToken = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const USER_OBJ = {
        user_name: req.body.user_name,
        user_password: req.body.user_password
    };

    User.getLoginToken(USER_OBJ, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving User."
            });
        else res.send(data);
    });
};

exports.logout = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const TOKEN = req.body.token;

    User.logout(TOKEN, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving User."
            });
        else res.send(data);
    });
};