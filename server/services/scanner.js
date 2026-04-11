const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const MAX_SCAN_DEPTH = 12;

/** Skip noisy or huge subtrees when searching for STATUS.md */
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".cursor",
  ".codex",
  "dist",
  "build",
  ".next",
  "venv",
  ".venv",
  "__pycache__",
  ".pytest_cache",
  "coverage",
  ".turbo",
  ".cache",
  "AppData",
  "Application Data",
  "Cookies",
  "Local Settings",
  "PrintHood",
  "NetHood",
  "Recent",
  "SendTo",
  "Templates",
  "Start Menu",
]);

function hasStatusFile(dirPath) {
  try {
    fs.accessSync(path.join(dirPath, "STATUS.md"), fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function shouldSkipDir(name) {
  if (SKIP_DIR_NAMES.has(name)) return true;
  return false;
}

/** Stable id for API routes (same folder always maps to same id). */
function projectIdFromPath(folderPath) {
  const resolved = path.resolve(folderPath);
  const hash = crypto.createHash("sha1").update(resolved).digest("hex").slice(0, 16);
  return `p-${hash}`;
}

/**
 * Depth-first search: every directory that contains STATUS.md is a project.
 * Subdirectories are still visited so nested repos can appear separately.
 */
function walkForStatusDirs(dir, onStatusDir, depth) {
  if (depth > MAX_SCAN_DEPTH) return;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  if (hasStatusFile(dir)) {
    onStatusDir(dir);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (shouldSkipDir(entry.name)) continue;
    const sub = path.join(dir, entry.name);
    walkForStatusDirs(sub, onStatusDir, depth + 1);
  }
}

function scanForProjects(scanDirectories) {
  const projects = [];
  const seenPaths = new Set();

  scanDirectories.forEach((scanDir) => {
    const resolvedScanDir = path.resolve(scanDir);

    let stat;
    try {
      stat = fs.statSync(scanDir);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(
          `[Scanner] Scan directory does not exist, skipping: ${scanDir}`
        );
      } else {
        console.warn(
          `[Scanner] Cannot stat scan directory "${scanDir}": ${err.message}`
        );
      }

      if (!seenPaths.has(resolvedScanDir)) {
        seenPaths.add(resolvedScanDir);
        projects.push({
          id: projectIdFromPath(scanDir),
          name: path.basename(scanDir),
          path: scanDir,
          scanDirectory: scanDir,
          hasStatus: false,
        });
      }
      return;
    }

    if (!stat.isDirectory()) {
      console.warn(`[Scanner] Scan path is not a directory: ${scanDir}`);
      if (!seenPaths.has(resolvedScanDir)) {
        seenPaths.add(resolvedScanDir);
        projects.push({
          id: projectIdFromPath(scanDir),
          name: path.basename(scanDir),
          path: scanDir,
          scanDirectory: scanDir,
          hasStatus: false,
        });
      }
      return;
    }

    let foundStatusUnderRoot = false;

    walkForStatusDirs(
      scanDir,
      (statusDir) => {
        const resolved = path.resolve(statusDir);
        if (seenPaths.has(resolved)) return;
        seenPaths.add(resolved);
        foundStatusUnderRoot = true;
        projects.push({
          id: projectIdFromPath(statusDir),
          name: path.basename(statusDir),
          path: statusDir,
          scanDirectory: scanDir,
          hasStatus: true,
        });
      },
      0
    );

    if (!foundStatusUnderRoot && !seenPaths.has(resolvedScanDir)) {
      seenPaths.add(resolvedScanDir);
      projects.push({
        id: projectIdFromPath(scanDir),
        name: path.basename(scanDir),
        path: scanDir,
        scanDirectory: scanDir,
        hasStatus: false,
      });
    }
  });

  return projects;
}

function findProjectById(scanDirectories, projectId) {
  const all = scanForProjects(scanDirectories);
  return all.find((p) => p.id === projectId) || null;
}

module.exports = {
  scanForProjects,
  findProjectById,
  projectIdFromPath,
};
