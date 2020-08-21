const mongoose = require('mongoose');
let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
let passRegex = /^[a-zA-Z0-9]{4,10}$/ ;

const newUserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        validate(value) {
            if (value.length>15) {
                throw new Error('Name cannot longer than 15')
            }
        }
    },
    userMail:{
        type:String,
        lowercase:true,

        validate(value) {
            if (emailRegex.test(value)) {
                throw new Error('Email is invalid')
            }
        }

    },
    password:{
        type:String,
        required:true,
        validate(value) {
            if(!passRegex.test(value)) {
                throw new Error("Şifreniz min 8 karakter olmalı")
            }
        }
    }
});

const newUserModel = mongoose.model('newUserModel', newUserSchema);
module.exports = newUserModel;

