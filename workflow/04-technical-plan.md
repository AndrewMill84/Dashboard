# Stage 4 — Technical Plan

## Purpose

Design _how_ to build what the specification defines. The technical plan covers architecture, technology choices, file structure, dependencies, risks, and the implementation approach. It should be detailed enough that an agent or developer can begin work without further design questions.

---

## Required Inputs

- Approved `03-spec.md` (Stage 3)
- Awareness of existing codebase and patterns (check `memory/patterns.md`)
- Awareness of past decisions (check `memory/decisions.md`)

---

## Key Questions to Answer

1. **What is the architecture?** — High-level structure and component design
2. **What technologies will be used?** — Languages, frameworks, libraries, tools
3. **What is the file/folder structure?** — Where will code and assets live?
4. **What are the dependencies?** — External packages, services, APIs
5. **What existing patterns should be reused?** — Check `memory/patterns.md`
6. **What are the technical risks?** — What could go wrong technically?
7. **What's the migration/rollback strategy?** — If this fails, how do we recover?
8. **What needs to be tested?** — Key areas that require validation
9. **What order should things be built?** — Dependencies between components

---

## Output / Artifact

**File**: `04-plan.md`
**Template**: [`templates/implementation-plan.md`](../templates/implementation-plan.md)

**Also update**: `memory/decisions.md` with any significant technical decisions made during planning.

---

## Exit Criteria

- [ ] Architecture is described and makes sense for the requirements
- [ ] Technology choices are stated with rationale
- [ ] File/folder structure is defined
- [ ] Risks are identified with mitigations
- [ ] The plan is detailed enough to break into tasks
- [ ] The plan has been reviewed and approved by the human stakeholder
- [ ] Key decisions are recorded in `memory/decisions.md`
- [ ] STATUS.md is updated to reflect completion of Stage 4

---

## Next Step

**→ [Stage 5: Task Breakdown](05-task-breakdown.md)**

The approved technical plan is decomposed into small, ordered, individually testable tasks.

---

## Feedback Loop

If technical planning reveals gaps in the specification:

**← Back to [Stage 3: Specification](03-specification.md)**

Update `03-spec.md` to address the gap, then return to planning.
