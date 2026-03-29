const fs = require("fs");
const path = require("path");

const STANDARD_ARTIFACTS = [
  "01-idea.md",
  "02-clarification.md",
  "03-spec.md",
  "04-plan.md",
  "05-tasks.md",
  "06-implementation-log.md",
  "07-review.md",
  "08-report.md",
  "09-handoff.md",
  "decisions.md",
  "patterns.md",
  "project-index.md",
];

const ALTERNATE_PATHS = {
  "decisions.md": "memory/decisions.md",
  "patterns.md": "memory/patterns.md",
  "project-index.md": "memory/project-index.md",
};

function detectArtifacts(projectDir) {
  const result = {};

  for (const filename of STANDARD_ARTIFACTS) {
    const primaryPath = path.join(projectDir, filename);
    const altRelative = ALTERNATE_PATHS[filename];
    const altPath = altRelative ? path.join(projectDir, altRelative) : null;

    let found = false;
    try {
      fs.accessSync(primaryPath, fs.constants.R_OK);
      found = true;
    } catch {
      if (altPath) {
        try {
          fs.accessSync(altPath, fs.constants.R_OK);
          found = true;
        } catch {
          // neither location exists
        }
      }
    }
    result[filename] = found;
  }

  return result;
}

module.exports = { detectArtifacts, STANDARD_ARTIFACTS, ALTERNATE_PATHS };
