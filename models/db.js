const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://localhost:3360/trabalho_g2', { username: 'root', password: 'root' });

sequelize.authenticate().then(() => {
    console.log('Conectou no db');
}).catch((error) => {
    console.log('Erro ao conectar no db - ', error);
});

module.exports = {Sequelize, sequelize};
