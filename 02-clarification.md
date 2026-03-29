# Clarification — DevDashboard

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Stage** | 2 — Clarification |
| **Status** | Complete |

---

## Purpose

This document captures clarification questions and answers that refine the idea from `01-idea.md` before writing the formal specification.

---

## Resolved Questions

### Q1: Should the app scan one root directory, or support multiple scan locations?

**Answer:** Multiple scan locations. The user manages projects across different directories and wants to configure more than one parent folder to scan.

### Q2: Should clicking a file open it externally, or should the app view it internally?

**Answer:** View files within the app. The user should be able to read project artifacts (markdown files, STATUS.md, etc.) directly in the dashboard without navigating to external folders or editors.

### Q3: Should the dashboard rely only on `STATUS.md`, or also infer stage completion from file presence?

**Answer:** Rely on `STATUS.md` as the primary source of truth. File existence can serve as supporting context (e.g. showing which artifacts exist), but the stage, status, and next action should come from `STATUS.md`.

### Q4: What tech stack should the MVP use?

**Answer:** Node.js and React. This is consistent with the user's other projects and gives a straightforward local web app foundation.

### Q5: Should the MVP support creating new projects, or only viewing existing ones?

**Answer:** Viewing only. The MVP is read-only — it reads and displays project state. Project creation, editing, and STATUS.md updates are out of scope for v1.

### Q6: Can the user view multiple projects simultaneously, or one at a time?

**Answer:** One project at a time. The project list shows all discovered projects, but the detail view focuses on a single project.

---

## Remaining Questions — Resolved with Defaults

The human skipped detailed selection. Agent chose reasonable defaults aligned with the MVP philosophy. These can be revised during spec approval.

### Q7: How should multiple scan locations be configured?

**Answer (default):** Config file (`config.json`) in the app directory listing folder paths. Simplest approach for MVP — no settings UI needed yet.

### Q8: What makes a folder a "valid project"?

**Answer (default):** The folder must contain a `STATUS.md` file. This is the simplest and most reliable check, consistent with STATUS.md being the source of truth.

### Q9: Should the in-app file viewer render markdown as formatted HTML, or show raw markdown text?

**Answer (default):** Rendered markdown (formatted headings, lists, tables). This aligns with the goal of viewing project info without needing an external editor.

### Q10: Should the project list have any filtering or sorting?

**Answer (default):** Basic sorting only (by name, last updated, stage). Keeps the MVP simple while still being practical with multiple projects.

### Q11: How should the app handle a project whose `STATUS.md` is missing or malformed?

**Answer (default):** Show the project with a warning/error state. Better to surface the problem than hide it silently.

### Q12: Are there any design or visual preferences?

**Answer (default):** Clean and functional, dark mode. Consistent with developer tooling conventions. Can add light mode toggle later.

---

## Summary of Decisions So Far

| Decision | Choice | Source |
|---|---|---|
| Scan locations | Multiple directories supported | Human |
| Project viewing | One project at a time | Human |
| File access | View files within the app | Human |
| Source of truth | `STATUS.md` primarily | Human |
| Tech stack | Node.js + React | Human |
| MVP scope | Read-only / viewing only | Human |
| Project creation | Not in MVP | Human |
| Scan config | Config file (`config.json`) | Default |
| Valid project detection | Folder contains `STATUS.md` | Default |
| Markdown rendering | Rendered (formatted HTML) | Default |
| Sorting/filtering | Basic sorting (name, updated, stage) | Default |
| Missing STATUS.md | Show with warning state | Default |
| Visual style | Clean, functional, dark mode | Default |

---

<!-- NEXT STEP: Resolve remaining questions (Q7–Q12), then move to Stage 3 — Specification -->
