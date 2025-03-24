const pidusage = require("pidusage");
const { exec } = require("child_process");


const CPU_THRESHOLD = 70;


const monitorCPU = () => {
  setInterval(() => {
    pidusage(process.pid, (err, stats) => {
      if (err) {
        console.error("❌ Error fetching CPU stats:", err);
        return;
      }

      const cpuUsage = stats.cpu.toFixed(2);
      console.log(`🖥️ CPU Usage: ${cpuUsage}%`);


      if (stats.cpu > CPU_THRESHOLD) {
        console.warn(`⚠️ High CPU detected (${cpuUsage}%)! Restarting server...`);
        restartServer();
      }
    });
  }, 5000);
};


const restartServer = () => {
  console.log("🔄 Restarting the server...");
  process.exit(1);
};

monitorCPU();
