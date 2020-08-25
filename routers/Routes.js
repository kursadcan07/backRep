const express = require('express');
const userModel = require('../models/UserDataSchema');
const permissionModel = require('../models/PermissionSchema');

const app = express();
app.use(express.json());

app.post('/addNewUser', (req, res) => {

    if (userModel.getUserByMail(req.body.userMail)) {
        res.send("Mail Kullanımdadır Başka Mail Adresi Giriniz");
        return null;
    }

    try {
        let newUser = new userModel({
            userMail: req.body.userMail,
            password: req.body.password
        })
        newUser.save();
        res.send("OK");

    } catch (e) {
        res.send("HATA");
    }

})

app.put("/", (req, res) => {

    res.send("Put isteği gönderildi.")

})

app.delete("/", (req, res) => {

    res.send("Delete isteği gönderildi.")

})

app.post('/login', (req, res) => {

    let newUser = new userModel({
        userMail: req.body.userMail,
        password: req.body.password
    })

    userModel.getUserByMail(newUser.userMail, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({success: false, msg: "User not found!"});
            } else {
                userModel.comparePassword(newUser, (err, user) => {
                        if (err) throw err;
                        if (!user) {
                            return res.json({success: false, msg: "Kullanıcı adı şifre hatalı !"});
                        } else {
                            res.send("GİRİŞ BAŞARILI")
                        }
                    }
                )
            }
        }
    )
});

app.post('/createPermission',(req,res)=>{
    try {
        let mockUserID = 5;
        let mockUsername = "VELİ";
        let mockUserType = 1;
        let mockDemandID = 100;
        let mockDemandDate = new Date(2020, 2, 21);
        let mockFoldCode = 110;
        let mockAreaCode = 21;

        let mockChiefStatus = 1;
        let mockBossStatus = 3;

        let descriptionOfChief = "İZİN VERMEME YOĞUNLUK VAR";
        let descriptionOfManager = "SAATİ 22 YE REVİZE EDERSENİZ UYGUNDUR !";


        let newUserPermission = new permissionModel({
            userID: mockUserID,
            username: mockUsername,
            userType: mockUserType,
            demandID: mockDemandID,
            demandDate: mockDemandDate,

            demandBegin: req.body.beginDate,
            demandEnd: req.body.endDate,

            foldCode: mockFoldCode,
            areaCode: mockAreaCode,
            vehicleUsageCode: req.body.vehicleUsageIndex,
            priceOfUsage: req.body.priceOfTransportation,
            personalCarUsage: req.body.individualCarUsage,

            explanationOfEmployee: req.body.descriptionOfEmployee,
            chiefStatus: mockChiefStatus,
            bossStatus: mockBossStatus,
            explanationOfChief: descriptionOfChief,
            explanationOfGeneralManager: descriptionOfManager
        })
        newUserPermission.save();
        res.send(newUserPermission);
    }catch (e) {
        res.send("HATA OLUŞRU İZİN TALEP EDİLİRKEN !!")
    }

})

app.get('/displayAllPermissions/:userID',(req,res)=>{
    permissionModel.find({userID: req.params.userID }, function(err, data){
        if(err){
            console.log(err);
            res.send("HATA");
        }

        if(data.length === 0) {
            console.log("No record found")
            res.send("HATA");
        }

        res.send(data);
    })
})




module.exports = app;
