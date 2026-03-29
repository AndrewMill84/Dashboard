# Stage 9 — Handoff

## Purpose

Prepare the project for the next person, the next session, the next phase, or clean closure. The handoff ensures no context is lost and that anyone picking up this project next knows exactly where things stand and what to do.

---

## Required Inputs

- Completed `08-report.md` (Stage 8)
- Updated project memory (`memory/decisions.md`, `memory/patterns.md`, `memory/project-index.md`)
- Awareness of any remaining work, known issues, or planned next phases

---

## Key Questions to Answer

1. **Is this project complete?** — Is there more work to do?
2. **What's the final state?** — Where does the deliverable live? How do you use it?
3. **What should the next person know?** — Context they need to be effective
4. **What tasks remain?** — If this is a phase handoff, what's in the next phase?
5. **What risks should they watch for?** — Known issues or fragile areas
6. **Where is the important context?** — Which artifacts should they read first?
7. **How to set up / run the project?** — Practical instructions

---

## Process

1. Create `09-handoff.md` from `templates/session-handoff.md`
2. Provide a clear summary of project state
3. List any remaining work
4. Include setup and run instructions if applicable
5. Point to the most important artifacts for context
6. Update STATUS.md to final state

---

## Output / Artifact

**File**: `09-handoff.md`
**Template**: [`templates/session-handoff.md`](../templates/session-handoff.md)

---

## Exit Criteria

- [ ] `09-handoff.md` is complete with clear context for the next person/session
- [ ] If there's remaining work, it's clearly documented
- [ ] Setup/run instructions are provided if applicable
- [ ] STATUS.md is updated to `complete` or reflects the handoff state
- [ ] All project artifacts are in good order

---

## What Happens Next?

### If the project is complete:
- STATUS.md status = `complete`
- The project entry in `memory/project-index.md` reflects completion
- The handoff serves as the permanent record

### If there's a next phase:
- STATUS.md status = `complete` for this phase
- Create a new project folder for the next phase
- Reference this project's artifacts in the new project's idea capture
- Start the new project at Stage 1

### If work is paused:
- STATUS.md status = `blocked` or `in-progress` with an explanation
- The handoff explains where things stand and how to resume
