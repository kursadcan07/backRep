/*
*  IMPORTS
*/

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

/*
*   HERE THE REGEX DEFINITIONS TO VALIDATE E-MAIL AND PASSWORD.
 */
/*
let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let passRegex = /^[a-zA-Z0-9]{4,10}$/
*/

/*
* HERE THE USER SCHEMA DEFINED AS MONGOOSE SCHEMA WITH IN VALIDATORS.
*/

const newUserSchema = new mongoose.Schema({
    userID: {
        type: Number,
        unique:true
    },
    userMail: {
        type: String,
        lowercase: true,
        required: true
    },
    signature:
        { data: Buffer,
          contentType: String,
          existence:Boolean},
    personalName: {
        type: String,
        required: true,
    },
    userStatus: {
        type: Number,
        required: true
    },
    userArea: {
        type: String,
        required: true
    },
    chiefID:{
        type:Number,
        required:true,
    },
    generalManagerID:{
      type:Number,
      required:true,
    },
    userPassword: {
        type: String,
        required: true
    }
});

/*
* PLUGIN IMPLEMENTED HERE TO ENCRYPT FIELDS.
*/
newUserSchema.plugin(mongooseFieldEncryption, {
    fields: ["userPassword"],
    secret: "some secret key",
    saltGenerator: function(secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});
/*
*HERE THE AUTO INCREMENT METHOD IMPLEMENTED.
 */

newUserSchema.plugin(AutoIncrement, {id:'userIDs',inc_field: 'userID'});
/*
*   HERE THE MODEL EXPORTED
*/
const userModel = module.exports = mongoose.model('userModel', newUserSchema);

/*
 * THIS METHOD FINDS USER BY GIVEN E-MAIL WITH IN DECRYPT METHOD.
 */
module.exports.getUserByMail = async function (userMailEx, callback) {
    const messageToSearchWith = new userModel({userMail:userMailEx});
    messageToSearchWith.encryptFieldsSync();
    const query = {userMail: messageToSearchWith.userMail};
    await userModel.findOne(query,callback);
}

/*
 * THIS METHOD CHECKS E-MAIL-PASSWORD VALIDATION.
 */
module.exports.comparePassword = async function (userData, callback) {
    const messageToSearchWith = new userModel({userMail:userData.userMail,userPassword: userData.userPassword});
    messageToSearchWith.encryptFieldsSync();
    const query = {userMail: messageToSearchWith.userMail , userPassword:messageToSearchWith.userPassword};
    await userModel.findOne(query, callback);
}
/*
 * THIS METHOD RESETS USER ID
 */
module.exports.resetUserIDs=function(){
    userModel.counterReset('userIDs', function(err) {
        // Now the counter is 0
    });
}
