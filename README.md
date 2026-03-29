# DevDashboard

A local, read-only web dashboard for monitoring projects built with the [AI Build Operating System](https://github.com/AndrewMill84/Dashboard). Scans your directories, parses `STATUS.md` files, and gives you a visual overview of every project's stage, status, and next action — all in one place.

---

## Features

- **Project discovery** — scans configured directories and finds projects with `STATUS.md`
- **STATUS.md parsing** — extracts all 14 control panel fields, completed artifacts, and stage history
- **Project list view** — summary cards with stage, status badges, who acts next, and blockers
- **Project detail view** — full control panel, 9-stage workflow map, artifact checklist, stage history
- **File viewer** — click any artifact to view it rendered as formatted markdown (GFM support)
- **Settings panel** — add/remove scan directories from the UI without editing config files
- **Smart scanner** — works whether you point it at a parent folder or a specific project folder
- **Light/dark theme** — toggle in the header, persisted in localStorage, respects system preference on first visit
- **Path security** — directory traversal protection on all file-reading endpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Frontend | React 19 + Vite |
| Styling | Plain CSS with custom properties |
| Markdown | react-markdown + remark-gfm |
| Package manager | npm |
| Database | None — the file system is the data source |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

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

Edit `config.json` in the project root to point at the directories where your projects live:

```json
{
  "scanDirectories": [
    "C:/path/to/your/projects",
    "D:/another/project/folder"
  ],
  "port": 3000
}
```

Each directory is scanned one level deep. Any child folder containing a `STATUS.md` file is treated as a tracked project. Folders without `STATUS.md` appear as "not yet initialized".

### 4. Build and run

```bash
npm run build
npm start
```

Open **http://localhost:3000** in your browser.

---

## Development

For local development with hot reload:

```bash
npm run dev
```

This starts both the Express backend (port 3000) and the Vite dev server (port 5173) concurrently. The Vite dev server proxies API requests to the backend automatically.

---

## Project Structure

```
DevDashboard/
├── server/                  # Express backend
│   ├── index.js             # Entry point
│   ├── config.js            # Config loader and validator
│   ├── routes/
│   │   ├── projects.js      # GET /api/projects, GET /api/projects/:id
│   │   ├── files.js         # GET /api/projects/:id/files[/:filename]
│   │   └── config.js        # GET/POST/DELETE /api/config/scan-directories
│   ├── services/
│   │   ├── scanner.js       # Directory scanner + project discovery
│   │   ├── statusParser.js  # STATUS.md markdown parser
│   │   └── artifactDetector.js  # Standard artifact file detection
│   └── utils/
│       └── pathSecurity.js  # Path traversal prevention
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api/             # API client
│   │   ├── styles/          # CSS (global + components)
│   │   └── utils/           # Stage definitions
│   └── vite.config.js
├── config.json              # Scan directories and port config
├── templates/               # AI Build OS artifact templates
├── workflow/                # AI Build OS stage definitions
├── memory/                  # Decisions, patterns, project index
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all discovered projects with summary data |
| `GET` | `/api/projects/:id` | Full project detail (STATUS.md fields + artifact status) |
| `GET` | `/api/projects/:id/files` | List files in a project folder |
| `GET` | `/api/projects/:id/files/:filename` | Read a specific file's content |
| `GET` | `/api/config` | Current app configuration |
| `POST` | `/api/config/scan-directories` | Add a scan directory |
| `DELETE` | `/api/config/scan-directories` | Remove a scan directory |
| `GET` | `/api/health` | Health check |

---

## What is the AI Build Operating System?

The AI Build OS is a markdown-based workflow system for managing software projects across 9 stages — from idea capture through handoff. It uses structured templates, a decision log, and a single status tracker (`STATUS.md`) so both humans and AI agents always know the current state and next action.

| Stage | Purpose | Artifact |
|---|---|---|
| 1. Idea Capture | Record the raw idea | `01-idea.md` |
| 2. Clarification | Fill gaps, resolve ambiguity | `02-clarification.md` |
| 3. Specification | Define what to build | `03-spec.md` |
| 4. Technical Plan | Design how to build it | `04-plan.md` |
| 5. Task Breakdown | Split into small tasks | `05-tasks.md` |
| 6. Implementation | Build it | `06-implementation-log.md` |
| 7. Review | Verify it works | `07-review.md` |
| 8. Documentation | Record outcomes | `08-report.md` |
| 9. Handoff | Prepare for next phase | `09-handoff.md` |

DevDashboard is the visual companion for this workflow — it reads these files and presents them in an accessible UI.

---

## Configuration

### config.json

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `scanDirectories` | `string[]` | Yes | — | Absolute paths to directories containing project folders |
| `port` | `number` | No | `3000` | Port for the local server |

You can manage scan directories from the settings panel in the app (gear icon in the header) or by editing `config.json` directly.

---

## Known Limitations

- **Read-only** — no editing project files from the UI
- **No auto-refresh** — reload the page to see external changes
- **Single-level scan** — only immediate child folders are discovered
- **Local only** — no authentication, no remote access
- **Windows-primary** — tested on Windows 10; should work on macOS/Linux but not verified

---

## Future Enhancements

- Auto-refresh project list on a timer
- Unit tests for parser, scanner, and path security
- Search and filter projects by name
- Nested directory file browser
- Cross-platform verification

---

## License

This project is provided as-is for personal use.
