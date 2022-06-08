const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = db.define('User', {
    name: {
        type: DataTypes.STRING, 
        required: true
    },
    email: {
        type: DataTypes.STRING,
        required: true
    },
    password: {
        type: DataTypes.STRING,
        required: true
    },
    cell: {
        type: DataTypes.STRING,
        required: true
    },
    state: {
        type: DataTypes.STRING,
        required: true
    },
    agronomo: {
        type: DataTypes.BOOLEAN,
        required: true,
        allowNull: false
    }
})

module.exports = User