const express = require('express');
const userModel = require('../models/userDataSchema');
const app = express();
app.use(express.json());

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypteString(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

app.post('/addNewPersonel', (req, res) => {
    let newUser = new userModel({
        userMail: req.body.userMail,
        password: req.body.password
    });
    userModel.addUser(newUser);
    res.send("Successfully");
})

app.put("/", (req, res) => {

    res.send("Put isteği gönderildi.")

})

app.delete("/", (req, res) => {

    res.send("Delete isteği gönderildi.")

})

app.post('/login', async (req, res) => {
    try {
        const doesUserExit = await userModel.find({});
        res.send(doesUserExit[0]);

    } catch (err) {
        console.log("Hata")
    }

});


/*
*module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found!" });
    }
 */
module.exports = app;
/*


   userModel.getUserByUsername(userMail, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "User not found!"});
        }
    });




 try {
        const foundUser = await userModel.find({}).exec();
        res.send(foundUser);
        res.send("BAŞARILI")

    }
        catch (e) {console.log("ghata")
    }
 */
