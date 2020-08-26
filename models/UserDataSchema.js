const mongoose = require('mongoose');
let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let passRegex = /^[a-zA-Z0-9]{4,10}$/
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const newUserSchema = new mongoose.Schema({
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
});

function checkEmailType(value) {
    return (emailRegex.test(value));
}

function validatePassword(value) {
    return (passRegex.test(value));
}

newUserSchema.plugin(mongooseFieldEncryption, {
    fields: ["userID","userMail","userName","userStatus","userArea","password"],
    secret: "some secret key",
    saltGenerator: function(secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

newUserSchema.plugin(AutoIncrement, {id:'counterOfID',inc_field: 'userID'});

const userModel = module.exports = mongoose.model('userModel', newUserSchema);

module.exports.getUserByMail = async function (userMailEx, callback) {
    const messageToSearchWith = new userModel({userMail:userMailEx});
    messageToSearchWith.encryptFieldsSync();
    const query = {userMail: messageToSearchWith.userMail};
    await userModel.findOne(query,callback);
}

module.exports.comparePassword = async function (userData, callback) {
    const messageToSearchWith = new userModel({userMail:userData.userMail,password: userData.password});
    messageToSearchWith.encryptFieldsSync();
    const query = {userMail: messageToSearchWith.userMail , password:messageToSearchWith.password};
    await userModel.findOne(query, callback);
}

module.exports.resetTheIDcounter=function(){
    userModel.counterReset('counterOfID', function(err) {
        // Now the counter is 0
    });
}
