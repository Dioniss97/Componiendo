'use strict';

const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');
const process = require('process');
const initModels = require("./init-models"); 

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    
    host: process.env.DATABASE_HOST,
    dialect: "mysql",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const db = initModels(sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;