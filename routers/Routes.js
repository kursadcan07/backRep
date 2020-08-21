const express = require('express');
const newUserSchema = require('../models/userDataSchema');
const app = express();
app.use(express.json())

app.post('/addNewPersonel', async (req, res) => {

    try {
        const newUser = new newUserSchema({
            userName:req.body.userName,
            userMail:req.body.userMail,
            password:req.body.password
        });

        await newUser.save();

        res.send(req.body);

    }

    catch (err) {

        console.log(err);
        res.status(500).send("Server error");

    }

})

app.put("/", (req, res) => {

    res.send("Put isteği gönderildi.")

})

app.delete("/", (req, res) => {

    res.send("Delete isteği gönderildi.")

})

app.get('/displayMembers',async (req, res) => {

    const users = await newUserSchema.find({});
    res.send(users);

});


module.exports = app
