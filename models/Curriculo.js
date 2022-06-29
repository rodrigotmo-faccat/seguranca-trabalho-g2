const db = require('./db');

const Curriculo = db.sequelize.define('curriculo', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    web_address: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    experience: {
        type: db.Sequelize.STRING(1000),
        allowNull: false
    }
});

//Curriculo.sync({ alter: true });

module.exports = Curriculo;