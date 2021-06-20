/***
 * this is a helper file, not a controller
 * @type {{}}
 */

const sql = require("../models/db");
exports.validateToken = pToken => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT user_token, user_token_valid_until FROM user_login WHERE user_token = '" + pToken + "'", (err, res) => {
            if (err || res[0] == null) {
                console.log("error: ", err);
                reject({
                    status: 401,
                    msg: 'Token Select Error!'
                });
            }
            //token exists
            //check if it is still valid
            if (res[0].user_token_valid_until) {
                //get times
                let dateInDB = new Date(res[0].user_token_valid_until).getTime() + 60 * 60000;
                let currentTime = new Date().getTime() + 60 * 60000 //UTC +1
                if (currentTime < dateInDB) {
                    //is still valid
                    //renew token
                    currentTime += 24 // Minutes how long the session shall be valid
                        * 60000; // Milliseconds of a minute
                    let newDateForDB = new Date(currentTime).toMysqlFormat();
                    sql.query("UPDATE user_login SET user_token_valid_until = '" + newDateForDB + "' WHERE user_token = '" + pToken + "'", (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            reject({
                                status: 401,
                                msg: 'Token Update Error!'
                            });
                        }
                        console.log(pToken + ' is now valid until ' + newDateForDB);
                        resolve({
                            status: 200,
                            msg: 'Token OK!'
                        });
                    });
                } else {
                    //token expired
                    //send 401
                    reject({
                        status: 401,
                        msg: 'Token Expired!'
                    });
                }
            }
        });
    });
}

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};