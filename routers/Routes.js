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
    let flag = false;
    await userModel.getUserByMail(req.body.userMail, (err, user) => {
        if (err) throw err;
        if (user) {
            res.send({
                mes: "Mail Adresi Kullanımdadır Başka Adres Deneyiniz",
                stat: false
            })
        }
        else {
            let newUser = new userModel({
                userMail: req.body.userMail,
                userPassword: req.body.userPassword,
                personalName: req.body.personalName,
                userStatus: req.body.userStatus,
                chiefID:req.body.chiefID,
                generalManagerID:req.body.generalManagerID,
                userArea: req.body.userArea
            })
            newUser.save(function (err) {
                if (err) {
                    res.send({
                        mes: err,
                        stat: false
                    });
                }
                else
                {
                    res.send({
                        mes: "KAYIT BAŞARIYLA OLUŞTURULDU",
                        stat: true
                    })
                }
            });
        }
    });
});
/*------------------*/

/* THIS METHOD ALLOWS LOGIN OPERATION WITH EMAIL-PASSWORD VALIDATION */
app.post('/login', async (req, res) => {

    let newUser = new userModel({
        userMail: req.body.userMail,
        userPassword: req.body.userPassword,
        personalName: "__"
    });

    await userModel.getUserByMail(newUser.userMail, (err, user) => {
            if (err) {
                res.send({
                    mes: err,
                    stat: false
                })
            }
            if (!user) {
                //return res.json({success: false, msg: "User not found!"});
                res.send({
                    mes: "Mail Adresi Mevcut Değil !",
                    stat: false
                })
            } else {
                userModel.comparePassword(newUser, (err, user) => {
                        if (err) {
                            res.send({
                                mes: err,
                                stat: false
                            })
                        }
                        if (!user) {
                            res.send({
                                mes: "Şifre Yanlış",
                                stat: false
                            })
                        } else {
                            console.log(user);
                            res.send({
                                mes: "BAŞARILI GİRİŞ",
                                stat: true,
                                onlineUser: user
                            })

                        }
                    }
                )
            }
        }
    );
});

/* THIS METHOD CREATES NEW PERMISSION DEMANDS*/
app.post('/createPermission', (req, res) => {
    let flag;
    let newUserPermission;
    try {
        newUserPermission = new permissionModel({

            userID: req.body.userID,
            chiefID:req.body.chiefID,
            generalManagerID:req.body.generalManagerID,

            personalName: req.body.personalName,
            demandID: req.body.demandID,
            demandDateOfPermission: req.body.demandDateOfPermission,

            isPermissionActive:req.body.isPermissionActive,

            beginDateOfPermission: req.body.beginDateOfPermission,
            endDateOfPermission: req.body.endDateOfPermission,
            foldCode: req.body.foldCode,
            areaCode: req.body.areaCode,

            selectVehicleUsageName: req.body.selectVehicleUsageName,
            selectVehicleUsageID: req.body.selectVehicleUsageID,

            permissionDescription: req.body.permissionDescription,
            personalCarUsage: req.body.personalCarUsage,

            setPermissionType: req.body.setPermissionType,

            totalDistanceOfIndividualCar: req.body.totalDistanceOfIndividualCar,
            priceOfTrainOrBus: req.body.priceOfTrainOrBus,

            displayThePermissionName: req.body.displayThePermissionName,

            chiefConfirmStatus: 3,
            chiefsDescription: "şef açıklama",

            generalManagerConfirmStatus: 3,
            generalManagerDescription: "yönetici açıklama"

        })

        flag = true;

    } catch (e) {
        res.send("HATA OLUŞTU İZİN TALEP EDİLİRKEN !!")
        flag = false
    }
    if (flag) {
        newUserPermission.save();
        console.log(newUserPermission)
        res.send({
            stat: true,
            mes: "İzin yaratma başarılı",
            user: newUserPermission
        });
    } else {
        res.send({
            stat: false,
            mes: "İzin yaratma Başarısız"
        });
    }
});
/*------------------*/
/*************************************/


/*--------------------------------------*/
/*[ 2) GET-READ OPERATIONS DEFINED HERE ]*/
/*______________________________________*/

/* THIS METHOD DISPLAYS USERS PERMISSIONS WHOM GIVEN BY DYNAMIC ":userID" KEYWORD */
app.get('/displayUsersPermissions/:userID/:isPermissionActive', async (req, res) => {

    let newUserPermission = new permissionModel({
        userID: req.params.userID,
        isPermissionActive:req.params.isPermissionActive
    })

    await permissionModel.getPermissionsByUserIDandData(newUserPermission, (err, data) => {
            if (err) throw err;
            if (!data) {

                res.send({
                    stat: false,
                    mes: "Kullanıcının geçmiş izin talebi bulunamadı"
                });
            } else {
                res.send({
                    stat: true,
                    mes: "İzinler başarıyla getirildi",
                    prevPerms:data
                });
            }
        }
    );
});




app.get('/displayPermissionsForChief/:chiefID/:isPermissionActive', async (req, res) => {

    let newUserPermission = new permissionModel({
        chiefID: req.params.chiefID,
        isPermissionActive:req.params.isPermissionActive
    })

    await permissionModel.getPermissionsByChiefIDandData(newUserPermission, (err, data) => {
            if (err) throw err;
            if (!data) {

                res.send({
                    stat: false,
                    mes: "Kullanıcının geçmiş izin talebi bulunamadı"
                });
            } else {
                res.send({
                    stat: true,
                    mes: "İzinler başarıyla getirildi",
                    prevPerms:data
                });
            }
        }
    );
});
/*

app.get('/displayManagersPermissions/:chiefID/:isPermissionActive', async (req, res) => {

    let newUserPermission = new permissionModel({
        userID: req.params.chiefID,
        isPermissionActive:req.params.isPermissionActive
    })

    await permissionModel.getPermissionsByUserIDandRawData(newUserPermission, (err, data) => {
            if (err) throw err;
            if (!data) {
                res.send({
                    stat: false,
                    mes: "Kullanıcının geçmiş izin talebi bulunamadı"
                });
            } else {
                res.send({
                    stat: true,
                    mes: "İzinler başarıyla getirildi",
                    prevPerms:data
                });
            }
        }
    );
});
*/


app.get(('/DisplayPermissionForm/:permissionID'), (req, res) => {
    permissionModel.findOne({permissionID: parseInt(req.params.permissionID)}, function (err, data) {
        if (err) {
            throw Error(err)
        } else if (data ===null || data===undefined || data.length === 0) {
            res.send({
                stat: false,
                mes: "Kullanıcının geçmiş izin talebi buluwqeqwewqewqewqnamadı"
            });
        } else {
            console.log(data)
            res.send({
                stat: true,
                mes: "Kullanıcının İzni Başarıyla Getirildiwqwq",
                usersPermission:data
            });
        }
    })
})

//  return api.get('/displayUsersPermissions/' + this.props.chiefID + '/' + isActive)
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
    permissionModel.findOneAndUpdate({permissionID: req.body.permissionID}, {
        chiefStatus: "220",
        __enc_message: false
    }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result + " \n\t Başarıyla Revize Edilmiştir ");
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
