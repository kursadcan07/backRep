const mongoose = require('mongoose');
let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let passRegex = /^[a-zA-Z0-9]{4,10}$/;

const newUserSchema = new mongoose.Schema({
    userMail: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        encryptedData: String,
        required: true
    }
});

const userModel = module.exports = mongoose.model('userModel', newUserSchema);

module.exports.addUser = function (userCandidate) {
    try {
        userCandidate.save();
    } catch (err) {
        console.log("Kayıt oluşturulurken hata ! ")
    }
}

module.exports.comparePassword = function (userData,callback) {
    const query = {userMail:userData.userMail,password:userData.password};
    userModel.findOne(query,callback);
}

module.exports.getUserByMail = function (userMailEx, callback) {
    const query = {userMail: userMailEx}
    userModel.findOne(query, callback);
}





