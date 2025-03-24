const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
});

module.exports = mongoose.model("Account", AccountSchema);