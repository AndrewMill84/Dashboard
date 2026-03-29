# Definition of Done

Concrete completion criteria for different levels of work in the AI Build OS. Use these checklists to verify work is genuinely complete before moving forward.

---

## Stage Completion

A stage is complete when **all** of the following are true:

| Criterion | Detail |
|---|---|
| **Output artifact exists** | The artifact for this stage has been created using the correct template |
| **Exit criteria met** | The stage-specific exit criteria (defined in its workflow file) are satisfied |
| **Approval gate passed** | If this is Stage 3 or Stage 4, the human has explicitly approved the artifact |
| **STATUS.md updated** | Current Stage, Stage Status, Who Acts Next, and all relevant fields reflect the transition |
| **Artifact checked off** | The artifact is marked `[x]` in the Completed Artifacts list |
| **Stage History logged** | A row has been added to the Stage History table in STATUS.md |

### Stage-Specific Exit Criteria

| Stage | Done When |
|---|---|
| **1. Idea Capture** | The idea is understandable by someone with no prior context; motivation and constraints are stated |
| **2. Clarification** | All key questions are answered or marked as accepted risks; MVP scope is defined |
| **3. Specification** | Each requirement has acceptance criteria; the human has **explicitly approved** the spec ⛳ |
| **4. Technical Plan** | Architecture, risks, and implementation order are documented; the human has **explicitly approved** the plan ⛳ |
| **5. Task Breakdown** | All work from the plan is captured as tasks; each task is small enough to complete in a single session |
| **6. Implementation** | All tasks in `05-tasks.md` are marked `done`; each task has a log entry; all changes are validated |
| **7. Review** | All requirements verified against the spec; all technical checks pass; review result is **PASS** |
| **8. Documentation** | Report written; `memory/decisions.md`, `memory/patterns.md`, and `memory/project-index.md` are updated |
| **9. Handoff** | The next action is obvious to anyone reading the handoff; STATUS.md reflects the final state |

---

## Task Completion

A single task (from `05-tasks.md`) is complete when **all** of these are true:

- [ ] The task description has been fully implemented
- [ ] All files listed in "Files Affected" have been created/modified as specified
- [ ] All acceptance criteria are met (checked off in the task definition)
- [ ] Changes have been validated (tests pass, build succeeds, manual verification done)
- [ ] A log entry has been appended to `06-implementation-log.md`
- [ ] The task status has been updated to `done` in `05-tasks.md`
- [ ] Any decisions made during the task have been recorded in `decisions.md`
- [ ] STATUS.md has been updated (Current Action, Last Completed Step, Next Step)

### A task is NOT done if:

- It "mostly works" but has known edge cases not handled
- Tests were skipped because the change was "simple"
- The acceptance criteria were loosened rather than met
- It was declared done without actually running validation

---

## Feature / Project Completion

The overall project deliverable is complete when **all** of these are true:

- [ ] All stages 1–7 have been completed with artifacts
- [ ] The review (Stage 7) result is **PASS**
- [ ] All requirements from `03-spec.md` are verified as met (or explicitly descoped with rationale)
- [ ] The post-task report (`08-report.md`) has been written
- [ ] Memory files have been updated:
  - [ ] `memory/decisions.md` — all project decisions logged
  - [ ] `memory/patterns.md` — reusable patterns and failure patterns recorded
  - [ ] `memory/project-index.md` — project entry added or updated
- [ ] Known limitations and follow-up items are documented
- [ ] The deliverable runs correctly from a clean state (someone else could get it working)

---

## Session Handoff Completion

A session handoff is complete when the **next session can start without asking what happened**:

- [ ] `09-handoff.md` (or a mid-project handoff note) has been created
- [ ] Current state is described in one clear paragraph
- [ ] What was accomplished is listed
- [ ] What remains is listed with priorities
- [ ] Known issues and blockers are documented
- [ ] Key files to read first are identified
- [ ] Setup/run instructions are included (if applicable)
- [ ] Recommended next steps are listed in priority order
- [ ] STATUS.md is fully up to date with all fields reflecting the current state

### The handoff test

> Could a different agent (or future-you with zero memory) pick this up from the repo alone and know exactly what to do next?

If yes, the handoff is done. If no, add what's missing.

---

## Quick Self-Check

Before marking any level of work as "done," ask:

| Question | If No... |
|---|---|
| Would someone else agree this is complete? | It's not done yet |
| Did I validate the output, not just write it? | It's not done yet |
| Is STATUS.md current? | Update it before declaring done |
| Could the next session continue without asking me anything? | Add what's missing to the handoff |

---

> **Related files:**
> - [Workflow Overview](00-overview.md) — stage definitions and flow
> - [Roles & Responsibilities](roles-and-responsibilities.md) — who does what at each stage
> - [AGENTS.md](../AGENTS.md) — agent operating contract
> - [QUICKREF.md](../QUICKREF.md) — operator quick reference
