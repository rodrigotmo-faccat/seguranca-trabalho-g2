const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./models/db');
const Curriculo = require('./models/Curriculo');
const bodyParser = require('body-parser');
const QueryTypes  = require('sequelize');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    /* Curriculo.findAll().then((curriculos) => {
        res.render('curriculo', {curriculos: curriculos});
    }); */
    db.sequelize.query(
        'SELECT * FROM curriculos;',
        {
            type: QueryTypes.SELECT,
        }
    ).then((curriculos) => {
        res.render("curriculo", { curriculos: curriculos[0] });
    }).catch((error) => {
        console.log('Erro ao consultar registros', error);
    });
});

app.get('/cadastrar-curriculo', function(req, res) {
    res.render('cadastrar-curriculo');
});

app.get('/consultar/:id', function(req, res) {
    /* Curriculo.findAll({
        where: {
            id: req.params.id
        }
    })
    .then((curriculo) => {
      res.render("consultar", { curriculo: curriculo[0] });
    })
    .catch((error) => {
      console.log('Erro ao consultar registro', error);
    }); */
    db.sequelize.query(
        'SELECT * FROM `curriculos` WHERE `id` = ?;',
        {
            model: Curriculo,
            replacements: [req.params.id],
            type: QueryTypes.SELECT
        }
    ).then((curriculo) => {
        res.render("consultar", { curriculo: curriculo[0] });
    }).catch((error) => {
        console.log('Erro ao consultar registro', error);
    });
});

app.post('/add-curriculo', function(req, res) {
    /* Curriculo.create({
        name: req.body.name, 
        phone: req.body.phone, 
        email: req.body.email, 
        web_address: req.body.web_address, 
        experience: req.body.experience
    }).then(() => {
        res.redirect('/');
        console.log('Cadastrado com sucesso');
    }).catch((error) => {
        res.sendStatus(400); 
        console.log('Falha no cadastro', error);
    }); */
    db.sequelize.query(
        'INSERT INTO curriculos (`name`, `phone`, `email`, `web_address`, `experience`) VALUES (?,?,?,?,?)',
        {
            model: Curriculo,
            replacements: [req.body.name, 
                req.body.phone, 
                req.body.email, 
                req.body.web_address, 
                req.body.experience],
            type: QueryTypes.INSERT
        }
    ).then(() => {
        res.redirect('/');
        console.log('Cadastrado com sucesso');
    }).catch((error) => {
        res.sendStatus(400); 
        console.log('Falha no cadastro', error);
    });
});

app.listen(3000);