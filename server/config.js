const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");

function loadConfig() {
  let raw;
  try {
    raw = fs.readFileSync(CONFIG_PATH, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        `Config file not found at ${CONFIG_PATH}. Create a config.json with a "scanDirectories" array.`
      );
    }
    throw new Error(`Failed to read config file: ${err.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`config.json contains invalid JSON: ${err.message}`);
  }

  if (
    !parsed.scanDirectories ||
    !Array.isArray(parsed.scanDirectories) ||
    parsed.scanDirectories.length === 0
  ) {
    throw new Error(
      'config.json must contain a non-empty "scanDirectories" array of directory paths.'
    );
  }

  const nonStringEntry = parsed.scanDirectories.find(
    (entry) => typeof entry !== "string"
  );
  if (nonStringEntry !== undefined) {
    throw new Error(
      'Every entry in "scanDirectories" must be a string. Found: ' +
        JSON.stringify(nonStringEntry)
    );
  }

  const scanDirectories = parsed.scanDirectories.map((dir) =>
    path.resolve(dir)
  );

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

  const port = typeof parsed.port === "number" ? parsed.port : 3000;

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
    currentConfig.scanDirectories = updates.scanDirectories.map((dir) =>
      path.resolve(dir)
    );
  }
}

module.exports = { loadConfig, saveConfig, CONFIG_PATH };
