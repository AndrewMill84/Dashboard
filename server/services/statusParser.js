const fs = require("fs");

/**
 * Optional "## How to run" section in STATUS.md (AI Build OS / DevDashboard).
 *
 * Contract:
 * - Heading: `## How to run` (case-insensitive for the parser).
 * - Body: Markdown until the next `## ` section (e.g. Completed Artifacts).
 * - Use fenced code blocks for shell commands, bullets for notes.
 *
 * Example:
 *   ## How to run
 *   From the repo root:
 *   ```bash
 *   npm install && npm run dev
 *   ```
 */

const FIELD_MAP = {
  project: "project",
  "current stage": "currentStage",
  "stage status": "stageStatus",
  objective: "objective",
  "current action required": "currentActionRequired",
  "who acts next": "whoActsNext",
  "artifact due next": "artifactDueNext",
  "required input from human": "requiredInputFromHuman",
  "relevant files": "relevantFiles",
  "open questions": "openQuestions",
  blockers: "blockers",
  "last completed step": "lastCompletedStep",
  "next step after current": "nextStepAfterCurrent",
  started: "started",
  "last updated": "lastUpdated",
};

function stripMarkdown(value) {
  let cleaned = value.trim();
  cleaned = cleaned.replace(/`([^`]*)`/g, "$1");
  cleaned = cleaned.replace(/\*\*([^*]*)\*\*/g, "$1");
  return cleaned.trim();
}

function extractStageNumber(stageString) {
  const match = stageString.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parseControlPanel(lines) {
  const fields = {};
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s.*control\s*panel/i.test(trimmed)) {
      inTable = true;
      continue;
    }

    if (inTable && trimmed.startsWith("---") && !trimmed.startsWith("|")) {
      break;
    }

    if (!inTable) continue;

    if (trimmed.startsWith("|") && trimmed.includes("---|")) continue;
    if (/^\|\s*Field\s*\|/i.test(trimmed)) continue;

    const rowMatch = trimmed.match(
      /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.*?)\s*\|?\s*$/
    );
    if (!rowMatch) continue;

    const rawKey = rowMatch[1].trim().toLowerCase();
    const rawValue = stripMarkdown(rowMatch[2]);
    const mappedKey = FIELD_MAP[rawKey];

    if (mappedKey) {
      fields[mappedKey] = rawValue;
    }
  }

  return fields;
}

function parseCompletedArtifacts(lines) {
  const artifacts = [];
  let inSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s.*completed\s*artifacts/i.test(trimmed)) {
      inSection = true;
      continue;
    }

    if (inSection && /^##\s/.test(trimmed)) {
      break;
    }

    if (inSection && trimmed.startsWith("---")) {
      break;
    }

    if (!inSection) continue;

    const checkMatch = trimmed.match(
      /^-\s*\[([ xX])\]\s*`([^`]+)`\s*(?:—|[-–])\s*(.*)/
    );
    if (checkMatch) {
      artifacts.push({
        name: checkMatch[2].trim(),
        label: checkMatch[3].replace(/[⛳🔴🟢🟡]\s*/g, "").replace(/\*\*([^*]*)\*\*/g, "$1").trim(),
        completed: checkMatch[1].toLowerCase() === "x",
      });
    }
  }

  return artifacts;
}

function parseStageHistory(lines) {
  const history = [];
  let inSection = false;
  let headerPassed = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s.*stage\s*history/i.test(trimmed)) {
      inSection = true;
      continue;
    }

    if (inSection && /^##\s/.test(trimmed)) {
      break;
    }

    if (inSection && !trimmed.startsWith("|") && trimmed.startsWith("---")) {
      break;
    }

    if (!inSection) continue;

    if (trimmed.includes("---|")) {
      headerPassed = true;
      continue;
    }

    if (/^\|\s*Date\s*\|/i.test(trimmed)) continue;

    if (!headerPassed) continue;

    if (!trimmed.startsWith("|")) continue;

    const cells = trimmed
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (cells.length >= 4 && !cells[0].startsWith("<!--")) {
      history.push({
        date: stripMarkdown(cells[0]),
        stage: stripMarkdown(cells[1]),
        who: stripMarkdown(cells[2]),
        notes: stripMarkdown(cells[3]),
      });
    }
  }

  return history;
}

function parseHowToRunSection(lines) {
  let inSection = false;
  const body = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s+how\s+to\s+run\b/i.test(trimmed)) {
      inSection = true;
      continue;
    }

    if (inSection && /^##\s/.test(trimmed)) {
      break;
    }

    if (inSection) {
      body.push(line);
    }
  }

  return body.join("\n").trim();
}

/**
 * True when STATUS reflects real workflow progress (vs template / empty control panel).
 * Used for dashboard ordering; keep in sync with client expectations.
 */
function computeStatusEngaged(parsed) {
  if (!parsed || parsed.parseError) return false;

  const completed = (parsed.completedArtifacts || []).filter((a) => a.completed)
    .length;
  const stageNum = parsed.stageNumber;
  const st = (parsed.stageStatus || "").toLowerCase().replace(/\s+/g, "-");
  const action = (parsed.currentActionRequired || "").trim();
  const noneAction = !action || action.toLowerCase() === "none";

  if (completed > 0) return true;
  if (stageNum != null && stageNum >= 2) return true;
  if (st === "in-progress" || st === "blocked" || st === "complete") return true;
  if (!noneAction) return true;
  return false;
}

function parseStatusFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    return {
      parseError: `Failed to read STATUS.md: ${err.message}`,
      howToRunMarkdown: null,
    };
  }

  const lines = content.split(/\r?\n/);

  const result = {
    project: null,
    currentStage: null,
    stageNumber: null,
    stageStatus: null,
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
    howToRunMarkdown: null,
    parseError: null,
  };

  try {
    const fields = parseControlPanel(lines);
    Object.assign(result, fields);

    if (result.currentStage) {
      result.stageNumber = extractStageNumber(result.currentStage);
    }
  } catch (err) {
    result.parseError = `Error parsing control panel: ${err.message}`;
  }

  try {
    result.completedArtifacts = parseCompletedArtifacts(lines);
  } catch (err) {
    if (!result.parseError) {
      result.parseError = `Error parsing completed artifacts: ${err.message}`;
    }
  }

  try {
    result.stageHistory = parseStageHistory(lines);
  } catch (err) {
    if (!result.parseError) {
      result.parseError = `Error parsing stage history: ${err.message}`;
    }
  }

  try {
    const howToRun = parseHowToRunSection(lines);
    result.howToRunMarkdown = howToRun.length > 0 ? howToRun : null;
  } catch (err) {
    if (!result.parseError) {
      result.parseError = `Error parsing How to run section: ${err.message}`;
    }
  }

  return result;
}

module.exports = { parseStatusFile, computeStatusEngaged };
