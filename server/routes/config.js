const express = require("express");
const fs = require("fs");
const path = require("path");
const { saveConfig } = require("../config");

const router = express.Router();

function createConfigRoutes(config) {
  router.get("/config", (_req, res) => {
    res.json({
      scanDirectories: config.scanDirectories,
      bootstrapSourcePath: config.bootstrapSourcePath,
      port: config.port,
    });
  });

  router.post("/config/scan-directories", (req, res) => {
    const { directory } = req.body;

    if (!directory || typeof directory !== "string") {
      return res.status(400).json({ error: "directory (string) is required" });
    }

    const resolved = path.resolve(directory);

    if (!fs.existsSync(resolved)) {
      return res.status(400).json({ error: `Directory does not exist: ${resolved}` });
    }

    try {
      const stat = fs.statSync(resolved);
      if (!stat.isDirectory()) {
        return res.status(400).json({ error: "Path is not a directory" });
      }
    } catch (err) {
      return res.status(400).json({ error: `Cannot access directory: ${err.message}` });
    }

    if (config.scanDirectories.includes(resolved)) {
      return res.status(409).json({ error: "Directory is already being scanned" });
    }

    const updatedDirs = [...config.scanDirectories, resolved];
    const rawDirs = updatedDirs.map((d) => d.replace(/\\/g, "/"));

    try {
      saveConfig(config, { scanDirectories: rawDirs });
    } catch (err) {
      return res.status(500).json({ error: `Failed to save config: ${err.message}` });
    }

    console.log(`[DevDashboard] Added scan directory: ${resolved}`);
    res.json({ scanDirectories: config.scanDirectories });
  });

  router.delete("/config/scan-directories", (req, res) => {
    const { directory } = req.body;

    if (!directory || typeof directory !== "string") {
      return res.status(400).json({ error: "directory (string) is required" });
    }

    const resolved = path.resolve(directory);

    const index = config.scanDirectories.findIndex(
      (d) => path.resolve(d) === resolved
    );

    if (index === -1) {
      return res.status(404).json({ error: "Directory is not in the scan list" });
    }

    if (config.scanDirectories.length <= 1) {
      return res.status(400).json({ error: "Cannot remove the last scan directory" });
    }

    const updatedDirs = config.scanDirectories.filter((_, i) => i !== index);
    const rawDirs = updatedDirs.map((d) => d.replace(/\\/g, "/"));

    try {
      saveConfig(config, { scanDirectories: rawDirs });
    } catch (err) {
      return res.status(500).json({ error: `Failed to save config: ${err.message}` });
    }

    console.log(`[DevDashboard] Removed scan directory: ${resolved}`);
    res.json({ scanDirectories: config.scanDirectories });
  });

  return router;
}

module.exports = createConfigRoutes;
