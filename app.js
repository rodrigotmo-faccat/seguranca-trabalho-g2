const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const db = require('./models/db');
const Curriculo = require('./models/Curriculo');
const QueryTypes  = require('sequelize');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
        res.render("curriculo", {curriculos: curriculos[0] });
    }).catch((error) => {
        console.log('Erro ao consultar registros', error);
    });
});

app.get('/cadastrar-curriculo', csrfProtection, function(req, res) {
    res.render('cadastrar-curriculo', {crsfToken: req.csrfToken()});
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

app.post('/add-curriculo', csrfProtection, function(req, res) {
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

    const name = req.body.name.replace(/[^A-Za-z]/g, '');
    const phone = req.body.phone.replace(/[^0-9]/g, '');
    const email = req.body.email.replace(/[^A-Za-z0-9.\-@]/g, '');
    const web_address = req.body.web_address.replace(/[^A-Za-z0-9.\-]/g, '');
    const experience = req.body.experience.replace(/[^A-Za-z0-9.!]/g, '');

    if (typeof name != 'string') {
        res.sendStatus(400);
    }
    if (typeof phone != 'string') {
        res.sendStatus(400);
    }
    if (typeof email != 'string') {
        res.sendStatus(400);
    }
    if (typeof web_address != 'string') {
        res.sendStatus(400);
    }
    if (typeof experience != 'string') {
        res.sendStatus(400);
    }

    if (isAthenticated(req.cookies["session"])) {
        db.sequelize.query(
            'INSERT INTO curriculos (name, phone, email, web_address, experience) VALUES (?,?,?,?,?)',
            {
                replacements: [name, 
                    phone, 
                    email, 
                    web_address, 
                    experience],
                type: QueryTypes.INSERT,
            }
        ).then(() => {
            res.redirect('/');
            console.log('Cadastrado com sucesso');
        }).catch((error) => {
            res.sendStatus(400); 
            console.log('Falha no cadastro', error);
        });
    } else {
        res.status(400).send("You shall not pass!");
    }
});

const isAthenticated = function(session) {
    return (session === "valid_user");
}

app.listen(3000);