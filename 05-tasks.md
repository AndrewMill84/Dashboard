# Task Breakdown - DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 5 - Task Breakdown |
| **Source** | `04-plan.md` |
| **Total Tasks** | 16 |

---

## Task Summary

| # | Title | Size | Depends On | Status |
|---|---|---|---|---|
| 1 | Project scaffolding | Small | - | `done` |
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
| 13 | Bootstrap config and scaffold service | Medium | 2 | `done` |
| 14 | Bootstrap API route | Medium | 13, 7 | `done` |
| 15 | Create-project modal and header wiring | Medium | 8, 14 | `done` |
| 16 | Bootstrap validation and documentation updates | Small | 13, 14, 15 | `done` |

---

## Tasks

### Task 1: Project scaffolding

- **Description**: Create the root project structure, package.json files, folder hierarchy, and default `config.json`. Install all backend and frontend dependencies.
- **Files affected**:
  - `package.json`
  - `config.json`
  - `server/`
  - `client/package.json`
  - `client/vite.config.js`
  - `client/index.html`
- **Depends on**: None
- **Acceptance criteria**:
  - Root scripts exist and dependencies install cleanly
  - Base folders exist for backend and frontend work
- **Size**: Small
- **Status**: `done`

### Task 2: Express server setup

- **Description**: Create the Express entry point and configuration loader.
- **Files affected**:
  - `server/index.js`
  - `server/config.js`
- **Depends on**: Task 1
- **Acceptance criteria**:
  - Server starts cleanly
  - Config is loaded and validated
  - Health check works
- **Size**: Small
- **Status**: `done`

### Task 3: Scanner service

- **Description**: Implement project discovery from configured directories.
- **Files affected**:
  - `server/services/scanner.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Finds valid projects from configured directories
  - Handles missing directories gracefully
- **Size**: Small
- **Status**: `done`

### Task 4: STATUS.md parser

- **Description**: Parse `STATUS.md` into structured data.
- **Files affected**:
  - `server/services/statusParser.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Extracts control-panel fields, artifacts, and stage history
  - Returns partial data with `parseError` on malformed input
- **Size**: Medium
- **Status**: `done`

### Task 5: Artifact detector

- **Description**: Detect standard AI Build OS artifacts on disk.
- **Files affected**:
  - `server/services/artifactDetector.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Reports file existence for standard artifacts and alternates
- **Size**: Small
- **Status**: `done`

### Task 6: Path security utility

- **Description**: Prevent path traversal in file-reading endpoints.
- **Files affected**:
  - `server/utils/pathSecurity.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - Rejects escaping the project or scan directory
- **Size**: Small
- **Status**: `done`

### Task 7: API routes

- **Description**: Wire up the core REST API.
- **Files affected**:
  - `server/routes/projects.js`
  - `server/routes/files.js`
  - `server/index.js`
- **Depends on**: Tasks 3, 4, 5, 6
- **Acceptance criteria**:
  - Project summary/detail/file endpoints work with correct status codes
- **Size**: Medium
- **Status**: `done`

### Task 8: Frontend scaffolding

- **Description**: Set up React, routing, theme, and API client basics.
- **Files affected**:
  - `client/src/main.jsx`
  - `client/src/App.jsx`
  - `client/src/api/client.js`
  - `client/src/utils/stages.js`
  - `client/src/styles/global.css`
  - `client/src/styles/components.css`
- **Depends on**: Task 1
- **Acceptance criteria**:
  - App renders with routing and shared styling in place
- **Size**: Medium
- **Status**: `done`

### Task 9: Project list view

- **Description**: Build the dashboard list of projects.
- **Files affected**:
  - `client/src/components/ProjectList.jsx`
  - `client/src/components/ProjectCard.jsx`
  - `client/src/components/StatusBadge.jsx`
  - `client/src/components/SortControls.jsx`
  - `client/src/hooks/useProjects.js`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - Cards render project summaries with sorting and error states
- **Size**: Medium
- **Status**: `done`

### Task 10: Project detail view

- **Description**: Build the full project detail page.
- **Files affected**:
  - `client/src/components/ProjectDetail.jsx`
  - `client/src/components/WorkflowMap.jsx`
  - `client/src/components/ArtifactChecklist.jsx`
  - `client/src/components/StageHistory.jsx`
  - `client/src/hooks/useProjectDetail.js`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - Detail page shows status fields, workflow, artifacts, and history
- **Size**: Large
- **Status**: `done`

### Task 11: File viewer

- **Description**: Render project markdown files inside the app.
- **Files affected**:
  - `client/src/components/FileViewer.jsx`
  - `client/src/styles/components.css`
- **Depends on**: Tasks 7, 8
- **Acceptance criteria**:
  - File viewer opens, loads content, and renders markdown correctly
- **Size**: Medium
- **Status**: `done`

### Task 12: Integration and polish

- **Description**: Complete production build wiring and end-to-end polish.
- **Files affected**:
  - `server/index.js`
  - `package.json`
  - `client/vite.config.js`
  - various frontend files
- **Depends on**: Tasks 9, 10, 11
- **Acceptance criteria**:
  - Production build succeeds and primary flows work cleanly
- **Size**: Small
- **Status**: `done`

### Task 13: Bootstrap config and scaffold service

- **Description**: Extend config loading with `bootstrapSourcePath` and create a backend service that builds a fresh AI Build OS project scaffold from the local starter repository.
- **Files affected**:
  - `config.json`
  - `server/config.js`
  - `server/services/projectBootstrap.js`
- **Depends on**: Task 2
- **Acceptance criteria**:
  - `bootstrapSourcePath` is loaded and exposed to the app
  - The service validates the starter repo, parent directory, and folder name
  - The service creates a fresh folder containing starter agent files, `workflow/`, `templates/`, `STATUS.md`, `01-idea.md`, and `memory/` starter files
  - Partial scaffolds are rolled back on failure
- **Size**: Medium
- **Status**: `done`

### Task 14: Bootstrap API route

- **Description**: Add the create-project API endpoint and ensure newly created locations are scanned immediately.
- **Files affected**:
  - `server/routes/projects.js`
  - `server/routes/config.js`
  - `server/index.js`
- **Depends on**: Tasks 13, 7
- **Acceptance criteria**:
  - `POST /api/projects/bootstrap` validates input and returns `201` on success
  - The endpoint adds the parent directory to `scanDirectories` when needed
  - Config rollback happens if the bootstrap service fails after a location was added
  - The response includes the new project ID and path
- **Size**: Medium
- **Status**: `done`

### Task 15: Create-project modal and header wiring

- **Description**: Add a header entry point and modal UI so the user can choose a location and folder name, create a scaffold, and jump straight into the new project.
- **Files affected**:
  - `client/src/App.jsx`
  - `client/src/api/client.js`
  - `client/src/components/CreateProjectModal.jsx`
  - `client/src/styles/components.css`
- **Depends on**: Tasks 8, 14
- **Acceptance criteria**:
  - A `New Project` button is visible in the header
  - The modal suggests configured scan directories and accepts custom absolute paths
  - Success refreshes the dashboard and navigates to the created project
  - Inline error states are shown for validation or API failures
- **Size**: Medium
- **Status**: `done`

### Task 16: Bootstrap validation and documentation updates

- **Description**: Validate the new create-project flow end to end and update project documentation accordingly.
- **Files affected**:
  - `README.md`
  - `07-review.md`
  - `08-report.md`
  - `09-handoff.md`
  - `06-implementation-log.md`
- **Depends on**: Tasks 13, 14, 15
- **Acceptance criteria**:
  - Production build still succeeds
  - A real scaffold creation is verified
  - README documents `bootstrapSourcePath` and the create-project flow
  - Review/report/handoff reflect the new capability
- **Size**: Small
- **Status**: `done`

---

<!-- NEXT STEP: Move to Stage 6 - Implementation. Execute the bootstrap tasks in order, logging the session in 06-implementation-log.md -->
