const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Image Schema for storing images in the
    mongodb database
*/
let SignatureSchema = new Schema({
    userID:Number,
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    }
});
let Image = mongoose.model('SignatureSchema', SignatureSchema);

module.exports = Image;
