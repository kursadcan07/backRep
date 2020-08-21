const express = require('express');
const KittenModel = require('../models/KittySchema');
const app = express();

app.post('/kittyAdd/:name', async (req, res) => {

    const fluffy = new KittenModel({name: req.params.name});
    await fluffy.save();
    res.send(fluffy);

})

app.get('/kitty', async (req, res) => {

    const foods = await KittenModel.find({});
    try {
        res.send(foods);

    } catch (err) {

        res.status(500).send(err);

    }

});

module.exports = app
