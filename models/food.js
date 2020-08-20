const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    calories: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error("Negative calories aren't real.");
        }
    },
});

const Food = mongoose.model("FoodModel", FoodSchema);
module.exports = Food;

