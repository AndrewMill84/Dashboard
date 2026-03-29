const express = require("express");
const path = require("path");
const { scanForProjects, findProjectById } = require("../services/scanner");
const { parseStatusFile } = require("../services/statusParser");
const { detectArtifacts } = require("../services/artifactDetector");

const router = express.Router();

function createProjectRoutes(config) {
  router.get("/projects", (_req, res) => {
    try {
      const projects = scanForProjects(config.scanDirectories);

      const summaries = projects.map((project) => {
        if (!project.hasStatus) {
          return {
            id: project.id,
            name: project.name,
            hasStatus: false,
            currentStage: null,
            stageStatus: "not-started",
            currentActionRequired: null,
            whoActsNext: null,
            blockers: null,
            lastUpdated: null,
            stageNumber: null,
            completedStages: 0,
            totalStages: 10,
            parseError: "No STATUS.md found — project not yet initialized",
          };
        }

        const statusPath = path.join(project.path, "STATUS.md");
        const status = parseStatusFile(statusPath);

        const completedCount = status.completedArtifacts.filter(
          (a) => a.completed
        ).length;
        const totalArtifacts = status.completedArtifacts.length || 10;

        return {
          id: project.id,
          name: project.name,
          hasStatus: true,
          currentStage: status.currentStage,
          stageStatus: status.stageStatus,
          currentActionRequired: status.currentActionRequired,
          whoActsNext: status.whoActsNext,
          blockers: status.blockers,
          lastUpdated: status.lastUpdated,
          stageNumber: status.stageNumber,
          completedStages: completedCount,
          totalStages: totalArtifacts,
          parseError: status.parseError,
        };
      });

      res.json(summaries);
    } catch (err) {
      console.error("[API] Error listing projects:", err.message);
      res.status(500).json({ error: "Failed to list projects" });
    }
  });

  router.get("/projects/:id", (req, res) => {
    try {
      const project = findProjectById(config.scanDirectories, req.params.id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const artifacts = detectArtifacts(project.path);

      if (!project.hasStatus) {
        return res.json({
          id: project.id,
          name: project.name,
          path: project.path,
          hasStatus: false,
          project: project.name,
          currentStage: null,
          stageNumber: null,
          stageStatus: "not-started",
          objective: null,
          currentActionRequired: null,
          whoActsNext: null,
          artifactDueNext: null,
          requiredInputFromHuman: null,
          relevantFiles: null,
          openQuestions: null,
          blockers: null,
          lastCompletedStep: null,
          nextStepAfterCurrent: null,
          started: null,
          lastUpdated: null,
          completedArtifacts: [],
          stageHistory: [],
          parseError: "No STATUS.md found — project not yet initialized",
          artifactFiles: artifacts,
        });
      }

      const statusPath = path.join(project.path, "STATUS.md");
      const status = parseStatusFile(statusPath);

      res.json({
        id: project.id,
        name: project.name,
        path: project.path,
        hasStatus: true,
        ...status,
        artifactFiles: artifacts,
      });
    } catch (err) {
      console.error("[API] Error fetching project:", err.message);
      res.status(500).json({ error: "Failed to fetch project details" });
    }
  });

  return router;
}

module.exports = createProjectRoutes;
