const express = require('express');
const newUserSchema = require('../models/userDataSchema');
const app = express();
let _ = require("underscore");
let bodyParser= require("body-parser");

app.use(bodyParser.json());

app.post('/addNewPersonel',  (req, res) => {

    const newUser=
    let body= _.pick(req.body,"first_name","last_name","number");
    res.send(body.first_name);


})

app.put("/", (req,res) => {

    res.send("Put isteği gönderildi.")

})

app.delete("/", (req,res) => {

    res.send("Delete isteği gönderildi.")

})


app.get('/kitty',  (req, res) => {

    res.send("Node.js başarılı bir şekilde çalıştı.")

});

module.exports = app
