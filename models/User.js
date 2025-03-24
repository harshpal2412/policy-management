const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    dob: { type: Date, required: true },
    address: String,
    phone: String,
    state: String,
    zipCode: String,
    email: String,
    gender: String,
    userType: String
});

module.exports = mongoose.model("User", UserSchema);
