const mongoose = require("mongoose");

const CarrierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
});

module.exports = mongoose.model("PolicyCarrier", CarrierSchema);