const express = require("express");
const ExcelJS = require('exceljs');
const router = express.Router();
const Policy = require("../models/policy");
const multer = require("multer");
const { Worker } = require("worker_threads");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });


router.post("/add", async (req, res) => {
  try {
    const newPolicy = new Policy(req.body);
    await newPolicy.save();
    res.status(201).json({ message: "Policy created successfully", newPolicy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/aggregate", async (req, res) => {
    try {
        const aggregatedData = await Policy.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$policyHolder", "Unknown"] },
                    totalPolicies: { $sum: 1 },
                    totalPremium: { $sum: "$premiumAmount" }
                }
            },
            {
                $match: { _id: { $ne: "Unknown" } }
            }
        ]);
        res.status(200).json(aggregatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("📂 File received:", req.file.path);
        const worker = new Worker(path.join(__dirname, "../workers/uploadWorker.js"), {
            workerData: { filePath: req.file.path }
        });

        worker.on("message", (message) => {
            if (message.success) {
                res.status(200).json({ message: message.message });
            } else {
                res.status(500).json({ error: message.error });
            }
        });

        worker.on("error", (error) => {
            console.error("❌ Worker Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });

    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});


router.get("/search", async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: "Username query parameter is required" });
        }

        const policies = await Policy.find({ 
            policyHolder: { $regex: new RegExp(username, "i") } 
        });

        if (policies.length === 0) {
            return res.status(404).json({ message: "No policies found for this user" });
        }

        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;