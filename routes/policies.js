const express = require("express");
const ExcelJS = require('exceljs');
const router = express.Router();
const Policy = require("../models/policy");

router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Name query parameter is required" });
        }

        const policies = await Policy.find({ policyHolder: { $regex: name, $options: "i" } });

        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;