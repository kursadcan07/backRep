const express = require('express');
const userModel = require('../models/userDataSchema');
const app = express();
app.use(express.json());

app.post('/addNewUser', (req, res) => {

    if (userModel.getUserByMail(req.body.userMail)) {
        res.send("Mail Kullanımdadır Başka Mail Adresi Giriniz");
        return;
    }

    try {
        let newUser = new userModel({
            userMail: req.body.userMail,
            password: req.body.password
        })
        userModel.addUser(newUser);
    } catch (err) {
        res.send("Alanı Uygun Formatta doldurunuz");
    }

    res.send("KAYIT BAŞARIYLA OLUŞTURULDU");

})

app.put("/", (req, res) => {

    res.send("Put isteği gönderildi.")

})

app.delete("/", (req, res) => {

    res.send("Delete isteği gönderildi.")

})

app.post('/login',(req, res) => {

    let newUser = new userModel({
        userMail: req.body.userMail,
        password: req.body.password
    })

    userModel.getUserByMail(newUser.userMail, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({success: false, msg: "User not found!"});
            }
            else {
                userModel.comparePassword(newUser, (err, user) => {
                        if (err) throw err;
                        if (!user) {
                            return res.json({success: false, msg: "Kullanıcı adı şifre hatalı !"});
                        }
                        else {
                            res.send("GİRİŞ BAŞARILI")
                        }
                    }
                )
            }
        }
    )



});

module.exports = app;
