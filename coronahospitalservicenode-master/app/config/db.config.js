/*
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "hoteldb",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
*/

module.exports = {
  HOST: "hotel-trip-service-server.mariadb.database.azure.com",
  USER: "RonaldMoritz@hotel-trip-service-server",
  PASSWORD: "KCa75dYdDpSKrM",
  DB: "hoteldb",
 dialect: "mariadb",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};