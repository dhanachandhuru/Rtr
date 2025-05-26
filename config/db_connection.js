const { Sequelize } = require("sequelize")

const env = process.env.NODE_ENV || "development"
const config = require("./config.js")

const sequelize_db = new Sequelize(config[env])
module.exports = sequelize_db
