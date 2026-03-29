const path = require("path");

function validateFilePath(projectPath, filename, scanDirectories) {
  if (!filename || typeof filename !== "string") {
    return { valid: false, error: "Filename is required" };
  }

  if (filename.includes("..") || path.isAbsolute(filename)) {
    return { valid: false, error: "Invalid filename: path traversal not allowed" };
  }

  const normalizedFilename = filename.replace(/\\/g, "/");
  if (normalizedFilename.includes("..") || normalizedFilename.startsWith("/")) {
    return { valid: false, error: "Invalid filename: path traversal not allowed" };
  }

  const resolvedProject = path.resolve(projectPath);
  const resolvedFile = path.resolve(resolvedProject, filename);

  if (!resolvedFile.startsWith(resolvedProject + path.sep) && resolvedFile !== resolvedProject) {
    return { valid: false, error: "Invalid filename: path escapes project directory" };
  }

  const inScanDir = scanDirectories.some((scanDir) => {
    const resolvedScan = path.resolve(scanDir);
    return resolvedFile.startsWith(resolvedScan + path.sep) || resolvedFile === resolvedScan;
  });

  if (!inScanDir) {
    return { valid: false, error: "Invalid filename: path escapes scan directory" };
  }

  return { valid: true, resolvedPath: resolvedFile, error: null };
}

module.exports = { validateFilePath };
