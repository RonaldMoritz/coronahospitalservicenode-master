const mariadb = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mariadb.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//open the mariadb connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

/**
 * Since Azure has a 'garbage collector' itself
 * */
let CronJob = require('cron').CronJob;
let job = new CronJob('*/20 * * * * *', function () {
    ping();

}, null, true, null);
job.start();

function ping() {
    connection.query('SELECT hospital_id FROM hospitals WHERE hospital_id = 1', function (err) {
        if (err) throw err;
        console.log('--db ping');
    });
}

//reset login -> no users are logged in now
connection.query('UPDATE user_login SET user_token = NULL, user_token_valid_until = NULL WHERE user_id > 0;', function (err) {
    if (err) throw err;
});

module.exports = connection;