const mongoose = require('mongoose');
let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let passRegex = /^[a-zA-Z0-9]{4,10}$/;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypteString (text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypteString (text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const newUserSchema = new mongoose.Schema({
    userMail: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = module.exports = mongoose.model('userModel', newUserSchema);


module.exports.addUser =  function(newUser){

    encryptedTotalPassword = encrypteString(newUser.password);
    encryptedTotalMail = encrypteString(newUser.userMail);

    newUser.userMail = encryptedTotalMail.encryptedData;
    newUser.password = encryptedTotalPassword.encryptedData;

    newUser.save();
    console.log("new user has been added");
    //console.log(decrypteString( encryptedTotalPassword));

}


module.exports.comparePassword = function(userData){

}

module.exports.getUserByMail = async function(enteredUserMail){
    const foundUser =  userModel.exists({userMail:encrypteString(enteredUserMail).encryptedData});

    console.log(foundUser);
    return (foundUser);
}
/*
*{"_id":{"$oid":"5f43b5aabe07a74c22bfc7d5"},
* "userMail":"2861dded262cdd59caf1754b0c8aa7d3cf18b70e5fe9630dfbc6b4210371b137",
* "password":"2ddd841124887999dbbd7effb8550c2b","__v":{"$numberInt":"0"}}
*
* module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}
 */



