const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
//const db = require('./models/db');
const Curriculo = require('./models/Curriculo');
const bodyParser = require('body-parser');
const xss = require('XSS')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    Curriculo.findAll().then((curriculos) => {
        res.render('curriculo', { curriculos: curriculos });
    });
});

app.get('/cadastrar-curriculo', function (req, res) {
    res.render('cadastrar-curriculo');
});

app.get('/consultar/:id', function (req, res) {
    Curriculo.findAll({
        where: {
            id: req.params.id
        }
    })
        .then((curriculo) => {
            res.render("consultar", { curriculo: curriculo[0] });
        })
        .catch((error) => {
            console.log('Erro ao consultar registro', error);
        });
});

app.post('/add-curriculo', function (req, res) {
    Curriculo.create({
        name: xss(req.body.name),
        phone: xss(req.body.phone),
        email: xss(req.body.email),
        web_address: xss(req.body.web_address),
        experience: xss(req.body.experience),

    }).then(() => {
        res.redirect('/');
        console.log('Cadastrado com sucesso');
    }).catch((error) => {
        res.sendStatus(400);
        console.log('Falha no cadastro', error);
    });
});

app.listen(3000);