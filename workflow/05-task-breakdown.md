# Stage 5 — Task Breakdown

## Purpose

Decompose the technical plan into small, ordered, individually testable tasks. Each task should be completable in a single focused session and reviewable in isolation. The task list becomes the work queue for implementation.

---

## Required Inputs

- Approved `04-plan.md` (Stage 4)

---

## Key Questions to Answer

1. **What are the atomic units of work?** — What's the smallest meaningful task?
2. **What's the dependency order?** — Which tasks must complete before others can start?
3. **What can be parallelized?** — Which tasks are independent of each other?
4. **How will each task be verified?** — What test or check confirms it's done correctly?
5. **What's the estimated effort?** — Rough sense of size (small / medium / large)
6. **What files will each task touch?** — Identify affected files upfront

---

## Process

1. Read the technical plan (`04-plan.md`)
2. Identify the major components or phases
3. Break each component into individual tasks
4. Order tasks by dependency
5. For each task, define: description, files affected, acceptance criteria, and size estimate
6. Compile into `05-tasks.md`

---

## Output / Artifact

**File**: `05-tasks.md`
**Template**: [`templates/task.md`](../templates/task.md) (used for each individual task within the file)

---

## Task Format

Each task in `05-tasks.md` should follow this structure:

```markdown
### Task [N]: [Short title]

- **Description**: What this task accomplishes
- **Files affected**: List of files to create or modify
- **Depends on**: Which tasks must be complete first (if any)
- **Acceptance criteria**: How to verify this task is done
- **Size**: Small / Medium / Large
- **Status**: `pending` / `in-progress` / `done` / `blocked`
```

---

## Exit Criteria

- [ ] All work from the technical plan is captured as tasks
- [ ] Tasks are small enough to complete in a single session
- [ ] Task dependencies are identified and ordering is clear
- [ ] Each task has acceptance criteria
- [ ] Each task identifies affected files
- [ ] STATUS.md is updated to reflect completion of Stage 5

---

## Next Step

**→ [Stage 6: Implementation](06-implementation.md)**

Begin executing tasks in order, logging each session in the implementation log.

---

## Tips

- **Err on the side of smaller tasks.** A task that says "Implement the entire backend" is too big.
- **Front-load foundational tasks.** Set up project structure, config, and dependencies first.
- **Include non-code tasks.** Writing tests, updating docs, and running validation are valid tasks.
- **Mark tasks that need human input.** If a task requires a human decision, call it out.
