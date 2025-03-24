const { parentPort, workerData } = require("worker_threads");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const Policy = require("../models/policy");


mongoose.connect("mongodb://127.0.0.1:27017/policyDB");

const processExcelFile = async (filePath) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        let policies = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; 
            policies.push({
                policyNumber: row.getCell(1).value,
                policyHolder: row.getCell(2).value,
                policyType: row.getCell(3).value,
                startDate: new Date(row.getCell(4).value),
                endDate: new Date(row.getCell(5).value),
                premiumAmount: parseFloat(row.getCell(6).value),
            });
        });


        await Policy.insertMany(policies);
        parentPort.postMessage({ success: true, message: "✅ Data inserted successfully!" });
    } catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
};


processExcelFile(workerData.filePath);
