# DevDashboard

A local web dashboard for monitoring and bootstrapping projects built with the AI Build Operating System. It scans your directories, parses `STATUS.md` files, lets you inspect project artifacts in the browser, and can scaffold a brand-new AI Build OS project from a local starter repository.

---

## Features

- Project discovery - scans configured directories and finds projects with `STATUS.md`
- `STATUS.md` parsing - extracts all 14 control panel fields, completed artifacts, and stage history
- Project list view - summary cards with stage, status badges, who acts next, and blockers
- Project detail view - full control panel, 9-stage workflow map, artifact checklist, and stage history
- File viewer - click any artifact to view it rendered as formatted markdown with GFM support
- New project bootstrap - create a fresh AI Build OS project scaffold from the dashboard
- Settings panel - add or remove scan directories from the UI without editing config files
- Smart scanner - works whether you point it at a parent folder or a specific project folder
- Light and dark theme - toggle in the header, persisted in `localStorage`
- Path security - directory traversal protection on all file-reading endpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Frontend | React 19 + Vite |
| Styling | Plain CSS with custom properties |
| Markdown | `react-markdown` + `remark-gfm` |
| Package manager | npm |
| Database | None - the file system is the data source |

---

## Prerequisites

- Node.js v18 or later
- npm v9 or later

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AndrewMill84/Dashboard.git
cd Dashboard
```

### 2. Install dependencies

```bash
npm install
cd client && npm install && cd ..
```

### 3. Configure scan directories

Edit `config.json` in the project root so it points at the directories where your projects live:

```json
{
  "scanDirectories": [
    "C:/path/to/your/projects",
    "D:/another/project/folder"
  ],
  "bootstrapSourcePath": "C:/path/to/ai-build-os",
  "port": 3000
}
```

Each directory is scanned one level deep. Any child folder containing a `STATUS.md` file is treated as a tracked project. Folders without `STATUS.md` appear as "not yet initialized".

### 4. Build and run

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development

For local development with hot reload:

```bash
npm run dev
```

This starts both the Express backend on `3000` and the Vite dev server on `5173`. The Vite dev server proxies API requests to the backend automatically.

If you already have an older DevDashboard server process running on `localhost:3000`, restart it after pulling code changes so new routes and config fields are picked up:

```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
node server/index.js
```

You can verify the bootstrap-capable backend is live with:

```powershell
Invoke-RestMethod http://localhost:3000/api/config | ConvertTo-Json
```

The response should include `bootstrapSourcePath`.

---

## Project Structure

```text
DevDashboard/
|-- server/                          # Express backend
|   |-- index.js                     # Entry point
|   |-- config.js                    # Config loader / saver and validator
|   |-- routes/
|   |   |-- projects.js              # Project APIs + POST /api/projects/bootstrap
|   |   |-- files.js                 # File listing and file reads
|   |   `-- config.js                # GET /api/config + scan-directory management
|   |-- services/
|   |   |-- scanner.js               # Directory scanner + project discovery
|   |   |-- statusParser.js          # STATUS.md markdown parser
|   |   |-- artifactDetector.js      # Standard artifact file detection
|   |   `-- projectBootstrap.js      # Curated scaffold copy + starter file generation
|   `-- utils/
|       `-- pathSecurity.js          # Path traversal prevention
|-- client/                          # React frontend (Vite)
|   |-- src/
|   |   |-- components/
|   |   |   `-- CreateProjectModal.jsx  # Header modal for new project scaffolds
|   |   |-- hooks/                   # Custom React hooks
|   |   |-- api/                     # API client
|   |   |-- styles/                  # CSS (global + components)
|   |   `-- utils/                   # Stage definitions
|   `-- vite.config.js
|-- config.json                      # Scan directories, bootstrap source, and port
|-- templates/                       # AI Build OS artifact templates
|-- workflow/                        # AI Build OS stage definitions
|-- memory/                          # Decisions, patterns, project index
`-- package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all discovered projects with summary data |
| `GET` | `/api/projects/:id` | Full project detail (`STATUS.md` fields + artifact status) |
| `GET` | `/api/projects/:id/files` | List files in a project folder |
| `GET` | `/api/projects/:id/files/:filename` | Read a specific file's content |
| `POST` | `/api/projects/bootstrap` | Create a new AI Build OS project scaffold |
| `GET` | `/api/config` | Current app configuration |
| `POST` | `/api/config/scan-directories` | Add a scan directory |
| `DELETE` | `/api/config/scan-directories` | Remove a scan directory |
| `GET` | `/api/health` | Health check |

---

## What Is The AI Build Operating System?

The AI Build OS is a markdown-based workflow system for managing software projects across 9 stages, from idea capture through handoff. It uses structured templates, a decision log, and a single status tracker (`STATUS.md`) so both humans and AI agents always know the current state and next action.

| Stage | Purpose | Artifact |
|---|---|---|
| 1. Idea Capture | Record the raw idea | `01-idea.md` |
| 2. Clarification | Fill gaps and resolve ambiguity | `02-clarification.md` |
| 3. Specification | Define what to build | `03-spec.md` |
| 4. Technical Plan | Design how to build it | `04-plan.md` |
| 5. Task Breakdown | Split into small tasks | `05-tasks.md` |
| 6. Implementation | Build it | `06-implementation-log.md` |
| 7. Review | Verify it works | `07-review.md` |
| 8. Documentation | Record outcomes | `08-report.md` |
| 9. Handoff | Prepare for the next phase | `09-handoff.md` |

DevDashboard is the visual companion for this workflow. It reads these files, presents them in a browser UI, and now bootstraps new projects with the same structure.

---

## Configuration

### `config.json`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `scanDirectories` | `string[]` | Yes | - | Absolute paths to directories containing project folders |
| `bootstrapSourcePath` | `string` | No | - | Absolute path to the local AI Build OS starter repository used for scaffolding new projects |
| `port` | `number` | No | `3000` | Port for the local server |

You can manage scan directories from the settings panel in the app or by editing `config.json` directly. The create-project flow uses `bootstrapSourcePath` and adds a new parent location to `scanDirectories` automatically when needed so the created project appears immediately.

### Creating a project from the dashboard

1. Click **New Project** in the header.
2. Enter the parent location and new folder name.
3. DevDashboard creates the folder, copies the curated AI Build OS starter scaffold, generates `STATUS.md` and `01-idea.md`, and opens the new project.

If the modal shows `bootstrapSourcePath is not configured in config.json` but your local `config.json` already contains it, you are almost certainly talking to an older backend process on `localhost:3000`. Restart the server and try again.

Generated scaffold contents include:

- `AGENTS.md`
- `.cursorrules`
- `.agents/`
- `workflow/`
- `templates/`
- `QUICKREF.md`
- `new-project-checklist.md`
- `STATUS.md`
- `01-idea.md`
- `memory/decisions.md`
- `memory/patterns.md`
- `memory/project-index.md`

---

## Known Limitations

- Mostly read-only - project creation is supported, but editing existing project files from the UI is not
- No auto-refresh - reload the page to see external changes
- Single-level scan - only immediate child folders are discovered
- Local only - no authentication and no remote access
- Windows-primary - tested on Windows 10; macOS and Linux have not been fully verified

---

## Future Enhancements

- Auto-refresh the project list on a timer
- Unit tests for the parser, scanner, bootstrap service, and path security
- Editable bootstrap source path in the UI
- Search and filter projects by name
- Nested directory file browser
- Optional GitHub fallback for starter scaffold source
- Cross-platform verification

---

## License

This project is provided as-is for personal use.
