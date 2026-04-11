# Technical Implementation Plan - DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 4 - Technical Plan |
| **Status** | Approved |
| **Source** | `03-spec.md` |

---

## 1. Overview

DevDashboard remains a local Node.js + React dashboard for reading AI Build OS projects from disk, but it now also supports creating a brand-new project scaffold from a local AI Build OS starter repository. The implementation should preserve the existing read-oriented architecture while adding one safe write path for project creation.

---

## 2. Architecture

```text
Browser UI
  -> React app with dashboard, project detail, settings, and create-project modal
  -> Calls local REST API

Express API
  -> Config loader / persistence
  -> Scanner service
  -> STATUS.md parser
  -> Artifact detector
  -> File reader with path security
  -> Project bootstrap service

Local file system
  -> Tracked project folders
  -> AI Build OS starter repository (local source for scaffolding)
```

The bootstrap feature should not introduce a database, background worker, or remote dependency. All writes remain local and synchronous, which keeps the flow simple and debuggable.

---

## 3. Project Structure

```text
DevDashboard/
|-- config.json
|-- server/
|   |-- index.js
|   |-- config.js
|   |-- routes/
|   |   |-- config.js
|   |   |-- files.js
|   |   `-- projects.js
|   |-- services/
|   |   |-- artifactDetector.js
|   |   |-- projectBootstrap.js
|   |   |-- scanner.js
|   |   `-- statusParser.js
|   `-- utils/
|       `-- pathSecurity.js
|-- client/
|   `-- src/
|       |-- api/
|       |   `-- client.js
|       |-- components/
|       |   |-- CreateProjectModal.jsx
|       |   |-- FileViewer.jsx
|       |   |-- ProjectCard.jsx
|       |   |-- ProjectDetail.jsx
|       |   |-- ProjectList.jsx
|       |   |-- SettingsModal.jsx
|       |   |-- SortControls.jsx
|       |   |-- StageHistory.jsx
|       |   |-- StatusBadge.jsx
|       |   `-- WorkflowMap.jsx
|       |-- hooks/
|       |   |-- useProjectDetail.js
|       |   `-- useProjects.js
|       |-- styles/
|       |   |-- components.css
|       |   `-- global.css
|       `-- utils/
|           `-- stages.js
`-- output/
```

---

## 4. Backend Design

### 4.1 `server/config.js`

- Continue loading `scanDirectories` and `port` from `config.json`.
- Add support for optional `bootstrapSourcePath`.
- Resolve all configured paths to absolute paths.
- Keep `saveConfig()` as the single persistence path for config changes.

### 4.2 `server/services/scanner.js`

- Keep the current smart scanning behavior.
- No scanner changes should be required beyond returning projects normally after bootstrap.
- Newly created projects must be discoverable immediately after the bootstrap route returns.

### 4.3 `server/services/projectBootstrap.js`

Create a dedicated service responsible for the scaffold write path.

Responsibilities:
- Validate the local starter repository path.
- Validate the requested parent directory and folder name.
- Create the new target folder.
- Copy a curated starter set from the AI Build OS source:
  - `AGENTS.md`
  - `.cursorrules`
  - `.agents/`
  - `workflow/`
  - `templates/`
  - `QUICKREF.md`
  - `project-starter/new-project-checklist.md` copied as `new-project-checklist.md`
- Generate project-specific starter files:
  - `STATUS.md` from `project-starter/STATUS.md`
  - `01-idea.md` from `templates/idea-intake.md`
  - `memory/decisions.md`
  - `memory/patterns.md`
  - `memory/project-index.md`
- Stamp the new project name and current local date into generated files.
- Remove the partially created target folder if any write fails after creation.

Implementation notes:
- Use `fs.cpSync()` for directory copies and `fs.writeFileSync()` for generated files.
- Treat missing required starter files as configuration errors.
- Reject existing target directories with HTTP 409 semantics.

### 4.4 `server/routes/projects.js`

Add `POST /api/projects/bootstrap`.

Request body:

```json
{
  "parentDirectory": "C:/Github",
  "folderName": "My New Project"
}
```

Route behavior:
- Validate request body shape.
- Resolve `parentDirectory`.
- If the parent directory is not already a configured scan directory, append it to `config.json` before bootstrap so the new project appears immediately.
- Roll the config change back if bootstrap fails.
- Call the bootstrap service.
- Return `201` with the new project ID, path, and whether the location was newly added to the scan list.

Response shape:

```json
{
  "project": {
    "id": "4-my new project",
    "name": "My New Project",
    "path": "C:/Github/My New Project"
  },
  "locationAdded": false
}
```

### 4.5 `server/routes/config.js`

- Extend `GET /api/config` to include `bootstrapSourcePath`.
- Keep add/remove scan-directory behavior unchanged.

### 4.6 Safety Rules

- Bootstrap only writes inside the resolved target folder.
- Folder names must reject traversal sequences and invalid Windows filename characters.
- The feature uses only the configured local starter repository; no GitHub download fallback is part of this implementation.

---

## 5. Frontend Design

### 5.1 Header flow

- Add a `New Project` button in the header alongside theme toggle and settings.
- Keep the current dashboard layout and reuse the existing modal visual language.

### 5.2 `CreateProjectModal.jsx`

Responsibilities:
- Load `/api/config` on open.
- Suggest current scan directories in a datalist, while still allowing any absolute path to be entered.
- Collect:
  - parent location
  - folder name
- Call `createProject(parentDirectory, folderName)`.
- Show inline validation and request errors.
- On success:
  - notify the app so the project list refreshes
  - navigate directly to the new project detail page

### 5.3 API client

Add a `createProject(parentDirectory, folderName)` helper to `client/src/api/client.js`.

### 5.4 Styling

- Reuse the overlay/modal shell from `SettingsModal`.
- Keep the form compact and clearly instructional.
- Explain that non-scanned locations will be added automatically so the project appears in the dashboard.

---

## 6. Config Shape

```json
{
  "scanDirectories": [
    "C:/Github",
    "C:/Users/andre/Loan Scenario Workbench"
  ],
  "bootstrapSourcePath": "C:/Users/andre/AI Build Process/ai-build-os",
  "port": 3000
}
```

`bootstrapSourcePath` is optional in schema terms but required for the create-project feature to work.

---

## 7. Dependencies

No new npm dependencies are required. The feature can be implemented with the existing stack and Node's built-in `fs` / `path` modules.

---

## 8. Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Starter repo path is missing or wrong | Create flow fails | Validate `bootstrapSourcePath` and required source files before creating anything |
| Partial scaffold on failure | Broken starter project | Delete the new target folder on bootstrap failure |
| Parent directory is not currently scanned | New project does not appear | Auto-add the chosen parent directory to `scanDirectories` |
| Invalid folder names on Windows | Create request fails after user input | Validate names early and return a clear error |
| Existing target folder | Accidental overwrite risk | Reject with conflict error; never merge into an existing folder |

---

## 9. Validation Plan

- `npm run build`
- Manual API verification for `POST /api/projects/bootstrap`
- Manual UI verification for:
  - modal open / close
  - successful create flow
  - inline error states
  - navigation to the new project
- Confirm generated scaffold contains:
  - `STATUS.md`
  - `01-idea.md`
  - `templates/`
  - `workflow/`
  - agent files
  - `memory/` files

---

## 10. Implementation Order

1. Update config loading to include `bootstrapSourcePath`.
2. Build the bootstrap service.
3. Add the bootstrap API route and config auto-add / rollback behavior.
4. Add the create-project modal and header button.
5. Refresh and navigate after successful project creation.
6. Validate with a real scaffold creation and production build.

---

<!-- APPROVAL GATE: This plan must be approved by the human before moving to Stage 5 - Task Breakdown -->
