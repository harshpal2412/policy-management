const express = require("express");
const mongoose = require("mongoose");
const policyRoutes = require("./routes/policyRoutes");
const policiesRouter = require("./routes/policies");

const app = express();
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/policyDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


app.use("/api/policies", policyRoutes);
app.use("/api/policies", policiesRouter);

app.get("/", (req, res) => {
  res.send("🚀 Policy Management API is Running!");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
