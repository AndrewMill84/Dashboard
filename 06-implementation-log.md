# Implementation Log — DevDashboard

---

## Task 1: Project scaffolding

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 1 — Project scaffolding |
| **Status** | Done |

### What was done

- Created root `package.json` with `dev`, `build`, and `start` scripts
- Created `config.json` with default scan directory (`C:/Github`) and port (3000)
- Created `client/package.json` with React, React Router, react-markdown, and remark-gfm
- Created `client/vite.config.js` with React plugin and API proxy to `localhost:3000`
- Created `client/index.html` as the Vite entry point
- Created all directory scaffolding: `server/routes/`, `server/services/`, `server/utils/`, `client/src/components/`, `client/src/hooks/`, `client/src/api/`, `client/src/styles/`, `client/src/utils/`
- Installed root dependencies: express (^4.21.0), cors (^2.8.5), concurrently (^9.1.0)
- Installed client dependencies: react (^19.0.0), react-dom (^19.0.0), react-router-dom (^7.1.0), react-markdown (^9.0.0), remark-gfm (^4.0.0), vite (^6.0.0), @vitejs/plugin-react (^4.3.0)

### Acceptance criteria verification

- [x] Root `package.json` exists with `dev`, `build`, and `start` scripts
- [x] `config.json` exists with `scanDirectories` array and `port`
- [x] `client/package.json` exists with all required frontend dependencies
- [x] Backend dependencies installed (express, cors)
- [x] Dev dependencies installed (vite, @vitejs/plugin-react, concurrently)
- [x] All planned directories exist (10/10 verified)
- [x] `npm install` succeeded without errors at both root and client level (0 vulnerabilities)

### Notes

- No source files (`.js`/`.jsx`) created — those belong to Tasks 2–8
- Default config points to `C:/Github` as the scan directory

---

## Task 2: Express server setup

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 2 — Express server setup |
| **Status** | Done |

### What was done

- Created `server/config.js`: loads `config.json` from project root, validates `scanDirectories` is a non-empty string array, resolves paths to absolute, defaults port to 3000, throws clear errors for missing/malformed config
- Created `server/index.js`: Express app with CORS enabled, `/api/health` endpoint returning `{ status: "ok" }`, `/api/config` endpoint returning current configuration, production static file serving from `client/dist/` when it exists, route mount points commented for Task 7

### Acceptance criteria verification

- [x] `node server/index.js` starts without error — confirmed, outputs server URL and scan directories
- [x] Config validated — requires non-empty `scanDirectories` array of strings
- [x] Clear error on missing config — tested: "Config file not found at ... Create a config.json ..."
- [x] Listens on configured port — confirmed at localhost:3000
- [x] CORS enabled — `cors()` middleware applied
- [x] `GET /api/health` returns `{ "status": "ok" }` — confirmed via Invoke-RestMethod

### Notes

- Also added `GET /api/config` endpoint (from spec section 11) since it was trivial and the server already had the config loaded
- Route mounts for projects and files are commented stubs — will be wired in Task 7

---

## Task 3: Scanner service

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 3 — Scanner service |
| **Status** | Done |

### What was done

- Created `server/services/scanner.js` with two exports:
  - `scanForProjects(scanDirectories)` — iterates each scan directory, reads immediate child folders, checks for `STATUS.md`, returns array of project objects
  - `findProjectById(scanDirectories, projectId)` — convenience wrapper that scans and returns a single project by ID or null

### Acceptance criteria verification

- [x] Scans each directory in `config.scanDirectories` — confirmed
- [x] Lists immediate child directories only (not recursive) — uses `readdirSync` with `withFileTypes`, filters to `isDirectory()`
- [x] Valid project = contains `STATUS.md` — uses `accessSync` with `R_OK`
- [x] Returns `{ id, name, path, scanDirectory }` objects — confirmed
- [x] ID format `{scanDirIndex}-{folderNameLowercase}` — tested: `0-devdashboard`
- [x] Gracefully handles non-existent scan directories — logs warning, skips, continues
- [x] Gracefully handles permission errors — caught in try/catch, logs warning, skips

### Test results

- Scanned `C:/Github`: found 1 project (DevDashboard)
- Non-existent directory: warned and skipped, remaining directories still scanned
- `findProjectById` with valid ID: returned correct project
- `findProjectById` with unknown ID: returned null

---

## Task 4: STATUS.md parser

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 4 — STATUS.md parser |
| **Status** | Done |

### What was done

- Created `server/services/statusParser.js` with a single export `parseStatusFile(filePath)`
- Three internal parsers: `parseControlPanel`, `parseCompletedArtifacts`, `parseStageHistory`
- `FIELD_MAP` maps 14 known field names (case-insensitive) to camelCase keys
- `stripMarkdown` removes backticks and bold markers from values
- `extractStageNumber` pulls the leading integer from the stage string
- Each parser runs independently in try/catch — partial results returned on failure

### Acceptance criteria verification

- [x] Reads STATUS.md from a given file path
- [x] Extracts all 14 control panel fields — confirmed against real DevDashboard STATUS.md
- [x] Strips backticks and whitespace — e.g. `\`6 — Implementation\`` → `"6 — Implementation"`
- [x] Extracts completed artifacts with name, label, and completed boolean (10 artifacts parsed)
- [x] Extracts stage history rows with date, stage, who, notes (6 rows parsed)
- [x] Extracts numeric stage number — `"6 — Implementation"` → `6`
- [x] `parseError` is null on success, descriptive string on failure
- [x] Returns partial data on failure — missing file still returns the default structure
- [x] Handles missing sections — empty file returns nulls and empty arrays, no crash

---

## Task 5: Artifact detector

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 5 — Artifact detector |
| **Status** | Done |

### What was done

- Created `server/services/artifactDetector.js` with two exports:
  - `detectArtifacts(projectDir)` — checks for the 10 standard artifact files and returns an object mapping each filename to a boolean
  - `STANDARD_ARTIFACTS` — array of the 10 standard filenames
- Added `ALTERNATE_PATHS` mapping to also check `memory/decisions.md` when `decisions.md` isn't at the project root (matching the AI Build OS convention)

### Acceptance criteria verification

- [x] Checks for all 10 standard artifact files
- [x] Returns object mapping each filename to boolean
- [x] Does not throw on missing files — returns `false`
- [x] Correctly detects files at alternate locations (`memory/decisions.md`)
- [x] Tested against real DevDashboard project — 8 of 10 files found

---

## Task 6: Path security utility

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 6 — Path security utility |
| **Status** | Done |

### What was done

- Created `server/utils/pathSecurity.js` with `validateFilePath(projectPath, filename, scanDirectories)`
- Validates that the resolved path stays inside both the project directory and a configured scan directory
- Rejects `..` traversal, absolute paths, and backslash-based traversal attempts

### Acceptance criteria verification

- [x] Resolves to absolute path — confirmed
- [x] Validates path is inside scan directories — confirmed
- [x] Rejects `..` traversal — returns error
- [x] Rejects absolute paths — returns error
- [x] Rejects backslash traversal — returns error
- [x] Returns clear error string — confirmed
- [x] Works on Windows (backslash paths) — tested on Windows 10

---

## Task 7: API routes

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 7 — API routes |
| **Status** | Done |

### What was done

- Created `server/routes/projects.js` with factory function `createProjectRoutes(config)`:
  - `GET /api/projects` — returns array of project summaries with parsed STATUS.md fields
  - `GET /api/projects/:id` — returns full project detail with all STATUS.md fields, artifact file existence map
- Created `server/routes/files.js` with factory function `createFileRoutes(config)`:
  - `GET /api/projects/:id/files` — returns sorted list of filenames in the project directory
  - `GET /api/projects/:id/files/:filename` — returns file content with path security validation
- Wired both route modules into `server/index.js`

### Acceptance criteria verification

- [x] `GET /api/projects` returns project summaries — confirmed (1 project found)
- [x] `GET /api/projects/:id` returns full detail with artifact map — confirmed
- [x] `GET /api/projects/:id/files` returns sorted file list — confirmed (14 files)
- [x] `GET /api/projects/:id/files/:filename` returns file content — confirmed with `config.json`
- [x] `GET /api/config` returns configuration — already existed from Task 2
- [x] Returns 404 for unknown project IDs — confirmed
- [x] Returns 404 for files that don't exist — confirmed
- [x] Returns 403 for path traversal attempts — confirmed
- [x] All endpoints return JSON with appropriate HTTP status codes — confirmed

---

## Task 8: Frontend scaffolding

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 8 — Frontend scaffolding |
| **Status** | Done |

### What was done

- Created `client/src/main.jsx` — React 19 entry point with StrictMode
- Created `client/src/App.jsx` — BrowserRouter with routes for `/` and `/project/:id`, sticky header with logo link
- Created `client/src/api/client.js` — API client with `fetchProjects`, `fetchProject`, `fetchProjectFiles`, `fetchFile`
- Created `client/src/utils/stages.js` — 9-stage definitions array with `getStageByNumber` helper
- Created `client/src/styles/global.css` — dark theme with CSS custom properties, base reset, spinner, error/empty states
- Created `client/src/styles/components.css` — component styles (populated incrementally by Tasks 9–11)

### Acceptance criteria verification

- [x] Vite dev server starts — confirmed on port 5173
- [x] Vite proxies `/api` to `http://localhost:3000` — configured in `vite.config.js`
- [x] React Router with `/` and `/project/:id` routes — confirmed
- [x] Dark theme CSS variables defined — 20+ custom properties
- [x] Base reset styles applied — box-sizing, margin, font-family
- [x] API client exports all 4 functions — confirmed
- [x] Stage definitions exported — 9 stages
- [x] App renders without errors — confirmed

---

## Task 9: Project list view

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 9 — Project list view |
| **Status** | Done |

### What was done

- Created `client/src/hooks/useProjects.js` — fetches from `/api/projects`, returns `{ projects, loading, error, refresh }`
- Created `client/src/components/ProjectList.jsx` — renders grid of project cards with sort controls and empty/loading/error states
- Created `client/src/components/ProjectCard.jsx` — displays project name, stage, status badge, progress bar, action, who acts next, blockers, last updated
- Created `client/src/components/StatusBadge.jsx` — coloured badges for not-started (grey), in-progress (blue), blocked (red), complete (green)
- Created `client/src/components/SortControls.jsx` — sort by name, last updated, or stage number

### Acceptance criteria verification

- [x] `useProjects` hook works — confirmed
- [x] Grid of project cards renders — confirmed
- [x] Cards show all required fields — confirmed
- [x] Status badges with correct colours — confirmed
- [x] Sort controls work (name, updated, stage) — confirmed
- [x] Clicking a card navigates to `/project/:id` — confirmed
- [x] Loading state shows spinner — confirmed
- [x] Error and empty states handled — confirmed

---

## Task 10: Project detail view

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 10 — Project detail view |
| **Status** | Done |

### What was done

- Created `client/src/hooks/useProjectDetail.js` — fetches from `/api/projects/:id` with cleanup on unmount
- Created `client/src/components/ProjectDetail.jsx` — full project page with all STATUS.md fields, workflow map, artifact checklist, stage history, file viewer integration
- Created `client/src/components/WorkflowMap.jsx` — 9-stage horizontal step indicator with completed/active/blocked/upcoming states
- Created `client/src/components/ArtifactChecklist.jsx` — lists all artifacts with completion status, file existence indicator, clickable files
- Created `client/src/components/StageHistory.jsx` — renders stage transition table

### Acceptance criteria verification

- [x] `useProjectDetail(id)` hook works — confirmed
- [x] All STATUS.md control panel fields displayed — confirmed
- [x] WorkflowMap shows 9 stages with correct states — confirmed
- [x] ArtifactChecklist shows completion and file existence — confirmed
- [x] Clicking an existing file opens file viewer — confirmed
- [x] StageHistory table renders — confirmed
- [x] Back navigation works — confirmed
- [x] Loading and error states handled — confirmed
- [x] `parseError` warning banner works — confirmed

---

## Task 11: File viewer

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 11 — File viewer |
| **Status** | Done |

### What was done

- Created `client/src/components/FileViewer.jsx` — modal overlay that fetches and renders markdown files
- Uses `react-markdown` with `remark-gfm` for full GitHub-flavoured markdown support
- Supports: headings, paragraphs, lists, tables, code blocks, inline code, bold, italic, checkboxes, blockquotes, images, horizontal rules
- Close via button, Escape key, or clicking outside the overlay
- Body scroll locked while viewer is open

### Acceptance criteria verification

- [x] Opens as modal/overlay — confirmed
- [x] Fetches file content from API — confirmed
- [x] Renders markdown as formatted HTML — confirmed (tested with `01-idea.md`, 315 DOM elements)
- [x] Supports all required markdown features — confirmed via `remark-gfm`
- [x] Filename shown as header — confirmed
- [x] Close button dismisses viewer — confirmed
- [x] Loading state while fetching — confirmed
- [x] Error state on failure — confirmed
- [x] Dark theme styling — confirmed

---

## Task 12: Integration and polish

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Task 12 — Integration and polish |
| **Status** | Done |

### What was done

- Verified `npm run build` produces `client/dist/` with index.html, CSS, and JS bundle
- Verified `npm start` serves production build with API and static files
- Tested full end-to-end flow in production mode via browser automation
- Fixed sticky header overlap with back button (added proper spacing)
- No console errors during normal operation

### Acceptance criteria verification

- [x] `npm run build` builds frontend to `client/dist/` — confirmed (2.20s build)
- [x] `npm start` starts production server — confirmed
- [x] `npm run dev` starts concurrent dev servers — confirmed (concurrently script)
- [x] Navigating to `http://localhost:3000` shows project list — confirmed
- [x] Clicking a project shows detail view — confirmed
- [x] Clicking an artifact opens file viewer with rendered markdown — confirmed
- [x] Projects with missing STATUS.md handled gracefully — by design (scanner skips them)
- [x] Scan directories that don't exist are skipped — by design (scanner warns and skips)
- [x] Empty project list handled gracefully — empty state component
- [x] No console errors during normal operation — confirmed

---

## Post-MVP: Scan directory management UI

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Task** | Post-MVP — Settings UI and smart scanner |
| **Status** | Done |

### What was done

- **Backend config persistence**: Added `saveConfig()` to `server/config.js` — writes updates back to `config.json` while preserving existing fields
- **Config API routes**: Created `server/routes/config.js` with:
  - `GET /api/config` — returns current config (moved from inline handler)
  - `POST /api/config/scan-directories` — adds a directory (validates existence, rejects duplicates)
  - `DELETE /api/config/scan-directories` — removes a directory (prevents removing the last one)
- **Smart scanner**: Updated `server/services/scanner.js` to handle three cases:
  1. Scan directory itself has `STATUS.md` → treated as a project directly
  2. Scan directory has child folders with `STATUS.md` → existing behavior
  3. Scan directory has neither → shown as an uninitialized project tile
  - Deduplicates projects by resolved path to prevent doubles
- **Settings modal**: Created `client/src/components/SettingsModal.jsx` — overlay showing current directories with remove buttons, text input to add new paths, loading/error states
- **Frontend API client**: Added `fetchConfig()`, `addScanDirectory()`, `removeScanDirectory()` to `client/src/api/client.js`
- **Header integration**: Added gear icon button to `App.jsx` header; directories changed in settings trigger project list refresh
- **Project card for missing STATUS.md**: Updated `ProjectCard.jsx` to show dashed border, orange "No STATUS.md" badge, and guidance text for uninitialized projects
- **Two-row layout**: Updated `ProjectList.jsx` to split tracked projects (top) from uninitialized projects (bottom) with a "Not yet initialized" divider

### Files affected

- `server/config.js` — added `saveConfig`, exported `CONFIG_PATH`
- `server/routes/config.js` — new file
- `server/index.js` — wired config routes, removed inline `/api/config`
- `server/services/scanner.js` — smart scanning with `hasStatus` flag
- `server/routes/projects.js` — handles `hasStatus: false` projects
- `client/src/api/client.js` — 3 new API functions
- `client/src/components/SettingsModal.jsx` — new file
- `client/src/components/ProjectCard.jsx` — missing-status card state
- `client/src/components/ProjectList.jsx` — two-row split layout
- `client/src/App.jsx` — settings button + refresh on directory change
- `client/src/styles/components.css` — settings modal, missing-card, divider styles

---
