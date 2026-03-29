# Specification — DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 3 — Specification |
| **Status** | Approved |
| **Source** | `01-idea.md`, `02-clarification.md` |

---

## 1. Product Summary

DevDashboard is a local, read-only web application that provides a visual dashboard for projects built using the AI Build Operating System. It scans configured directories, reads each project's `STATUS.md` and standard artifacts, and presents the information in a clean, browsable interface.

The user can see all discovered projects at a glance, drill into any single project to understand its full state, view project files directly in the app, and quickly determine what needs to happen next.

---

## 2. Users

| User | Role |
|---|---|
| **Primary** | The project operator (Andre) — manages multiple software projects with AI agent support |
| **Secondary** | AI agents — benefit indirectly from the structured project state the dashboard preserves |

---

## 3. Goals

The application must make it easy to:

1. See all active projects across multiple directories in one place
2. Understand the current stage and status of each project at a glance
3. Know the next required action and who needs to act
4. View project artifacts (markdown files) directly in the dashboard
5. Identify blocked projects or projects needing human input
6. Resume work on any project with minimal re-orientation

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser UI                     │
│          (React SPA — dark theme)                │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Project  │  │   Project    │  │   File    │  │
│  │  List    │→ │   Detail     │→ │  Viewer   │  │
│  └──────────┘  └──────────────┘  └───────────┘  │
└────────────────────┬────────────────────────────┘
                     │ HTTP API
┌────────────────────┴────────────────────────────┐
│               Node.js Backend                    │
│          (Express — REST API)                    │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Scanner  │  │   STATUS.md  │  │   File    │  │
│  │ Service  │  │   Parser     │  │  Reader   │  │
│  └──────────┘  └──────────────┘  └───────────┘  │
└────────────────────┬────────────────────────────┘
                     │ File System
┌────────────────────┴────────────────────────────┐
│            Project Folders on Disk                │
│   (multiple configured scan directories)         │
│                                                  │
│   project-a/STATUS.md                            │
│   project-b/STATUS.md                            │
│   ...                                            │
└─────────────────────────────────────────────────┘
```

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite for build tooling) |
| **Backend** | Node.js with Express |
| **Styling** | CSS (dark theme) |
| **Markdown rendering** | Client-side markdown-to-HTML library (e.g. `react-markdown`) |
| **Package manager** | npm |
| **Database** | None — file system is the data source |
| **Hosting** | Local only |

---

## 6. Configuration

The app reads a `config.json` file from the application root directory.

### config.json schema

```json
{
  "scanDirectories": [
    "C:/Github",
    "D:/Projects"
  ],
  "port": 3000
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `scanDirectories` | `string[]` | Yes | List of absolute paths to parent directories containing project folders |
| `port` | `number` | No | Port for the local server (default: `3000`) |

---

## 7. Project Discovery

### What makes a valid project

A folder inside a scan directory is treated as a valid project if and only if it contains a `STATUS.md` file.

### Scanning behaviour

- The app scans each configured directory one level deep (not recursive)
- Each immediate child folder is checked for the presence of `STATUS.md`
- Folders without `STATUS.md` are ignored
- If `STATUS.md` exists but cannot be parsed, the project is shown with a warning state

---

## 8. STATUS.md Parsing

The backend parses the `STATUS.md` control panel table to extract:

| Field | Key in table |
|---|---|
| Project name | `Project` |
| Current stage | `Current Stage` |
| Stage status | `Stage Status` |
| Objective | `Objective` |
| Current action required | `Current Action Required` |
| Who acts next | `Who Acts Next` |
| Artifact due next | `Artifact Due Next` |
| Required input from human | `Required Input From Human` |
| Relevant files | `Relevant Files` |
| Open questions | `Open Questions` |
| Blockers | `Blockers` |
| Last completed step | `Last Completed Step` |
| Next step after current | `Next Step After Current` |
| Started date | `Started` |
| Last updated date | `Last Updated` |

The parser also extracts:
- **Completed artifacts** — from the checkbox list (`- [x]` = complete, `- [ ]` = incomplete)
- **Stage history** — from the stage history table if present

### Parse failure handling

If `STATUS.md` is present but the control panel table cannot be parsed:
- The project still appears in the project list
- It is displayed with a warning badge and a message explaining the parse issue
- The project name falls back to the folder name

---

## 9. Artifact Detection

In addition to parsing `STATUS.md`, the backend checks for the existence of standard artifact files:

| File | Artifact |
|---|---|
| `01-idea.md` | Idea capture |
| `02-clarification.md` | Clarification Q&A |
| `03-spec.md` | Specification |
| `04-plan.md` | Implementation plan |
| `05-tasks.md` | Task breakdown |
| `06-implementation-log.md` | Implementation log |
| `07-review.md` | Review checklist |
| `08-report.md` | Post-task report |
| `09-handoff.md` | Session handoff |
| `decisions.md` | Decision log |

The existence of each file is reported alongside the checkbox status from `STATUS.md`.

---

## 10. Views

### 10.1 Project List View

The main screen. Shows all discovered projects in a summary format.

**For each project, display:**

| Element | Source |
|---|---|
| Project name | `STATUS.md` → `Project` (fallback: folder name) |
| Current stage | `STATUS.md` → `Current Stage` |
| Stage status | `STATUS.md` → `Stage Status` |
| Next action | `STATUS.md` → `Current Action Required` |
| Who acts next | `STATUS.md` → `Who Acts Next` |
| Blockers | `STATUS.md` → `Blockers` |
| Last updated | `STATUS.md` → `Last Updated` |
| Workflow progress | Visual indicator showing completed / current / upcoming stages |

**Sorting options (basic):**
- By project name (alphabetical)
- By last updated date
- By current stage number

**Visual indicators:**
- Stage status badge (not-started, in-progress, blocked, complete)
- Who acts next badge (human, agent)
- Blocker alert if blockers are present

---

### 10.2 Project Detail View

Shown when the user selects a project from the list. Focuses on one project at a time.

**Display all STATUS.md fields:**
- Project name
- Objective
- Current stage + stage status
- Current action required
- Who acts next
- Required input from human
- Artifact due next
- Relevant files
- Open questions
- Blockers
- Last completed step
- Next step after current
- Started / last updated dates

**Artifact checklist:**
- List of all standard artifacts with their completion status
- Each artifact is clickable to open the file viewer (if the file exists)

**Stage history table:**
- Date, stage, who, and notes for each transition

**Visual workflow map:**
- Horizontal or vertical stage progression showing:
  - Completed stages (filled/checked)
  - Current active stage (highlighted)
  - Blocked stage (warning style)
  - Upcoming stages (dimmed)

---

### 10.3 File Viewer

Opened when the user clicks on an artifact file from the project detail view.

**Behaviour:**
- Reads the file from disk via the backend API
- Renders the markdown content as formatted HTML (headings, lists, tables, code blocks, bold, inline code)
- Displayed as a panel or overlay within the app (not a separate page/tab)
- Includes the file name as a header
- Provides a way to close the viewer and return to the project detail

**Scope for MVP:**
- Markdown rendering only (no file editing)
- Standard markdown elements supported: headings, paragraphs, lists, tables, code blocks, inline formatting
- No support needed for images or embedded media in MVP

---

## 11. API Endpoints

The backend exposes a simple REST API consumed by the frontend.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Returns a list of all discovered projects with summary data |
| `GET` | `/api/projects/:id` | Returns full detail for a single project (parsed STATUS.md + artifact status) |
| `GET` | `/api/projects/:id/files` | Returns the list of files in the project folder |
| `GET` | `/api/projects/:id/files/:filename` | Returns the raw content of a specific file |
| `GET` | `/api/config` | Returns the current app configuration |

### Project identifier

Each project is identified by a combination of its scan directory index and folder name (or a slugified version). This avoids path collisions across scan directories.

---

## 12. Non-Functional Requirements

| Requirement | Detail |
|---|---|
| **Performance** | Should load the project list within 2 seconds for up to 50 projects |
| **Reliability** | Gracefully handles missing, malformed, or empty STATUS.md files |
| **Security** | File access is restricted to configured scan directories only (no path traversal) |
| **Portability** | Runs on Windows (primary), should also work on macOS/Linux |
| **Simplicity** | No database, no authentication, no external services |

---

## 13. Out of Scope (MVP)

The following are explicitly excluded from the first version:

- Editing project files from the UI
- Creating new projects from the dashboard
- Updating STATUS.md from the dashboard
- Cloud hosting or remote access
- Multi-user or team features
- Authentication or user accounts
- Advanced analytics or reporting
- Automatic AI execution or prompt generation
- Image or media rendering in the file viewer
- Settings UI (configuration is via `config.json` only)

---

## 14. Workflow Stages Reference

For context, the 9 stages of the AI Build Operating System:

| # | Stage | Artifact |
|---|---|---|
| 1 | Idea Capture | `01-idea.md` |
| 2 | Clarification | `02-clarification.md` |
| 3 | Specification | `03-spec.md` |
| 4 | Technical Plan | `04-plan.md` |
| 5 | Task Breakdown | `05-tasks.md` |
| 6 | Implementation | `06-implementation-log.md` |
| 7 | Review | `07-review.md` |
| 8 | Documentation | `08-report.md` |
| 9 | Handoff | `09-handoff.md` |

---

## 15. Success Criteria

The MVP is successful if:

1. The app starts locally and loads within a few seconds
2. All valid projects across configured scan directories appear in the list
3. Each project shows accurate stage, status, and next action from its `STATUS.md`
4. Clicking a project shows its full detail with all control panel fields
5. The visual workflow map correctly reflects completed, active, and upcoming stages
6. Clicking an artifact opens the file content rendered as formatted markdown
7. Projects with broken `STATUS.md` appear with a clear warning rather than crashing
8. The dashboard makes it faster to understand project state than manually opening files

---

<!-- APPROVAL GATE: This spec must be approved by the human before moving to Stage 4 — Technical Plan -->
