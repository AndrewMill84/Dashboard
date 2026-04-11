const fs = require("fs");
const path = require("path");

const REQUIRED_COPY_ENTRIES = [
  { source: "AGENTS.md", target: "AGENTS.md" },
  { source: ".cursorrules", target: ".cursorrules" },
  { source: ".agents", target: ".agents" },
  { source: "workflow", target: "workflow" },
  { source: "templates", target: "templates" },
  { source: "QUICKREF.md", target: "QUICKREF.md" },
  {
    source: path.join("project-starter", "new-project-checklist.md"),
    target: "new-project-checklist.md",
  },
];

const INVALID_FOLDER_NAME_RE = /[<>:"/\\|?*\x00-\x1f]/;
const RESERVED_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
]);

function createBootstrapError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function replaceFirst(text, searchValue, replacement) {
  const index = text.indexOf(searchValue);
  if (index === -1) {
    return text;
  }

  return (
    text.slice(0, index) +
    replacement +
    text.slice(index + searchValue.length)
  );
}

function getLocalDateStamp() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  return new Date(now.getTime() - offsetMinutes * 60000)
    .toISOString()
    .slice(0, 10);
}

function assertReadable(sourceRoot, relativePath) {
  const sourcePath = path.join(sourceRoot, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw createBootstrapError(
      `Starter source is missing required path: ${relativePath}`,
      500
    );
  }

  return sourcePath;
}

function copyRequiredEntries(sourceRoot, targetRoot) {
  for (const entry of REQUIRED_COPY_ENTRIES) {
    const sourcePath = assertReadable(sourceRoot, entry.source);
    const targetPath = path.join(targetRoot, entry.target);
    const sourceStat = fs.statSync(sourcePath);

    if (sourceStat.isDirectory()) {
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function validateFolderName(folderName) {
  const trimmed = folderName.trim();

  if (!trimmed) {
    throw createBootstrapError("folderName is required");
  }

  if (
    trimmed === "." ||
    trimmed === ".." ||
    path.basename(trimmed) !== trimmed
  ) {
    throw createBootstrapError(
      "folderName must be a single folder name, not a path"
    );
  }

  if (INVALID_FOLDER_NAME_RE.test(trimmed)) {
    throw createBootstrapError(
      "folderName contains characters that are not valid on disk"
    );
  }

  if (trimmed.endsWith(".") || trimmed.endsWith(" ")) {
    throw createBootstrapError(
      "folderName cannot end with a period or space"
    );
  }

  if (RESERVED_NAMES.has(trimmed.toUpperCase())) {
    throw createBootstrapError(
      "folderName uses a reserved Windows device name"
    );
  }

  return trimmed;
}

function ensureDirectory(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    throw createBootstrapError(`${description} does not exist: ${dirPath}`);
  }

  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) {
    throw createBootstrapError(`${description} is not a directory: ${dirPath}`);
  }
}

function renderStatusTemplate(template, projectName, dateStamp) {
  let output = replaceFirst(template, "<!-- Project name -->", projectName);
  output = replaceFirst(output, "<!-- YYYY-MM-DD -->", dateStamp);
  output = replaceFirst(output, "<!-- YYYY-MM-DD -->", dateStamp);
  output = replaceFirst(output, "<!-- YYYY-MM-DD -->", dateStamp);
  return output;
}

function renderIdeaTemplate(template, projectName, dateStamp) {
  let output = replaceFirst(template, "<!-- Project name -->", projectName);
  output = replaceFirst(output, "<!-- YYYY-MM-DD -->", dateStamp);
  return output;
}

function buildDecisionsContent(projectName) {
  return `# Decision Log - ${projectName}

A chronological record of significant decisions made during this project.

For the entry template, see [\`templates/decision-log-entry.md\`](../templates/decision-log-entry.md).

---

<!-- Append new decisions below this line. Use the template for each entry. -->
`;
}

function buildPatternsContent(projectName) {
  return `# Patterns & Lessons - ${projectName}

Capture reusable approaches, failure modes, and lessons learned during the project.

For the entry template, see [\`templates/patterns-and-lessons.md\`](../templates/patterns-and-lessons.md).

---

## Good Patterns

<!-- Append new patterns below this line. -->

---

## Failure Patterns

<!-- Append new failure patterns below this line. -->
`;
}

function buildProjectIndexContent(projectName, dateStamp) {
  return `# Project Index - ${projectName}

Tracks this project within its own workspace.

---

| # | Project | Status | Stage | Started | Completed | Location | Summary |
|---|---|---|---|---|---|---|---|
| 1 | ${projectName} | \`not-started\` | 1 - Idea Capture | ${dateStamp} | - | \`./\` | New project scaffold created from DevDashboard |

---
`;
}

function bootstrapProject({ sourceRoot, parentDirectory, folderName }) {
  if (!sourceRoot) {
    throw createBootstrapError(
      "bootstrapSourcePath is not configured. Update config.json to use the create-project flow.",
      500
    );
  }

  const resolvedSourceRoot = path.resolve(sourceRoot);
  const resolvedParentDirectory = path.resolve(parentDirectory);
  const projectName = validateFolderName(folderName);

  ensureDirectory(resolvedSourceRoot, "Starter source");
  ensureDirectory(resolvedParentDirectory, "Parent directory");

  const statusTemplatePath = assertReadable(
    resolvedSourceRoot,
    path.join("project-starter", "STATUS.md")
  );
  const ideaTemplatePath = assertReadable(
    resolvedSourceRoot,
    path.join("templates", "idea-intake.md")
  );

  const projectPath = path.resolve(resolvedParentDirectory, projectName);

  if (
    projectPath === resolvedParentDirectory ||
    !projectPath.startsWith(resolvedParentDirectory + path.sep)
  ) {
    throw createBootstrapError(
      "Target project path escapes the requested parent directory"
    );
  }

  if (fs.existsSync(projectPath)) {
    throw createBootstrapError(
      `Target project folder already exists: ${projectPath}`,
      409
    );
  }

  const dateStamp = getLocalDateStamp();
  const statusTemplate = fs.readFileSync(statusTemplatePath, "utf8");
  const ideaTemplate = fs.readFileSync(ideaTemplatePath, "utf8");

  fs.mkdirSync(projectPath, { recursive: false });

  try {
    copyRequiredEntries(resolvedSourceRoot, projectPath);

    fs.mkdirSync(path.join(projectPath, "memory"), { recursive: true });

    fs.writeFileSync(
      path.join(projectPath, "STATUS.md"),
      renderStatusTemplate(statusTemplate, projectName, dateStamp),
      "utf8"
    );
    fs.writeFileSync(
      path.join(projectPath, "01-idea.md"),
      renderIdeaTemplate(ideaTemplate, projectName, dateStamp),
      "utf8"
    );
    fs.writeFileSync(
      path.join(projectPath, "memory", "decisions.md"),
      buildDecisionsContent(projectName),
      "utf8"
    );
    fs.writeFileSync(
      path.join(projectPath, "memory", "patterns.md"),
      buildPatternsContent(projectName),
      "utf8"
    );
    fs.writeFileSync(
      path.join(projectPath, "memory", "project-index.md"),
      buildProjectIndexContent(projectName, dateStamp),
      "utf8"
    );
  } catch (error) {
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    throw error;
  }

  return {
    projectName,
    projectPath,
    dateStamp,
  };
}

module.exports = {
  bootstrapProject,
  createBootstrapError,
};
