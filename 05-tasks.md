# Task Breakdown — DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 5 — Task Breakdown |
| **Source** | `04-plan.md` |
| **Total Tasks** | 12 |

---

## Task Summary

| # | Title | Size | Depends On | Status |
|---|---|---|---|---|
| 1 | Project scaffolding | Small | — | `done` |
| 2 | Express server setup | Small | 1 | `done` |
| 3 | Scanner service | Small | 2 | `done` |
| 4 | STATUS.md parser | Medium | 2 | `done` |
| 5 | Artifact detector | Small | 2 | `done` |
| 6 | Path security utility | Small | 2 | `done` |
| 7 | API routes | Medium | 3, 4, 5, 6 | `done` |
| 8 | Frontend scaffolding | Medium | 1 | `done` |
| 9 | Project list view | Medium | 7, 8 | `done` |
| 10 | Project detail view | Large | 7, 8 | `done` |
| 11 | File viewer | Medium | 7, 8 | `done` |
| 12 | Integration and polish | Small | 9, 10, 11 | `done` |

---

## Tasks

### Task 1: Project scaffolding

- **Description**: Create the root project structure, package.json files, folder hierarchy, and default `config.json`. Install all backend and frontend dependencies.
- **Files affected**:
  - `package.json` (root)
  - `config.json`
  - `server/` (directory creation)
  - `client/package.json`
  - `client/vite.config.js`
  - `client/index.html`
- **Depends on**: None
- **Acceptance criteria**:
  - Root `package.json` exists with `dev`, `build`, and `start` scripts
  - `config.json` exists with a default `scanDirectories` array and `port`
  - `client/package.json` exists with react, react-dom, react-router-dom, react-markdown, remark-gfm
  - Backend dependencies installed: express, cors
  - Dev dependencies installed: vite, @vitejs/plugin-react, concurrently
  - All folders from the plan exist: `server/`, `server/routes/`, `server/services/`, `server/utils/`, `client/src/`, `client/src/components/`, `client/src/hooks/`, `client/src/api/`, `client/src/styles/`, `client/src/utils/`
  - `npm install` succeeds without errors
- **Size**: Small
- **Status**: `done`

---

### Task 2: Express server setup

- **Description**: Create the Express entry point and configuration loader. The server should start, load `config.json`, validate it, and serve a health check endpoint. In production mode it should serve the `client/dist/` directory as static files.
- **Files affected**:
  - `server/index.js`
  - `server/config.js`
- **Depends on**: Task 1
- **Acceptance criteria**:
  - `node server/index.js` starts without error
  - Config is loaded from `config.json` and validated (non-empty `scanDirectories` array required)
  - Clear error message if `config.json` is missing or malformed
  - Server listens on the configured port (default 3000)
  - CORS is enabled for dev mode
  - `GET /api/health` returns `{ status: "ok" }`
- **Size**: Small
- **Status**: `done`

---

### Task 3: Scanner service

- **Description**: Implement the service that discovers valid project folders by scanning configured directories one level deep and checking for the presence of `STATUS.md`.
- **Files affected**:
  - `server/services/scanner.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Scans each directory in `config.scanDirectories`
  - Lists immediate child directories only (not recursive)
  - A folder is valid if it contains a `STATUS.md` file
  - Returns an array of `{ id, name, path, scanDirectory }` objects
  - Project ID is generated as `{scanDirIndex}-{folderNameLowercase}` (e.g. `0-devdashboard`)
  - Gracefully handles scan directories that don't exist (logs warning, skips)
  - Gracefully handles permission errors on individual folders
- **Size**: Small
- **Status**: `done`

---

### Task 4: STATUS.md parser

- **Description**: Implement the parser that reads a `STATUS.md` file and extracts all control panel fields, the completed artifacts checklist, and the stage history table into a structured object.
- **Files affected**:
  - `server/services/statusParser.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Reads `STATUS.md` from a given file path
  - Extracts all 14 control panel fields (Project, Current Stage, Stage Status, Objective, Current Action Required, Who Acts Next, Artifact Due Next, Required Input From Human, Relevant Files, Open Questions, Blockers, Last Completed Step, Next Step After Current, Started, Last Updated)
  - Strips backticks and surrounding whitespace from values
  - Extracts the completed artifacts list (`- [x]` = completed, `- [ ]` = incomplete) with artifact name and label
  - Extracts the stage history table rows (date, stage, who, notes)
  - Extracts a numeric stage number from the current stage string (e.g. `"4 — Technical Plan"` → `4`)
  - Returns a `parseError` field (null on success, descriptive string on failure)
  - Returns partial data when possible rather than failing entirely
  - Handles missing sections gracefully (e.g. no stage history table)
- **Size**: Medium
- **Status**: `done`

---

### Task 5: Artifact detector

- **Description**: Implement a utility that checks which of the 10 standard artifact files exist on disk for a given project folder.
- **Files affected**:
  - `server/services/artifactDetector.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Given a project directory path, checks for: `01-idea.md`, `02-clarification.md`, `03-spec.md`, `04-plan.md`, `05-tasks.md`, `06-implementation-log.md`, `07-review.md`, `08-report.md`, `09-handoff.md`, `decisions.md`
  - Returns an object mapping each filename to a boolean (exists or not)
  - Does not throw on missing files — returns `false` for each missing file
- **Size**: Small
- **Status**: `done`

---

### Task 6: Path security utility

- **Description**: Implement path traversal prevention for the file-reading API endpoint. Ensures requested file paths resolve within a configured scan directory.
- **Files affected**:
  - `server/utils/pathSecurity.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Given a project path and a requested filename, resolves to an absolute path
  - Validates that the resolved path is inside one of the configured scan directories
  - Rejects paths containing `..`, absolute paths, or any attempt to escape the project folder
  - Returns a clear error for invalid paths
  - Works correctly on Windows (backslash paths) and POSIX (forward slash)
- **Size**: Small
- **Status**: `done`

---

### Task 7: API routes

- **Description**: Wire up all five REST API endpoints using the scanner, parser, artifact detector, and path security services.
- **Files affected**:
  - `server/routes/projects.js`
  - `server/routes/files.js`
  - `server/index.js` (mount routes)
- **Depends on**: Tasks 3, 4, 5, 6
- **Acceptance criteria**:
  - `GET /api/projects` — returns array of project summaries (id, name, stage, status, action, who acts next, blockers, last updated, stage number, completed stages count, total stages, parse error)
  - `GET /api/projects/:id` — returns full project detail (all STATUS.md fields, artifact existence map, completed artifacts list, stage history)
  - `GET /api/projects/:id/files` — returns list of filenames in the project directory
  - `GET /api/projects/:id/files/:filename` — returns `{ filename, content }` for a specific file, with path security validation
  - `GET /api/config` — returns current configuration
  - Returns 404 for unknown project IDs
  - Returns 404 for files that don't exist
  - Returns 403 for path traversal attempts
  - All endpoints return JSON with appropriate HTTP status codes
- **Size**: Medium
- **Status**: `done`

---

### Task 8: Frontend scaffolding

- **Description**: Set up the React application with Vite, React Router, dark theme CSS, and the API client wrapper. Create the root component with routing between project list and project detail views.
- **Files affected**:
  - `client/src/main.jsx`
  - `client/src/App.jsx`
  - `client/src/api/client.js`
  - `client/src/utils/stages.js`
  - `client/src/styles/global.css`
  - `client/src/styles/components.css`
  - `client/vite.config.js` (add API proxy)
- **Depends on**: Task 1
- **Acceptance criteria**:
  - `npm run dev` in `client/` starts the Vite dev server
  - Vite proxies `/api` requests to `http://localhost:3000`
  - React Router is configured with routes: `/` (project list) and `/project/:id` (project detail)
  - Dark theme CSS variables are defined in `global.css` (background, text, accent, muted, border colours)
  - Base reset styles applied (box-sizing, margin, font-family)
  - API client module exports functions: `fetchProjects()`, `fetchProject(id)`, `fetchProjectFiles(id)`, `fetchFile(id, filename)`
  - Stage definitions array exported from `stages.js`
  - App renders without errors and shows a placeholder for each route
- **Size**: Medium
- **Status**: `done`

---

### Task 9: Project list view

- **Description**: Build the main dashboard screen showing all discovered projects as summary cards with sorting controls.
- **Files affected**:
  - `client/src/components/ProjectList.jsx`
  - `client/src/components/ProjectCard.jsx`
  - `client/src/components/StatusBadge.jsx`
  - `client/src/components/SortControls.jsx`
  - `client/src/hooks/useProjects.js`
  - `client/src/styles/components.css`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - `useProjects` hook fetches from `/api/projects` and returns `{ projects, loading, error, refresh }`
  - Project list page renders a grid/list of project cards
  - Each card shows: project name, current stage, stage status badge, next action (truncated if long), who acts next badge, blockers (if any), last updated, and a small workflow progress indicator
  - `StatusBadge` renders coloured badges for: `not-started` (grey), `in-progress` (blue), `blocked` (red/orange), `complete` (green)
  - Sort controls allow sorting by: name (A–Z), last updated (newest first), stage number (lowest first)
  - Clicking a card navigates to `/project/:id`
  - Loading state shows a spinner or skeleton
  - Error state shows a clear message
  - Empty state shows a message when no projects are found
- **Size**: Medium
- **Status**: `done`

---

### Task 10: Project detail view

- **Description**: Build the full project detail page with all STATUS.md fields, workflow map, artifact checklist, and stage history.
- **Files affected**:
  - `client/src/components/ProjectDetail.jsx`
  - `client/src/components/WorkflowMap.jsx`
  - `client/src/components/ArtifactChecklist.jsx`
  - `client/src/components/StageHistory.jsx`
  - `client/src/hooks/useProjectDetail.js`
  - `client/src/styles/components.css`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - `useProjectDetail(id)` hook fetches from `/api/projects/:id` and returns `{ project, loading, error }`
  - Page displays all STATUS.md control panel fields in a structured layout
  - `WorkflowMap` shows stages 1–9 as a horizontal step indicator with: completed (filled), active (highlighted), blocked (warning), upcoming (dimmed) states
  - `ArtifactChecklist` lists all 10 standard artifacts with completion status (checkbox from STATUS.md) and file existence indicator; clicking an existing file triggers the file viewer
  - `StageHistory` renders the stage transition table (date, stage, who, notes)
  - Back navigation to the project list
  - Loading and error states handled
  - Projects with `parseError` show a warning banner with the error message
- **Size**: Large
- **Status**: `done`

---

### Task 11: File viewer

- **Description**: Build the in-app file viewer that renders markdown content as formatted HTML in an overlay panel.
- **Files affected**:
  - `client/src/components/FileViewer.jsx`
  - `client/src/styles/components.css`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - Opens as a modal/overlay panel within the project detail view
  - Fetches file content from `/api/projects/:id/files/:filename`
  - Renders markdown as formatted HTML using `react-markdown` with `remark-gfm`
  - Supports: headings, paragraphs, lists (ordered and unordered), tables, code blocks, inline code, bold, italic, checkboxes
  - Shows the filename as a header
  - Close button dismisses the viewer and returns to the project detail
  - Loading state while fetching file content
  - Error state if the file cannot be loaded
  - Styled to match the dark theme
- **Size**: Medium
- **Status**: `done`

---

### Task 12: Integration and polish

- **Description**: Wire up the production build, test end-to-end flow, handle edge cases, and ensure the app runs correctly with a single command.
- **Files affected**:
  - `server/index.js` (static file serving for production)
  - `package.json` (verify scripts)
  - `client/vite.config.js` (build output config)
  - Various components (error state improvements)
- **Depends on**: Tasks 9, 10, 11
- **Acceptance criteria**:
  - `npm run build` builds the frontend to `client/dist/`
  - `npm start` starts the production server serving the built frontend and API
  - `npm run dev` starts both backend and frontend dev servers using `concurrently`
  - Navigating to `http://localhost:3000` shows the project list
  - Clicking a project shows the detail view with all fields populated
  - Clicking an artifact opens the file viewer with rendered markdown
  - Projects with missing or broken `STATUS.md` show a warning state (not a crash)
  - Scan directories that don't exist are skipped with a console warning
  - The app handles an empty project list gracefully
  - No console errors during normal operation
- **Size**: Small
- **Status**: `done`

---

<!-- NEXT STEP: Move to Stage 6 — Implementation. Execute tasks in order, logging each in 06-implementation-log.md -->
