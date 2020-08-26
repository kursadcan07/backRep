const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const permissionSchema = new mongoose.Schema({
    permissionID:Number,
    userID:Number,
    username:String,
    userType:String,
    demandID:String,
    demandDate:String,
    demandBegin:String,
    demandEnd:String,

    foldCode:String,
    areaCode:String,
    vehicleUsageCode:String,
    priceOfUsage:String,
    personalCarUsage:String,

    chiefStatus:String,
    bossStatus:String,
    explanationOfEmployee:String,
    explanationOfChief:String,
    explanationOfGeneralManager:String
});

permissionSchema.plugin(AutoIncrement, {id:'counterOfPermissionID',inc_field: 'permissionID'});

permissionSchema.plugin(mongooseFieldEncryption, {
    fields: ["permissionID","userID","username","userType","demandID","demandDate","demandBegin","demandEnd","foldCode",
        "areaCode","vehicleUsageCode","priceOfUsage","personalCarUsage","chiefStatus","bossStatus","explanationOfEmployee",
        "explanationOfChief","explanationOfGeneralManager"],
    secret: "some secret key",
    saltGenerator: function(secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

const permissionModel = Model= module.exports = mongoose.model('permissionSchema', permissionSchema);


module.exports.resetIdCounter=function(){
    permissionModel.counterReset('counterOfPermissionID', function(err) {
        // Now the counter is 0
    });
}

module.exports.getPermissionsByUserID =  async function (rawUserID, callback)  {
    const messageToSearchWith = new permissionModel({userID:rawUserID});
    messageToSearchWith.encryptFieldsSync();
    const query = {userID: messageToSearchWith.userID};
    await permissionModel.find(query,callback);
}
