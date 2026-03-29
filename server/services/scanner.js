const fs = require("fs");
const path = require("path");

function hasStatusFile(dirPath) {
  try {
    fs.accessSync(path.join(dirPath, "STATUS.md"), fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function scanForProjects(scanDirectories) {
  const projects = [];
  const seenPaths = new Set();

  scanDirectories.forEach((scanDir, dirIndex) => {
    const resolvedScanDir = path.resolve(scanDir);
    const selfHasStatus = hasStatusFile(scanDir);

    // If this directory itself has STATUS.md, add it as a project
    if (selfHasStatus && !seenPaths.has(resolvedScanDir)) {
      seenPaths.add(resolvedScanDir);
      projects.push({
        id: `${dirIndex}-${path.basename(scanDir).toLowerCase()}`,
        name: path.basename(scanDir),
        path: scanDir,
        scanDirectory: scanDir,
        hasStatus: true,
      });
    }

    // Scan child directories for projects
    let entries;
    try {
      entries = fs.readdirSync(scanDir, { withFileTypes: true });
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(
          `[Scanner] Scan directory does not exist, skipping: ${scanDir}`
        );
      } else {
        console.warn(
          `[Scanner] Cannot read scan directory "${scanDir}": ${err.message}`
        );
      }

      // Directory doesn't exist or can't be read — still show it as a tile
      if (!seenPaths.has(resolvedScanDir) && !selfHasStatus) {
        seenPaths.add(resolvedScanDir);
        projects.push({
          id: `${dirIndex}-${path.basename(scanDir).toLowerCase()}`,
          name: path.basename(scanDir),
          path: scanDir,
          scanDirectory: scanDir,
          hasStatus: false,
        });
      }
      return;
    }

    let foundChildren = false;
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const folderPath = path.join(scanDir, entry.name);
      const resolvedPath = path.resolve(folderPath);

      if (seenPaths.has(resolvedPath)) continue;
      if (!hasStatusFile(folderPath)) continue;

      foundChildren = true;
      seenPaths.add(resolvedPath);
      projects.push({
        id: `${dirIndex}-${entry.name.toLowerCase()}`,
        name: entry.name,
        path: folderPath,
        scanDirectory: scanDir,
        hasStatus: true,
      });
    }

    // No STATUS.md here and no children with STATUS.md — show as unconfigured project
    if (!selfHasStatus && !foundChildren && !seenPaths.has(resolvedScanDir)) {
      seenPaths.add(resolvedScanDir);
      projects.push({
        id: `${dirIndex}-${path.basename(scanDir).toLowerCase()}`,
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

module.exports = { scanForProjects, findProjectById };
