/*
 * IMPORTS
 */
const express = require('express');
const userModel = require('../models/UserDataSchema');
const permissionModel = require('../models/PermissionSchema');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

/*-----CRUD OPERATIONS ROUTERS----------*/


/*-------------------------------------------*/
/*[  1) ADD-CREATE OPERATIONS DEFINED HERE  ]*/
/*___________________________________________*/

/* THIS METHOD ADDS NEW USER TO THE SYSTEM */
app.post('/addNewUser', async (req, res) => {
    await userModel.getUserByMail(req.body.userMail, (err, user) => {
        if (err) throw err;
        if (user) {
            res.send("Mail Adresi Kullanımdadır Başka Deneyiniz !")
        } else {
            try {
                let newUser = new userModel({
                    userID:req.body.userID,
                    userMail: req.body.userMail,
                    password: req.body.password,
                    userName: req.body.userName,
                    userStatus: req.body.userStatus,
                    userArea: req.body.userArea
                })

                newUser.save();

                res.send({
                    mes:"YENİ KAYIT BAŞARIYLA YARATILDI",
                    stat:true
                });

            } catch (e) {
                res.send({
                    mes:"YENİ KAYIT YARATILAMADI",
                    stat:false
                });
            }
        }
    });
});
/*------------------*/

/* THIS METHOD ALLOWS LOGIN OPERATION WITH EMAIL-PASSWORD VALIDATION */
app.post('/login', async (req, res) => {

    let newUser = new userModel({
        userMail: req.body.userMail,
        password: req.body.password
    });

    await userModel.getUserByMail(newUser.userMail, (err, user) => {
            if (err) throw err;
            if (!user) {
                //return res.json({success: false, msg: "User not found!"});
                res.send({mes:"Mail Adresi Mevcut Değil !",
                                stat:false})
            } else {
                userModel.comparePassword(newUser, (err, user) => {
                        if (err) throw err;
                        if (!user) {
                            res.send({mes:"Şifre Yanlış",
                                stat:false})
                        } else {

                            res.send({mes:"BAŞARILI GİRİŞ",
                                            stat:true,
                                            onlineUser:user
                            })

                        }
                    }
                )
            }
        }
    );
});
/*
userID: {
    type: Number,
        unique:true
},
userMail: {
    type: String,
        lowercase: true,
        required: true,
        validate: [checkEmailType, 'Password is not in true form']
},
userName: {
    type: String,
        required: true,
},
userStatus: {
    type: String,
        required: true
},
userArea: {
    type: String,
        required: true
},
password: {
    type: String,
        required: true,
        validate: [validatePassword, 'Password is not in true form']
}
});*/
/*------------------*/

/* THIS METHOD CREATES NEW PERMISSION DEMANDS*/
app.post('/createPermission', (req, res) => {
    try {
        let mockUserID = "100";
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
/*------------------*/
/*************************************/



/*--------------------------------------*/
/*[ 2) GET-READ OPERATIONS DEFINED HERE ]*/
/*______________________________________*/

/* THIS METHOD DISPLAYS USERS PERMISSIONS WHOM GIVEN BY DYNAMIC ":userID" KEYWORD */
app.get('/displayUsersPermissions/:userID', async (req, res) => {

    let newUserPermission = new permissionModel({
        userID: req.body.userID
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
/*------------------*/

/*THIS METHOD DISPLAYS ALL PERMISSIONS IN THE SYSTEM INDEPENDENTLY FROM USER */
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
/*------------------*/

/*THIS METHOD DISPLAYS PERSONAL INFORMATION THAT BELONGS TO USER THAT DISTINGUISHED BY DYNAMIC URL PART "userID" */
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
/*------------------*/
/*THIS METHOD DISPLAYS WHOLE EMPLOYEES IN THE SYSTEM */
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
/*------------------*/
/*************************************/


/*----------------------------------------*/
/*[ 3)PUT-UPDATE OPERATIONS DEFINED HERE ]*/
/*________________________________________*/

/*THIS METHOD FINDS FILTERED PERMISSION AND UPDATES IT */
app.put("/changeChiefStatus", (req, res) => {
    permissionModel.findOneAndUpdate({ permissionID: req.body.permissionID},{chiefStatus:"220",__enc_message: false }, function(err,result)
    {
        if (err) {
            res.send(err);
        } else {
            res.json(result +" \n\t Başarıyla Revize Edilmiştir " );
        }
    });
});
/*------------------*/

/*THIS METHOD RESETS PERMISSIONS ID */
app.put('/resetPermissionIDs', (req, res) => {
    permissionModel.resetIdCounter();
    res.send("İZİN ID'LERİ RESETLENDİ")
});
/*------------------*/

/*THIS METHOD RESETS USERS ID */
app.put('/resetUsersIDs', (req, res) => {
    userModel.resetUserIDs();
    res.send("RESETLENDİ")
});
/*------------------*/
/*************************************/



/*-----------------------------------*/
/*[ 4)DELETE OPERATIONS DEFINED HERE ]*/
/*___________________________________*/


/*THIS METHOD DELETES ALL USERS*/
app.delete("/deleteAllUsers", async (req, res) => {
    const resEm = await userModel.deleteMany({});
    res.send(resEm.deletedCount + "kadar silindi");

});
/*------------------*/

app.delete('/deleteUser/:userID', async (req, res) => {
    userModel.deleteOne({userID: req.params.userID}, function (err) {
        if (err) return (err);
        res.send(req.params.userID + " deleted !")
        // deleted at most one tank document
    });
});
/*------------------*/
/*************************************/



app.delete("/deleteAllPermissions", async (req, res) => {
    const resEm = await permissionModel.deleteMany({});
    res.send(resEm.deletedCount + " kadar izin silindi");

});

module.exports = app;
