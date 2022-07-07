const express = require('express');
const app = express();

// Handlebars já elimina caracteres especiais ao carregar variáveis no FE
const handlebars = require('express-handlebars');

// Conexão com o banco de dados
const db = require('./models/db');

// Modelo de tabela
const Curriculo = require('./models/Curriculo');
const QueryTypes = require('sequelize');
const bodyParser = require('body-parser');

// Métodos permitidos
const allowedMethods = ['GET', 'HEAD', 'POST'];

// Gerando uma session no lado do servidor para prevenir XSS
const session = require('express-session');
app.use(session({
    secret: 'YOUSHALLNOTPASS!',
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
    resave: false,
}));

// Protegendo contra Cross Site History Manipulation com IFrame
const helmet = require('helmet');
app.use(helmet.frameguard({ action: 'DENY' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    if (!allowedMethods.includes(req.method)) {
        return res.send(405, 'Method Not Allowed');
    }
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

app.get('/cadastrar-curriculo', function (req, res) {
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).send('Method Not Allowed');
    }
    const secretToken = token();
    req.session.token = secretToken;
    res.render('cadastrar-curriculo', { crsfToken: secretToken });
});

app.get('/consultar/:id', function (req, res) {
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).send('Method Not Allowed');
    }

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

app.post('/add-curriculo', function (req, res) {
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).send('Método não permitido');
    }

    if (req.session.token != req.body._csrf) {
        return res.status(400).send('<h1 style="text-align: center;">NO TOLKIEN! YOU SHALL NOT PASS!</h1>');
    }

    console.log(req.body.name);
    const name = req.body.name.replace(/[^A-Za-z ]/g, '');
    const phone = req.body.phone.replace(/[^0-9]/g, '');
    const email = req.body.email.replace(/[^A-Za-z0-9.\-@]/g, '');
    const web_address = req.body.web_address.replace(/[^A-Za-z0-9.\-]/g, '');
    const experience = req.body.experience.replace(/[^A-Za-z0-9. ,]/g, '');

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

    db.sequelize.query('INSERT INTO curriculos (name, phone, email, web_address, experience) VALUES (?,?,?,?,?);',
        {
            replacements: [name,
                phone,
                email,
                web_address,
                experience],
            type: QueryTypes.INSERT,
        }).then(() => {
            res.redirect('/');
            console.log('Cadastrado com sucesso');
        }).catch((error) => {
            res.sendStatus(400);
            console.log('Falha no cadastro', error);
        });
});

const rand = function () {
    return Math.random().toString(36).substr(2);
};

const token = function () {
    return rand() + rand();
};

app.listen(3000);