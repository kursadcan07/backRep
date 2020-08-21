const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
    userID:{
        type:BigInt,
        unique:true
    },
    userName:{
        type:String,
        validate(value) {
            if (!validator.isAlphanumeric(value)) {
                throw new Error('Name cannot contain special characters.')
            }
        }
    },
    userMail:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }

    },
    password:{
        type:String,
        required:true,
        validate(value) {
            if(value.length<8) {
                throw new Error("Şifreniz min 8 karakter olmalı")
            }
        }
    }
});

const newUserModel = mongoose.model('newUserModel', newUserSchema);
module.exports = newUserModel;

