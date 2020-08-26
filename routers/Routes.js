const express = require('express');
const userModel = require('../models/UserDataSchema');
const permissionModel = require('../models/PermissionSchema');
const app = express();
app.use(express.json());

/*
*  USER BASED OPERATIONS ***
* */
// ==> ADD NEW USER TO THE SYSTEM
app.post('/addNewUser', async (req, res ) => {
    await userModel.getUserByMail(req.body.userMail,(err, user) => {
        if (err) throw err;
        if (user) {
            res.send("Mail Adresi Kullanımdadır Başka Deneyiniz !")
        } else {
            try {
                let newUser = new userModel({
                    userMail: req.body.userMail,
                    password: req.body.password,
                    userName: req.body.username,
                    userStatus: req.body.userStatus,
                    userArea: req.body.userArea
                })

                newUser.save();

                res.send(newUser + "\n eklendi ...");

            } catch (e) {
                res.send("HATA");
            }
        }
    });
});

app.put("/changeChiefStatus", (req, res) => {
    permissionModel.findOneAndUpdate({_id: req.body.permissionID }, { $set: { chiefStatus: "50", __enc_message: false } });
    res.send("SUCCES");
});

app.delete("/deleteAllUsers", async (req, res) => {
    const resEm = await userModel.deleteMany({});
    res.send(resEm.deletedCount + "kadar silindi");

});

app.delete('/deleteUser/:userID', async (req, res) => {
    userModel.deleteOne({userID: req.params.userID}, function (err) {
        if (err) return (err);
        res.send(req.params.userID + " deleted !")
        // deleted at most one tank document
    });
});

app.post('/login', async (req, res) => {

    let newUser = new userModel({
        userMail: req.body.userMail,
        password: req.body.password
    });

    await userModel.getUserByMail(newUser.userMail, (err, user) => {
            if (err) throw err;
            if (!user) {
                //return res.json({success: false, msg: "User not found!"});
                res.send("Mail Adresi Mevcut Değil !")
            } else {
                userModel.comparePassword(newUser, (err, user) => {
                        if (err) throw err;
                        if (!user) {
                            res.send("ŞİFRE HATALI")
                        } else {
                            res.send("GİRİŞ BAŞARILI")
                        }
                    }
                )
            }
        }
    );
});

app.post('/createPermission', (req, res) => {
    try {
        let mockUserID = "20";
        let mockUsername = "VELİ";
        let mockUserType = "1";
        let mockDemandID = "100";
        let mockDemandDate = new Date(2020, 2, 21).toString();
        let mockFoldCode = "110";
        let mockAreaCode = "21";

        let mockChiefStatus = "1";
        let mockBossStatus = "3";

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
    } catch (e) {
        res.send("HATA OLUŞRU İZİN TALEP EDİLİRKEN !!")
    }
});

app.get('/displayUsersPermissions/:userID', async (req, res) => {

    let newUserPermission = new permissionModel({
        userID:req.body.userID
    })

    await permissionModel.getPermissionsByUserID(newUserPermission.userID, (err, data) => {
            if (err) throw err;
            if (!data) {
                res.send("KULLANICININ GEÇMİŞ İZNİ BULUNMAMAKTADIR");
            } else {
                res.send(data);
            }
        }
    );

});


app.get('/displayAllPermissions', (req, res) => {
    permissionModel.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.send("HATA");
        }

        if (data.length === 0) {
            console.log("No record found")
            res.send("HATA");
        } else {
            res.send(data);
        }


    })
});

app.delete("/deleteAllPermissions", async (req, res) => {
    const resEm = await permissionModel.deleteMany({});
    res.send(resEm.deletedCount + " kadar izin silindi");

});

app.put('/resetPermissionIDs', (req, res) => {
    permissionModel.resetIdCounter();
    res.send("İZİN ID'LERİ RESETLENDİ")
});

app.put('/resetUsersIDs', (req, res) => {
    userModel.resetTheIDcounter();
    res.send("RESETLENDİ")
});

app.get(('/displayEmployee/:userID'), (req, res) => {
    userModel.findOne({userID: req.params.userID}, function (err, data) {
        if (err) {
            throw Error(err)
        } else if (data.length === 0) {
            res.send("BURADA KAYIT YOK")
        } else {
            res.send(data);
        }

    })
})

app.get(('/displayAllEmployee'), (req, res) => {
    userModel.find({}, function (err, data) {
        if (err) {
            res.send("BURADA KAYIT YOK")
        } else if (data === null || data.length === 0) {
            res.send("BURADA KAYIT YOK")
        } else {
            res.send(data);
        }

    })
})

module.exports = app;
