const Sequelize = require('sequelize');
const db = require('./db');

const Curriculo = db.define('curriculo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    web_address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    experience: {
        type: Sequelize.STRING(1000),
        allowNull: false
    }
});

//Curriculo.sync();
//Curriculo.sync({ alter: true });

module.exports = Curriculo;