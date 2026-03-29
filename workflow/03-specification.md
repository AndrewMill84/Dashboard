# Stage 3 — Specification

## Purpose

Produce a precise, unambiguous description of what will be built. The specification is the contract between "what we want" and "what we'll build." It defines scope, behavior, constraints, and acceptance criteria clearly enough that an implementer (human or agent) can build the right thing.

---

## Required Inputs

- Completed `01-idea.md` (Stage 1)
- Completed `02-clarification.md` (Stage 2)

---

## Key Questions to Answer

1. **What are the functional requirements?** — What must the system do?
2. **What are the non-functional requirements?** — Performance, security, usability, etc.
3. **What are the user stories / use cases?** — How will people actually use this?
4. **What are the acceptance criteria?** — How will we verify each requirement is met?
5. **What are the boundaries?** — What is explicitly in scope and out of scope?
6. **What are the data requirements?** — What data is needed, where does it come from?
7. **What are the integration points?** — How does this connect to other systems?
8. **What are the constraints?** — Technical, business, or regulatory limitations?

---

## Output / Artifact

**File**: `03-spec.md`
**Template**: [`templates/spec.md`](../templates/spec.md)

---

## Exit Criteria

- [ ] Functional requirements are clearly listed
- [ ] Acceptance criteria are defined for each key requirement
- [ ] Scope boundaries are explicit (in-scope and out-of-scope)
- [ ] The spec is detailed enough for a technical plan to be created from it
- [ ] The spec has been reviewed and approved by the human stakeholder
- [ ] STATUS.md is updated to reflect completion of Stage 3

---

## Next Step

**→ [Stage 4: Technical Plan](04-technical-plan.md)**

The approved specification is used to design the technical approach — architecture, file structure, technology choices, and implementation strategy.

---

## Tips

- **Write for the implementer.** The person (or agent) building this should be able to work from the spec alone.
- **Be precise about behavior.** "The system should handle errors gracefully" is vague. "The system displays an error message and returns to the previous screen" is precise.
- **Don't design the solution.** The spec says *what*, not *how*. Save technical decisions for Stage 4.
- **Include negative requirements.** What should the system explicitly NOT do?
