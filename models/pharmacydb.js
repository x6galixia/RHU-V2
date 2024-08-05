const Pool = require('pg').Pool
require('dotenv').config()

const pharmacyPool = new Pool({
    user: process.env.DB_USER3,
    host: process.env.DB_HOST3,
    database: process.env.DB_NAME3,
    password: process.env.DB_PASSWORD3,
    port: process.env.DB_PORT3,
});

module.exports = pharmacyPool