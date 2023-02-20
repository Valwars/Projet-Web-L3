const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },

    description: {
        type: String,
        required: true,
        min: 10,
        max: 600,
    },

    localisation: {
        type: String,
        required: true,
    },

    profile_pic: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
    },

    sexual_preference: {
        type: String,
        required: true,
    },
    match_number: {
        type: Number,
        default: 0
    },
    swipe_number: {
        type: Number,
        default: 0
    },
    profile_visits: {
        type: Number,
        default: 0
    },


});

module.exports = mongoose.model("Users", userSchema);