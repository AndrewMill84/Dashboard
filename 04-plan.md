# Technical Implementation Plan — DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Status** | Approved |
| **Source** | `03-spec.md` |

---

## 1. Overview

This plan describes how to build DevDashboard as a local Node.js web application with a React frontend and Express backend. The app reads project folders from the file system, parses `STATUS.md` files, and serves the data through a REST API to a single-page React UI.

---

## 2. Project Structure

```
DevDashboard/
├── config.json                  # Scan directories + port config
├── package.json                 # Root package.json (workspace or scripts)
├── server/
│   ├── index.js                 # Express entry point
│   ├── config.js                # Loads and validates config.json
│   ├── routes/
│   │   ├── projects.js          # /api/projects and /api/projects/:id
│   │   └── files.js             # /api/projects/:id/files[/:filename]
│   ├── services/
│   │   ├── scanner.js           # Discovers valid project folders
│   │   ├── statusParser.js      # Parses STATUS.md into structured data
│   │   └── artifactDetector.js  # Checks which standard artifacts exist
│   └── utils/
│       └── pathSecurity.js      # Path traversal prevention
├── client/
│   ├── index.html               # Vite entry HTML
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Root component with routing
│       ├── api/
│       │   └── client.js        # Fetch wrapper for backend API
│       ├── components/
│       │   ├── ProjectList.jsx          # Main dashboard grid/list
│       │   ├── ProjectCard.jsx          # Summary card for one project
│       │   ├── ProjectDetail.jsx        # Full project view
│       │   ├── WorkflowMap.jsx          # Visual stage progression
│       │   ├── ArtifactChecklist.jsx    # Artifact completion list
│       │   ├── StageHistory.jsx         # Stage transition table
│       │   ├── FileViewer.jsx           # Markdown file viewer panel
│       │   ├── StatusBadge.jsx          # Stage status badge
│       │   └── SortControls.jsx         # Sorting UI for project list
│       ├── hooks/
│       │   ├── useProjects.js           # Fetch and cache project list
│       │   └── useProjectDetail.js      # Fetch single project detail
│       ├── styles/
│       │   ├── global.css               # Reset, variables, dark theme
│       │   └── components.css           # Component-specific styles
│       └── utils/
│           └── stages.js                # Stage definitions and helpers
└── docs/                        # Workflow artifacts (01-idea.md, etc.)
```

---

## 3. Backend Design

### 3.1 Entry Point — `server/index.js`

- Creates an Express app
- Loads config from `config.json`
- Mounts API routes under `/api`
- In production mode, serves the built React frontend as static files
- Starts listening on the configured port (default 3000)

### 3.2 Configuration — `server/config.js`

- Reads `config.json` from the project root
- Validates that `scanDirectories` is a non-empty array of strings
- Resolves all paths to absolute paths
- Provides a default port of 3000 if not specified
- Throws a clear error if the config file is missing or invalid

### 3.3 Scanner Service — `server/services/scanner.js`

**Purpose:** Discover valid project folders across all scan directories.

**Logic:**
1. Iterate each scan directory from config
2. List immediate child directories (one level deep, not recursive)
3. For each child, check if `STATUS.md` exists
4. If yes, include it as a valid project
5. Generate a stable project ID from the scan directory index + folder name (e.g. `0-devdashboard`)

**Returns:** Array of `{ id, name, path, scanDirectory }` objects.

### 3.4 STATUS.md Parser — `server/services/statusParser.js`

**Purpose:** Parse a STATUS.md file into a structured object.

**Logic:**
1. Read the file as UTF-8 text
2. Find the Control Panel table (markdown table following the `## 🎛️ Control Panel` heading)
3. Parse each row: extract the field name from the bold text in column 1, and the value from column 2
4. Strip backticks and leading/trailing whitespace from values
5. Parse the Completed Artifacts section: find lines matching `- [x]` and `- [ ]` patterns
6. Parse the Stage History table if present

**Returns:**
```js
{
  project: "DevDashboard",
  currentStage: "4 — Technical Plan",
  stageStatus: "in-progress",
  objective: "...",
  currentActionRequired: "...",
  whoActsNext: "agent",
  artifactDueNext: "04-plan.md",
  requiredInputFromHuman: "...",
  relevantFiles: "...",
  openQuestions: "None",
  blockers: "None",
  lastCompletedStep: "...",
  nextStepAfterCurrent: "...",
  started: "2026-03-29",
  lastUpdated: "2026-03-29",
  completedArtifacts: [
    { name: "01-idea.md", label: "Idea capture", completed: true },
    { name: "02-clarification.md", label: "Clarification Q&A", completed: true },
    ...
  ],
  stageHistory: [
    { date: "2026-03-29", stage: "1 — Idea Capture", who: "human", notes: "..." },
    ...
  ],
  parseError: null
}
```

If parsing fails, return a partial object with `parseError` set to a descriptive message.

### 3.5 Artifact Detector — `server/services/artifactDetector.js`

**Purpose:** Check which standard artifact files actually exist on disk.

**Logic:**
1. Given a project path, check for each of the 10 standard files
2. Return a map of filename → boolean (exists or not)

This is used alongside the STATUS.md checkbox data to give a complete picture.

### 3.6 Path Security — `server/utils/pathSecurity.js`

**Purpose:** Prevent path traversal attacks in the file-reading endpoint.

**Logic:**
1. Resolve the requested file path to an absolute path
2. Check that it falls within one of the configured scan directories
3. Reject any request that tries to escape (e.g. `../../etc/passwd`)

### 3.7 API Routes

#### `GET /api/projects`

1. Run the scanner to discover all valid projects
2. For each project, parse `STATUS.md` and detect artifacts
3. Return an array of summary objects

Response shape:
```json
[
  {
    "id": "0-devdashboard",
    "name": "DevDashboard",
    "folderName": "DevDashboard",
    "currentStage": "4 — Technical Plan",
    "stageStatus": "in-progress",
    "currentActionRequired": "...",
    "whoActsNext": "agent",
    "blockers": "None",
    "lastUpdated": "2026-03-29",
    "stageNumber": 4,
    "completedStages": 3,
    "totalStages": 9,
    "parseError": null
  }
]
```

#### `GET /api/projects/:id`

1. Look up the project by ID
2. Return full parsed STATUS.md data + artifact existence map

#### `GET /api/projects/:id/files`

1. List all files in the project directory (non-recursive, files only)
2. Return an array of filenames

#### `GET /api/projects/:id/files/:filename`

1. Validate the filename against path security
2. Read the file as UTF-8
3. Return `{ filename, content }` as JSON

#### `GET /api/config`

1. Return the current configuration (scan directories, port)

---

## 4. Frontend Design

### 4.1 Routing

Using React Router with two main routes:

| Route | Component | Description |
|---|---|---|
| `/` | `ProjectList` | Dashboard with all projects |
| `/project/:id` | `ProjectDetail` | Single project view |

The file viewer is not a separate route — it opens as an overlay/panel within `ProjectDetail`.

### 4.2 Component Breakdown

**`ProjectList`**
- Fetches `/api/projects` on mount
- Renders a grid of `ProjectCard` components
- Includes `SortControls` for sorting by name, updated, or stage
- Handles loading and empty states

**`ProjectCard`**
- Displays the summary for one project
- Shows: name, stage, status badge, next action, who acts next, blockers, workflow progress bar
- Clickable — navigates to `/project/:id`

**`ProjectDetail`**
- Fetches `/api/projects/:id` on mount
- Displays all STATUS.md fields in a structured layout
- Contains `WorkflowMap`, `ArtifactChecklist`, and `StageHistory`
- Manages the `FileViewer` overlay state

**`WorkflowMap`**
- Horizontal bar or step indicator showing stages 1–9
- Each stage shows: label, completed/active/upcoming/blocked state
- Active stage is highlighted, completed stages are filled, blocked gets a warning style

**`ArtifactChecklist`**
- Lists all 10 standard artifacts
- Shows checkbox state (from STATUS.md) and file existence (from artifact detection)
- Files that exist are clickable (opens `FileViewer`)
- Files that don't exist are greyed out

**`StageHistory`**
- Simple table rendering the stage history from STATUS.md

**`FileViewer`**
- Overlay/modal panel that opens within the project detail view
- Fetches `/api/projects/:id/files/:filename`
- Renders markdown content as HTML using `react-markdown`
- Shows filename as header, close button to dismiss

**`StatusBadge`**
- Small coloured badge component
- Variants: `not-started` (grey), `in-progress` (blue), `blocked` (red/orange), `complete` (green)

**`SortControls`**
- Simple button group or dropdown
- Options: name (A–Z), last updated (newest first), stage (lowest first)

### 4.3 API Client — `client/src/api/client.js`

A thin wrapper around `fetch()`:
- Base URL: relative `/api` (same origin in dev via Vite proxy, same origin in production)
- JSON parsing
- Error handling (returns error objects rather than throwing)

### 4.4 Custom Hooks

**`useProjects()`**
- Calls `GET /api/projects`
- Returns `{ projects, loading, error, refresh }`

**`useProjectDetail(id)`**
- Calls `GET /api/projects/:id`
- Returns `{ project, loading, error }`

### 4.5 Styling Approach

- Plain CSS with CSS custom properties (variables) for theming
- Dark theme by default using `:root` variables
- Two CSS files: `global.css` (reset, variables, base styles) and `components.css` (component styles)
- No CSS framework — keeps the build simple and the app lightweight
- Responsive layout using CSS Grid for the project list

### 4.6 Stage Definitions — `client/src/utils/stages.js`

A shared reference for stage data:

```js
export const STAGES = [
  { number: 1, name: "Idea Capture", artifact: "01-idea.md" },
  { number: 2, name: "Clarification", artifact: "02-clarification.md" },
  { number: 3, name: "Specification", artifact: "03-spec.md" },
  { number: 4, name: "Technical Plan", artifact: "04-plan.md" },
  { number: 5, name: "Task Breakdown", artifact: "05-tasks.md" },
  { number: 6, name: "Implementation", artifact: "06-implementation-log.md" },
  { number: 7, name: "Review", artifact: "07-review.md" },
  { number: 8, name: "Documentation", artifact: "08-report.md" },
  { number: 9, name: "Handoff", artifact: "09-handoff.md" },
];
```

---

## 5. Development Workflow

### 5.1 Dev Mode

Run two processes during development:

1. **Backend**: `node server/index.js` — runs the Express API on port 3000
2. **Frontend**: `npm run dev` in `client/` — runs Vite dev server on port 5173 with a proxy to the backend

Vite config will proxy `/api` requests to `http://localhost:3000`.

### 5.2 Production Build

1. Run `npm run build` in `client/` — outputs static files to `client/dist/`
2. Express serves `client/dist/` as static files
3. Single command to start: `node server/index.js`

### 5.3 Start Script

A root `package.json` script:
- `npm run dev` — starts both backend and Vite dev server (using `concurrently` or similar)
- `npm run build` — builds the frontend
- `npm start` — starts the production server

---

## 6. Dependencies

### Backend (`package.json` at root or `server/`)

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `cors` | Cross-origin support (dev mode) |

### Frontend (`client/package.json`)

| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-dom` | React DOM rendering |
| `react-router-dom` | Client-side routing |
| `react-markdown` | Markdown → HTML rendering |
| `remark-gfm` | GitHub-flavoured markdown support (tables, checkboxes) |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `vite` | Frontend build tool |
| `@vitejs/plugin-react` | Vite React support |
| `concurrently` | Run backend + frontend in dev mode |

Total: ~8 packages. Deliberately minimal.

---

## 7. Key Design Decisions

| Decision | Rationale |
|---|---|
| Express over Next.js | Simpler for a local tool; no SSR needed; clearer separation of backend and frontend |
| Vite over CRA | Faster dev server, smaller builds, modern defaults |
| Plain CSS over Tailwind/CSS-in-JS | Fewer dependencies, simpler build, good enough for a focused app |
| `react-markdown` over custom renderer | Battle-tested, supports GFM tables and checkboxes out of the box |
| File-based config over settings UI | Keeps MVP simple; config rarely changes |
| Stable project IDs from path | No database needed; IDs are deterministic and URL-safe |

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| STATUS.md format varies between projects | Parser returns partial/wrong data | Defensive parsing with fallbacks; show warning for unparseable fields |
| Large number of projects slows load | Slow project list | Scan is I/O bound but fast for <100 folders; optimize later if needed |
| Path traversal in file endpoint | Security vulnerability | Strict path validation in `pathSecurity.js`; only allow files within scan dirs |
| Markdown rendering edge cases | Broken rendering for unusual content | Use well-maintained library (`react-markdown` + `remark-gfm`); accept imperfect edge cases in MVP |
| Config file missing on first run | App crashes at startup | Provide a default `config.json` with helpful comments; clear error message if missing |

---

## 9. What This Plan Does NOT Cover

- Editing or writing files (out of scope for MVP)
- Authentication or user management
- WebSocket or real-time updates (page refresh is fine for MVP)
- Database or caching layer
- Automated testing strategy (addressed in task breakdown)
- Deployment beyond local machine

---

## 10. Implementation Order

The recommended build order (to be broken down into tasks in Stage 5):

1. **Project scaffolding** — package.json, folder structure, config
2. **Backend core** — Express server, config loading, scanner service
3. **STATUS.md parser** — the most critical backend logic
4. **Artifact detector** — simple file existence checks
5. **API routes** — wire up all five endpoints
6. **Frontend scaffolding** — Vite + React setup, routing, dark theme
7. **Project list view** — fetch projects, render cards, sorting
8. **Project detail view** — full STATUS.md display, workflow map, artifact list
9. **File viewer** — markdown rendering overlay
10. **Integration and polish** — production build, error states, edge cases

---

<!-- APPROVAL GATE: This plan must be approved by the human before moving to Stage 5 — Task Breakdown -->
