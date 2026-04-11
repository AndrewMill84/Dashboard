# Patterns & Lessons — DevDashboard

---

## Pattern: Factory-function route modules

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |

### Context

Express route files need access to shared configuration (scan directories, port, config path) without relying on global state or module-level imports that make testing difficult.

### The Pattern

Export a factory function from each route module that accepts a config object and returns an Express router. The server entry point calls the factory and mounts the returned router.

### When to Use It

- Express apps where routes need shared config or services
- Any situation where route modules should be testable in isolation

### When NOT to Use It

- Trivial single-file servers where the overhead isn't justified

### Example

```javascript
// server/routes/projects.js
function createProjectRoutes(config) {
  const router = express.Router();
  router.get('/', async (req, res) => {
    const projects = await scanForProjects(config.scanDirectories);
    res.json(projects);
  });
  return router;
}

// server/index.js
app.use('/api/projects', createProjectRoutes(config));
```

### Anti-Pattern to Avoid

Importing config directly inside route modules (`require('../config')`) — couples the module to the file system layout and makes testing harder.

---

## Pattern: Parse-error passthrough

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |

### Context

The STATUS.md parser must handle malformed, incomplete, or missing files without crashing the entire project listing. Throwing exceptions would mean one bad file takes down the dashboard for all projects.

### The Pattern

Return a structured result object that always includes the data fields (with null/empty defaults) plus a `parseError` field. On success, `parseError` is null. On failure, `parseError` is a descriptive string and the data fields contain whatever partial information was extracted.

### When to Use It

- Parsing user-editable structured files where malformation is expected
- Any read operation where partial results are more useful than a crash
- Dashboard-style UIs that aggregate data from many independent sources

### When NOT to Use It

- Strict validation contexts where partial data would be misleading (e.g. financial calculations)
- Situations where the caller must distinguish between different failure modes

### Example

```javascript
function parseStatusFile(filePath) {
  const result = { controlPanel: {}, artifacts: [], stageHistory: [], parseError: null };
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    result.controlPanel = parseControlPanel(content);
    result.artifacts = parseCompletedArtifacts(content);
    result.stageHistory = parseStageHistory(content);
  } catch (err) {
    result.parseError = `Failed to parse STATUS.md: ${err.message}`;
  }
  return result;
}
```

### Anti-Pattern to Avoid

Throwing on parse failure and forcing every caller to wrap in try/catch — leads to inconsistent error handling and swallowed exceptions.

---

## Pattern: Alternate path resolution for artifacts

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |

### Context

The AI Build OS convention places most artifacts at the project root, but some (like `decisions.md`) may live in subdirectories (`memory/decisions.md`). The file viewer initially only checked the root, causing "file not found" errors.

### The Pattern

Maintain a single `ALTERNATE_PATHS` map that lists known alternate locations for each artifact filename. When the primary path fails, check alternates before returning a 404.

### When to Use It

- File-reading APIs that serve files from a convention-based directory structure
- Any system where files may live at multiple valid locations

### When NOT to Use It

- When the file location is always deterministic and user-controlled

### Example

```javascript
const ALTERNATE_PATHS = {
  'decisions.md': ['memory/decisions.md'],
};

function resolveFilePath(projectDir, filename) {
  const primary = path.join(projectDir, filename);
  if (fs.existsSync(primary)) return primary;
  const alternates = ALTERNATE_PATHS[filename] || [];
  for (const alt of alternates) {
    const altPath = path.join(projectDir, alt);
    if (fs.existsSync(altPath)) return altPath;
  }
  return null;
}
```

### Anti-Pattern to Avoid

Hardcoding alternate paths in individual route handlers — leads to inconsistency when the same file is accessed from different code paths.

---

## Pattern: Smart scanner with deduplication

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |

### Context

Users may configure overlapping scan directories — e.g. both `C:/Github` (parent) and `C:/Github/DevDashboard` (specific project). Without deduplication, the same project appears twice.

### The Pattern

After scanning all directories, deduplicate projects by their resolved absolute path. Use a `Set` or `Map` keyed by the normalized path to keep only the first occurrence.

### When to Use It

- Directory scanners that accept user-configured paths
- Any aggregation from multiple sources where overlap is possible

### When NOT to Use It

- Single-source scanning where overlap is impossible by design

### Example

```javascript
const seen = new Set();
const projects = [];
for (const dir of scanDirectories) {
  for (const folder of scanDirectory(dir)) {
    const resolved = path.resolve(folder.path);
    if (!seen.has(resolved)) {
      seen.add(resolved);
      projects.push(folder);
    }
  }
}
```

### Anti-Pattern to Avoid

Deduplicating by project name or ID alone — two different projects could share a name across directories.

---

## Failure: Alternate file paths not handled cross-cuttingly

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |
| **Type** | Failure mode |

### What Happened

The artifact detector knew about `memory/decisions.md` as an alternate path, but the file-reading route did not. Clicking `decisions.md` in the UI returned "File not found" because the route only checked the project root.

### Root Cause

Alternate path resolution was implemented in one module (artifact detector) but not applied as a shared concern. The file route was written independently and didn't consult the same map.

### Impact

- Bug reported during review — required a session 3 fix
- Broke the user's ability to view a key artifact file

### How to Prevent It

- Define alternate paths in a single shared module imported by both the artifact detector and the file route
- When adding a new alternate path, grep for all file-access code paths to ensure consistency

### Warning Signs

- Multiple modules independently resolving file paths to the same set of files
- "File not found" errors for files that clearly exist in the project

---

## Pattern: Curated local starter scaffold for project bootstrap

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Discovered In** | DevDashboard |
| **Category** | Architecture |

### Context

The dashboard needed to create a new AI Build OS project without duplicating the entire source repository or depending on a GitHub download at runtime.

### The Pattern

Keep the starter source in a local repository path, copy only the curated files and directories the new project actually needs, and generate the project-specific files (`STATUS.md`, `01-idea.md`, `memory/` files) at creation time.

### When to Use It

- Local tools that need deterministic scaffolding from a canonical source repo
- Starter templates where some files should be copied verbatim and others should be stamped with project-specific values

### When NOT to Use It

- Cases where the starter must always be fetched from a remote registry or versioned release artifact

### Example

```javascript
copyRequiredEntries(sourceRoot, projectPath);
fs.writeFileSync(path.join(projectPath, "STATUS.md"), renderStatusTemplate(...));
fs.writeFileSync(path.join(projectPath, "01-idea.md"), renderIdeaTemplate(...));
```

### Anti-Pattern to Avoid

Copying the entire source repo wholesale into every new project - it drags along irrelevant files and makes the scaffold harder to reason about.

---
