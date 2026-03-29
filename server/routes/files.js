const express = require("express");
const fs = require("fs");
const path = require("path");
const { findProjectById } = require("../services/scanner");
const { validateFilePath } = require("../utils/pathSecurity");
const { ALTERNATE_PATHS } = require("../services/artifactDetector");

const router = express.Router();

function createFileRoutes(config) {
  router.get("/projects/:id/files", (req, res) => {
    try {
      const project = findProjectById(config.scanDirectories, req.params.id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const entries = fs.readdirSync(project.path, { withFileTypes: true });
      const files = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .sort();

      res.json(files);
    } catch (err) {
      console.error("[API] Error listing files:", err.message);
      res.status(500).json({ error: "Failed to list files" });
    }
  });

  router.get("/projects/:id/files/:filename", (req, res) => {
    try {
      const project = findProjectById(config.scanDirectories, req.params.id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const validation = validateFilePath(
        project.path,
        req.params.filename,
        config.scanDirectories
      );

      if (!validation.valid) {
        return res.status(403).json({ error: validation.error });
      }

      let filePath = validation.resolvedPath;

      if (!fs.existsSync(filePath)) {
        const altRelative = ALTERNATE_PATHS[req.params.filename];
        if (altRelative) {
          const altValidation = validateFilePath(
            project.path,
            altRelative,
            config.scanDirectories
          );
          if (altValidation.valid && fs.existsSync(altValidation.resolvedPath)) {
            filePath = altValidation.resolvedPath;
          } else {
            return res.status(404).json({ error: "File not found" });
          }
        } else {
          return res.status(404).json({ error: "File not found" });
        }
      }

      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        return res.status(400).json({ error: "Path is a directory, not a file" });
      }

      const content = fs.readFileSync(filePath, "utf8");
      res.json({ filename: req.params.filename, content });
    } catch (err) {
      console.error("[API] Error reading file:", err.message);
      res.status(500).json({ error: "Failed to read file" });
    }
  });

  return router;
}

module.exports = createFileRoutes;
