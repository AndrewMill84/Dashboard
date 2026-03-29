# AGENTS.md — AI Agent Operating Contract

This file defines how AI coding agents should behave when working within a project that uses the AI Build Operating System.

If you are an AI agent, read this file before doing any work.

---

## First Steps on Every Session

1. **Find and read `STATUS.md`** in the project root — this tells you the current stage, what's needed next, and who acts next
2. **Read the workflow stage file** for the current stage (e.g., `workflow/06-implementation.md`) to understand what's expected
3. **Check `memory/decisions.md`** for any decisions that affect your work
4. **Check `memory/patterns.md`** for existing patterns before creating new approaches
5. **Review existing project artifacts** (spec, plan, tasks) to understand full context
6. **Consult authoritative specs** when a request introduces new capabilities, breaking changes, architecture shifts, or seems ambiguous

---

## Core Behavior Rules

The AI Build OS expects a **"Think → Act → Reflect"** workflow from all agents.

### Artifact-First Workflow

| Rule | Detail |
|---|---|
| **Artifact-Driven Work** | For non-trivial tasks, always create or update a dedicated plan or task file artifact |
| **Visual Artifacts** | If the UI/UX is modified, capture screenshots or visual demonstrations when possible |
| **Lightweight Outputs** | Keep generated artifacts focused, deterministic, and free of unnecessary fluff |
| **Log Storage** | Store complex test or execution logs in dedicated output files rather than dumping them in chat |

### Planning & Communication

| Rule | Detail |
|---|---|
| **Plan before coding** | For any non-trivial task, produce or review an implementation plan before writing code |
| **Ask when ambiguous** | If requirements are unclear, ask clarifying questions rather than guessing |
| **Break work down** | Split large work into small, reviewable tasks — never do everything in one shot |
| **State what you'll do** | Before starting work, summarize what you intend to change and why |

### Code Changes

| Rule | Detail |
|---|---|
| **Identify affected files first** | List files you expect to modify before making changes |
| **No destructive changes without approval** | Never delete files, remove features, or make breaking changes without explicit human approval |
| **Follow existing patterns** | Check how similar things are done in the codebase before inventing new patterns |
| **Small reviewable changes** | Make changes that can be reviewed in isolation — avoid sprawling multi-file edits when possible |

### Validation

| Rule | Detail |
|---|---|
| **Validate your changes** | Run relevant tests, linting, and build checks after making changes |
| **Test what you changed** | If you modified logic, verify the change works as expected |
| **Don't skip validation** | Even for "simple" changes — validate before marking work complete |

### Documentation & Memory

| Rule | Detail |
|---|---|
| **Update docs when behavior changes** | If your change affects how something works, update relevant documentation |
| **Record important decisions** | When you make a design choice, add an entry to `decisions.md` using the template |
| **Record reusable patterns** | When you discover something reusable, add it to `memory/patterns.md` |
| **Leave a completion summary** | After finishing a task, produce a clear summary of what was done |

### Session Management

| Rule | Detail |
|---|---|
| **Update STATUS.md** | Keep the project status tracker current as you work |
| **Create handoff notes** | At the end of a session, create a handoff note so the next session can continue smoothly |
| **Don't lose context** | If you're ending a session before completing a task, document exactly where you stopped and what remains |
| **Maintain continuity** | Use structured logs and handoff notes so future sessions can pick up without rework |

---

## STATUS.md Protocol

`STATUS.md` is the single source of truth for project progress. Follow these rules:

### Reading STATUS.md

- **Always read it first** when entering a project
- **Trust its contents** — it reflects the most recent state
- **Follow its guidance** — if it says "agent creates 04-plan.md", that's your job

### Updating STATUS.md

Update STATUS.md when:
- You complete an artifact (check it off in the completed artifacts list)
- You advance to a new stage (update: Current Stage, Stage Status, Objective, Current Action Required, Who Acts Next, Artifact Due Next, Required Input From Human, Relevant Files, Last Completed Step, Next Step After Current)
- You encounter a blocker (update: Blockers, Stage Status → `blocked`)
- Open questions arise or are resolved (update: Open Questions)
- You finish a session (update all fields to reflect handoff state, set Last Updated)
- Required human input changes (update: Required Input From Human — be specific about what is needed)

### STATUS.md Format — The Control Panel

STATUS.md is structured as a **control panel** with these exact fields:

```markdown
## 🎛️ Control Panel

| Field | Value |
|---|---|
| **Project** | Bookmark CLI |
| **Current Stage** | `6 — Implementation` |
| **Stage Status** | `in-progress` |
| **Objective** | Implement all tasks from the task breakdown |
| **Current Action Required** | Agent implements Task 2: Add search command |
| **Who Acts Next** | `agent` |
| **Artifact Due Next** | `06-implementation-log.md` (append entry) |
| **Required Input From Human** | None — tasks are defined and ready |
| **Relevant Files** | `05-tasks.md`, `04-plan.md`, `src/commands/search.js` |
| **Open Questions** | None |
| **Blockers** | None |
| **Last Completed Step** | Task 1 (Project Setup) completed and logged |
| **Next Step After Current** | Task 3: Display Module |
| **Started** | 2026-03-29 |
| **Last Updated** | 2026-03-29 |

## Completed Artifacts

- [x] 01-idea.md
- [x] 02-clarification.md
- [x] 03-spec.md ⛳ approved
- [x] 04-plan.md ⛳ approved
- [x] 05-tasks.md
- [ ] 06-implementation-log.md
- [ ] 07-review.md
- [ ] 08-report.md
- [ ] 09-handoff.md
```

**Critical fields for agents:**
- **Current Action Required** — This is your immediate instruction
- **Who Acts Next** — If it says `human`, pause and wait for input
- **Required Input From Human** — If this is populated, the human must provide something before you can proceed
- **Relevant Files** — These are the files you should read before acting
- **Blockers** — If populated, you cannot proceed until these are resolved

---

## Template Usage

When creating artifacts, always use the corresponding template from `templates/`:

| Artifact | Template |
|---|---|
| Idea record | `templates/idea-intake.md` |
| Clarification | `templates/clarification.md` |
| Specification | `templates/spec.md` |
| Implementation plan | `templates/implementation-plan.md` |
| Task definition | `templates/task.md` |
| Review checklist | `templates/review-checklist.md` |
| Decision record | `templates/decision-log-entry.md` |
| Implementation log | `templates/implementation-log-entry.md` |
| Post-task report | `templates/post-task-report.md` |
| Session handoff | `templates/session-handoff.md` |
| Pattern / lesson | `templates/patterns-and-lessons.md` |

**Do not invent new artifact formats.** If an existing template doesn't fit, note it so the system can be updated — but use the closest template for now.

---

## Workflow Stage Awareness

Each stage has specific expectations. Know which stage you're in:

| Stage | Agent Role |
|---|---|
| **1. Idea Capture** | Help the human articulate the idea; ask prompting questions |
| **2. Clarification** | Drive structured Q&A to fill gaps; flag ambiguity |
| **3. Specification** | Help produce a precise spec from clarified requirements |
| **4. Technical Plan** | Design the implementation approach; identify risks and dependencies |
| **5. Task Breakdown** | Split the plan into small, ordered, testable tasks |
| **6. Implementation** | Execute tasks one at a time, following the plan; log each session |
| **7. Review** | Run validation checks; complete the review checklist |
| **8. Documentation** | Produce the post-task report; update memory |
| **9. Handoff** | Create handoff notes; update STATUS.md; prepare for the next phase |

---

## When to Go Back a Stage

**Fix problems at the stage where they originated, not where you found them.**

Going back is normal. Building on a weak foundation is not. Follow these rules:

| You're In | Problem | Go Back To | Action |
|---|---|---|---|
| **Planning** | Requirements unclear | **Clarification** | Reopen `02-clarification.md` |
| **Planning** | Spec has a gap | **Specification** | Update `03-spec.md`, request re-approval |
| **Implementation** | Scope changed | **Specification** | Update `03-spec.md` + `04-plan.md`, request re-approval for both |
| **Implementation** | Plan needs a different approach | **Technical Plan** | Update `04-plan.md`, request re-approval |
| **Implementation** | Tasks are wrong or missing | **Task Breakdown** | Update `05-tasks.md` |
| **Review** | Implementation has bugs | **Implementation** | Create fix tasks, implement, return to review |
| **Review** | Spec was wrong | **Specification** | Update `03-spec.md`, cascade through plan and tasks |
| **Any stage** | New constraints appear | **The affected upstream stage** | Update the upstream artifact first |

### Procedure

1. Note why in `STATUS.md` (Open Questions field)
2. Update the upstream artifact at its source
3. Cascade forward — check if downstream artifacts need updating too
4. **Get re-approval** if the changed artifact is at an approval gate (spec or plan)
5. Update `STATUS.md` to reflect the current stage
6. Log the change in `decisions.md`

> ⚠️ **Never patch around a problem at a later stage.** If the spec is wrong, don't hack around it in code — fix the spec, update the plan, then implement correctly.

For full details, see [`workflow/00-overview.md`](../workflow/00-overview.md).

---

## Project-Specific Environment (Customize Per Project)

To ensure agents can act autonomously, every project using this OS must define its specific environment constraints here (or in a centrally referenced `CONTEXT.md`).

### Build / Lint / Test Commands
- **Setup/Install**: `[e.g., npm install | pip install -r requirements.txt]`
- **Run Dev Server**: `[e.g., npm run dev | python main.py]`
- **Run Tests**: `[e.g., npm test | pytest]`
- **Lint/Format**: `[e.g., npm run lint]`

### Architecture & Code Style Rules
- **Formatting**: `[e.g., Prettier with 2 spaces | PEP-8]`
- **Code Standards**: `[e.g., Strict TypeScript required, Type hints required]`
- **Documentation**: `[e.g., JSDoc for all public functions | Google-style docstrings]`
- **Architecture Pattern**: `[e.g., Component-based architecture, RESTful endpoints]`

---

## Interaction With Other Agents

If multiple agents may work on the same project:

- **Always read before writing** — check what already exists before creating something new
- **Don't overwrite** another agent's work without understanding it first
- **Use the implementation log** to record what you did so other agents know
- **Handoff notes are critical** — they're how agents communicate across sessions

---

## Error Recovery

If you encounter a situation where:

- **STATUS.md is missing**: Ask the human to create one, or create one based on what artifacts already exist
- **Artifacts are out of order**: Note the gap but continue from where the project actually is
- **The plan doesn't match reality**: Flag the discrepancy, propose an update, and wait for approval before changing the plan
- **You're unsure what to do**: Ask the human rather than guessing — guessing wastes everyone's time

---

## Summary

1. Read STATUS.md first
2. Plan before coding
3. Follow the workflow stage you're in
4. Use templates for all artifacts
5. Validate your changes
6. Update memory with decisions and patterns
7. Leave clear handoff notes
8. Keep STATUS.md current
