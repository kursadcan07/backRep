/*
*  IMPORTS
*/
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
/*
*
* HERE THE DEFINITION OF PERMISSION SCHEMA AS MONGOOSE SCHEMA.
* MOST OF FIELDS DEFINED AS STRING BECAUSE OF ENCRYPTION LIB SUGGESTS STRING
* FORMAT STRONGLY.
*
*
* */
const permissionSchema = new mongoose.Schema({

    permissionID:Number,
    isPermissionActive:Boolean,
    userID:Number,
    userStatus:Number,

    personalName:String,
    demandDateOfPermission:Date,
    beginDateOfPermission:Date,
    endDateOfPermission:Date,

    foldCode:Number,
    areaCode:Number,

    permissionDescription:String,

    selectVehicleUsageName:String,
    selectVehicleUsageID:String,

    personalCarUsage:Boolean,
    priceOfTrainOrBus:Number,
    totalDistanceOfIndividualCar:Number,

    setPermissionType:Number,

    chiefConfirmStatus:Number,
    chiefsDescription:String,

    generalManagerConfirmStatus:Number,
    generalManagerDescription:String
});
/*
 * HERE A PLUGIN TO AUTO-INCREMENT OF PERMISSION OF AT THE DB.
 */
permissionSchema.plugin(AutoIncrement, {id:'counterOfPermissionID',inc_field: 'permissionID'});

/*
*  HERE A PLUGIN TO DETERMINE WHICH FIELDS ARE ENCRYPTED.WITH SALT GENERATOR AND SECRET KEY WORD.
 */
permissionSchema.plugin(mongooseFieldEncryption, {
    fields: ["permissionID","userID"],
    secret: "some secret key",
    saltGenerator: function(secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});
/*
 * HERE THE PERMISSION MODEL EXPORTED.
 */
const permissionModel = Model= module.exports = mongoose.model('permissionSchema', permissionSchema);
/*
*THIS METHOD RESETS PERMISSION ID TO 0.
 */
module.exports.resetIdCounter=function(){
    permissionModel.counterReset('counterOfPermissionID', function(err) {
        // Now the counter is 0
    });
}
/*
*   THIS METHOD DISPLAYS PERMISSIONS THAT BELONGS TO USER WHICH GIVEN AS "rawUserID" PARAMETER.
 */
module.exports.getPermissionsByUserID =  async function (rawUserID, callback)  {
    const messageToSearchWith = new permissionModel({userID:rawUserID});
    messageToSearchWith.encryptFieldsSync();
    const query = {userID: messageToSearchWith.userID};
    await permissionModel.find(query,callback);
}

module.exports.getPermissionsByUserIDAndData =  async function (userData, callback)  {
    const messageToSearchWith = new permissionModel({userID:userData.userID});
    messageToSearchWith.encryptFieldsSync();
    const query = {userID: messageToSearchWith.userID,isPermissionActive:userData.isPermissionActive};
    await permissionModel.find(query,callback);
}

/*
module.exports.getPermissionByPermissionID =  async function (rawPermissionID, callback)  {
    const messageToSearchWith = new permissionModel({permissionID:rawPermissionID});
    const query = {permissionID: messageToSearchWith.permissionID};
    await permissionModel.find (query,callback);
}
*/
