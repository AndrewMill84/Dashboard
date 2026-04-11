const path = require("path");

/**
 * Default scan roots merged on every server start with paths from config.json
 * (deduped). Edit this list so your usual locations are always scanned without
 * relying on config.json alone.
 */
const DEFAULT_SCAN_DIRECTORIES = [
  "C:/Github",
  "C:/Users/andre/Loan Scenario Workbench",
  "C:/Github/poker_bot",
  "C:/Users/andre/cbev4",
  "C:/Users/andre",
];

/**
 * @param {string[]|undefined} fromFile scanDirectories from config.json
 * @returns {string[]} merged paths, defaults first, then file-only entries
 */
function mergeScanDirectories(fromFile) {
  const merged = [];
  const seen = new Set();

  function add(dir) {
    if (typeof dir !== "string") return;
    const trimmed = dir.trim();
    if (!trimmed) return;
    const key = path.resolve(trimmed).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(trimmed);
  }

  DEFAULT_SCAN_DIRECTORIES.forEach(add);
  (fromFile || []).forEach(add);
  return merged;
}

module.exports = { DEFAULT_SCAN_DIRECTORIES, mergeScanDirectories };
