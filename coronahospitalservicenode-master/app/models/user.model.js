const sql = require("./db.js");

// constructor
const User = function (user) {
    this.user_id = user.user_id;
    this.user_name = user.user_name;
    this.user_password = user.user_password;
};


function getCurrentTimeUTCPlusOne() {
    return new Date().getTime() + 60 * 60000; // For UTC +1 hour
}


User.logout = (pToken, result) => {
    sql.query("UPDATE user_login SET user_token = NULL, user_token_valid_until = NULL WHERE user_token = '" + pToken + "'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

User.getLoginToken = (userObj, result) => {

    sql.query("SELECT user_token, user_token_valid_until FROM user_login WHERE " +
        "user_name = '" + userObj.user_name + "' AND " +
        "user_password = '" + userObj.user_password + "'", (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else if (typeof res == 'undefined' || res.length <= 0 || res[0].user_token === 'undefined') {
            result(null, new Error('Credentials incorrect!'));
            return;
        }

        //user login was valid
        let q1result = {
            user_token: res[0].user_token,
            user_token_valid_until: res[0].user_token_valid_until,
        }


        //can be anonymous due to no async problem
        function insertTokenData(newToken, newValidUntil) {
            let sql_query = "UPDATE user_login SET " +
                "user_token = '" + newToken + "', " +
                "user_token_valid_until = '" + newValidUntil + "' " +
                "WHERE user_name = '" + userObj.user_name + "' AND " +
                "user_password = '" + userObj.user_password + "'";
            sql.query(sql_query, function (err, resultUpdate) {
                if (err) console.log('error while Updating a token, token: ' + newToken + ', user_name: ' + userObj.user_name);
                console.log("Updated token ->" + resultUpdate);
            });
        }


        if (q1result.isError) {
            //error for query
            result(null, q1result.error_msg);
        } else {
            //user credentials are OK
            if (q1result.user_token === null && q1result.user_token_valid_until === null) {
                //create Token and validUntil Timestamp
                let newToken = createToken(20);
                let newValidUntil = new Date(getCurrentTimeUTCPlusOne()
                    + 24 // Minutes how long the session shall be valid
                    * 60000 // Milliseconds of a minute
                ).toMysqlFormat();

                console.log('newToken=', newToken);
                console.log('newValidUntil=', newValidUntil);

                //insert them into the DB
                insertTokenData(newToken, newValidUntil);

                //return token + session lifetime
                result(null, {
                    token: newToken,
                    validUntil: newValidUntil
                });
            } else {
                result(null, 'Token and/or validUntil is not null');
            }
        }
    });
};


function createToken(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/***
 * Helper function for Date.prototype.toMysqlFormat
 * @param d
 * @returns {string}
 */
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

module.exports = User;