const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { loadConfig } = require("./config");

let config;
try {
  config = loadConfig();
} catch (err) {
  console.error(`[DevDashboard] Configuration error: ${err.message}`);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const createConfigRoutes = require("./routes/config");
const createProjectRoutes = require("./routes/projects");
const createFileRoutes = require("./routes/files");
app.use("/api", createConfigRoutes(config));
app.use("/api", createProjectRoutes(config));
app.use("/api", createFileRoutes(config));

const clientDist = path.resolve(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(config.port, () => {
  console.log(`[DevDashboard] Server running at http://localhost:${config.port}`);
  console.log(`[DevDashboard] Scanning directories:`);
  config.scanDirectories.forEach((dir) => console.log(`  - ${dir}`));
});

module.exports = { app, config };
