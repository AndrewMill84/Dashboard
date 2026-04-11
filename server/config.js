const fs = require("fs");
const path = require("path");
const { mergeScanDirectories } = require("./defaultScanDirectories");

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");

function loadConfig() {
  let parsed = {};

  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    parsed = JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      parsed = {};
    } else if (err instanceof SyntaxError) {
      throw new Error(`config.json contains invalid JSON: ${err.message}`);
    } else {
      throw new Error(`Failed to read config file: ${err.message}`);
    }
  }

  const mergedDirs = mergeScanDirectories(parsed.scanDirectories);

  if (mergedDirs.length === 0) {
    throw new Error(
      "No scan directories available after merging defaults and config."
    );
  }

  const nonStringEntry = mergedDirs.find((entry) => typeof entry !== "string");
  if (nonStringEntry !== undefined) {
    throw new Error(
      'Every entry in "scanDirectories" must be a string. Found: ' +
        JSON.stringify(nonStringEntry)
    );
  }

  const scanDirectories = mergedDirs.map((dir) => path.resolve(dir));

  let bootstrapSourcePath = null;
  if (
    parsed.bootstrapSourcePath !== undefined &&
    parsed.bootstrapSourcePath !== null
  ) {
    if (typeof parsed.bootstrapSourcePath !== "string") {
      throw new Error('"bootstrapSourcePath" must be a string when provided.');
    }

    bootstrapSourcePath = path.resolve(parsed.bootstrapSourcePath);
  }

  const port = typeof parsed.port === "number" ? parsed.port : 8742;

  return { scanDirectories, bootstrapSourcePath, port };
}

function saveConfig(currentConfig, updates) {
  let raw;
  try {
    raw = fs.readFileSync(CONFIG_PATH, "utf8");
  } catch {
    raw = "{}";
  }

  const existing = JSON.parse(raw);
  Object.assign(existing, updates);

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(existing, null, 2) + "\n", "utf8");

  if (updates.scanDirectories) {
    currentConfig.scanDirectories = mergeScanDirectories(
      updates.scanDirectories
    ).map((dir) => path.resolve(dir));
  }
}

module.exports = { loadConfig, saveConfig, CONFIG_PATH };
