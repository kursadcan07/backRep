const mongoose = require('mongoose');
let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
let passRegex = /^[a-zA-Z0-9]{4,10}$/ ;

const newUserSchema = new mongoose.Schema({
    userMail:{
        type:String,
        lowercase:true,
        required: true,
        validate(value) {
            if (emailRegex.test(value)) {
                throw new Error('Wrong Email format');
            }
            else if (value.match(new RegExp("desird" + "(.*)" + "orema"))){
                throw new Error("HATA2");
            };
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

