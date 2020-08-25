const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    userID:Number,
    username:String,
    userType:Number,
    demandID:Number,
    demandDate:Date,
    demandBegin:String,
    demandEnd:String,

    foldCode:Number,
    areaCode:Number,
    vehicleUsageCode:Number,
    priceOfUsage:Number,
    personalCarUsage:Boolean,

    chiefStatus:Number,
    bossStatus:Number,
    explanationOfEmployee:String,
    explanationOfChief:String,
    explanationOfGeneralManager:String
});
module.exports = mongoose.model('permissionSchema', permissionSchema);
