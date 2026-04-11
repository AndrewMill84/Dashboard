# Decision Log — DevDashboard

## Decision 1: Express over Next.js

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Use Express as the backend framework instead of Next.js |
| **Rationale** | DevDashboard is a local tool with no SSR requirements. Express provides a cleaner separation between backend API and frontend SPA, is simpler to reason about, and avoids the overhead of a full-stack framework for what is essentially a file-reading REST API. |
| **Alternatives considered** | Next.js (rejected: unnecessary complexity for a local dashboard with no SEO or SSR needs) |

---

## Decision 2: Vite over Create React App

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Use Vite as the frontend build tool instead of Create React App |
| **Rationale** | Vite offers a faster dev server (native ES modules), smaller production builds, and modern defaults. CRA is effectively deprecated and slower in development. |
| **Alternatives considered** | Create React App (rejected: slow dev server, large dependency tree, no longer actively maintained) |

---

## Decision 3: Plain CSS over Tailwind or CSS-in-JS

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Use plain CSS with CSS custom properties for theming |
| **Rationale** | Fewer dependencies, simpler build pipeline, and sufficient for a focused app with a limited number of components. CSS variables provide clean dark theme support without a framework. |
| **Alternatives considered** | Tailwind CSS (rejected: adds build complexity and a learning curve for limited benefit at this scale), CSS-in-JS (rejected: runtime cost, additional dependencies) |

---

## Decision 4: react-markdown for file viewing

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Use `react-markdown` with `remark-gfm` for rendering markdown files in the app |
| **Rationale** | Battle-tested library that supports GitHub-flavoured markdown (tables, checkboxes, strikethrough) out of the box. Integrates naturally with React and avoids the need for a custom markdown parser. |
| **Alternatives considered** | Custom renderer (rejected: significant effort, error-prone), `marked` + `dangerouslySetInnerHTML` (rejected: XSS risk, less React-idiomatic) |

---

## Decision 5: File-based config over settings UI

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Configure scan directories via `config.json` rather than an in-app settings page |
| **Rationale** | Keeps the MVP simple. Configuration changes are rare (adding a new scan directory). A JSON file is easy to edit manually and avoids building a settings UI, validation, and persistence layer for the MVP. A settings UI can be added in a future version. |
| **Alternatives considered** | In-app settings page (deferred to post-MVP) |

---

## Decision 6: Stable project IDs from path

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 — Technical Plan |
| **Decision** | Generate project IDs by combining the scan directory index and folder name (e.g. `0-devdashboard`) |
| **Rationale** | Deterministic, URL-safe, and requires no database or state file. The scan directory index prevents collisions when two directories contain folders with the same name. IDs remain stable across app restarts as long as the config order doesn't change. |
| **Alternatives considered** | UUID generation (rejected: requires persistence), hash-based IDs (rejected: harder to debug, no clear advantage) |

---

## Decision 7: Use a configured local AI Build OS source for scaffolding

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 - Technical Plan |
| **Decision** | Create-project bootstrap uses a local `bootstrapSourcePath` in `config.json` rather than downloading starter files from GitHub at runtime |
| **Rationale** | The dashboard is a local tool, network access is unnecessary for the common path, and the local source is the authoritative working copy. Using a local path avoids network failures and keeps scaffold creation fast and deterministic. |
| **Alternatives considered** | GitHub download at runtime (rejected: adds network dependency and version drift), bundling starter files inside DevDashboard (rejected: duplicates the AI Build OS source of truth) |

---

## Decision 8: Auto-add bootstrap locations to scanDirectories

| Field | Value |
|---|---|
| **Date** | 2026-03-29 |
| **Stage** | 4 - Technical Plan |
| **Decision** | When a project is created in a parent location that is not already scanned, append that parent directory to `scanDirectories` automatically |
| **Rationale** | The user expects the newly created project to show up in DevDashboard immediately. Automatically adding the parent location avoids a second setup step and keeps the bootstrap flow end-to-end. |
| **Alternatives considered** | Restrict creation to existing scan directories only (rejected: less flexible than the requested flow), create the project without updating config (rejected: the new project might not appear, which is confusing) |
