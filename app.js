const express = require('express');
const app = express();
const path = require('path');
//const router = express.Router();
const db = require('./db');
const Curriculo = require('./Curriculo');

app.get('/', async function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
    const cvs = Curriculo.findAll();
    console.log(cvs);
})

app.post('/cadastrar', async function(req, res) {
    await Curriculo.create({name: "Rodrigo", phone: "51985670888", email: "rodrigotmo@gmail.com", web_address: "www.bla.com.br", experience: "Programador"}).then(() => {
        res.sendStatus(200);
        console.log('Cadastrado com sucesso');
    }).catch((error) => {
        res.sendStatus(400);
        console.log('Falha no cadastro', error);
    });
    //res.sendStatus(200);
});

app.listen(process.env.port || 3000);