# Stage 6 — Implementation

## Purpose

Execute the tasks defined in Stage 5, one at a time, following the technical plan. Each session of work is logged so there is a clear record of what was done, what worked, and what changed.

---

## Required Inputs

- Completed `05-tasks.md` (Stage 5) with ordered task list
- Approved `04-plan.md` (Stage 4) as the guiding design
- `03-spec.md` (Stage 3) as the requirements reference

---

## Key Questions to Answer (Per Task)

1. **What am I building in this task?** — Re-read the task definition
2. **What files am I touching?** — Confirm before starting
3. **Does this match the plan?** — Verify alignment with `04-plan.md`
4. **Does this match the spec?** — Verify alignment with `03-spec.md`
5. **Have I introduced any new decisions?** — Record them in `decisions.md`
6. **Does my change work?** — Validate before marking the task complete

---

## Process

For each task:

1. **Read** the task definition in `05-tasks.md`
2. **Update** the task status to `in-progress` in `05-tasks.md`
3. **Implement** the change
4. **Validate** the change (tests, build, manual check)
5. **Log** the session in `06-implementation-log.md`
6. **Update** the task status to `done` in `05-tasks.md`
7. **Record** any decisions made in `memory/decisions.md`
8. **Update** STATUS.md

---

## Output / Artifact

**File**: `06-implementation-log.md`
**Template**: [`templates/implementation-log-entry.md`](../templates/implementation-log-entry.md) (one entry per session)

---

## Exit Criteria

- [ ] All tasks in `05-tasks.md` are marked `done`
- [ ] Each completed task has a corresponding log entry in `06-implementation-log.md`
- [ ] All changes have been validated (tests pass, builds succeed)
- [ ] Any new decisions are recorded in `memory/decisions.md`
- [ ] STATUS.md is updated to reflect completion of Stage 6

---

## Next Step

**→ [Stage 7: Review & Validation](07-review.md)**

With all tasks complete, run a structured review to verify everything works correctly as a whole.

---

## Feedback Loop

If implementation reveals that the technical plan needs updating:

**← Back to [Stage 4: Technical Plan](04-technical-plan.md)**

Update `04-plan.md` to reflect the new understanding, adjust `05-tasks.md` if needed, then continue implementation.

---

## Rules During Implementation

- **One task at a time.** Don't work on multiple tasks simultaneously.
- **Follow the plan.** If you want to deviate, update the plan first.
- **Log everything.** Every session should produce a log entry.
- **Don't skip validation.** Even "trivial" changes need checking.
- **Ask when stuck.** If you're blocked, say so in STATUS.md rather than guessing.
