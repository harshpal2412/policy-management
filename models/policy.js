const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
    policyNumber: String,
    policyHolder: String,
    premiumAmount: Number,
    startDate: Date,
    endDate: Date
});

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;