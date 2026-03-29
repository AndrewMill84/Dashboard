# Stage 2 — Clarification

## Purpose

Systematically fill knowledge gaps, resolve ambiguity, and ensure the idea is well enough understood to write a specification. This stage turns a rough idea into a clear, answerable set of requirements.

---

## Required Inputs

- Completed `01-idea.md` from Stage 1

---

## Key Questions to Answer

1. **What's unclear?** — What parts of the idea need more detail?
2. **What assumptions are being made?** — Make them explicit
3. **What edge cases exist?** — What happens in unusual situations?
4. **What are the dependencies?** — What else does this rely on?
5. **What's the MVP?** — What's the smallest version worth building?
6. **What could go wrong?** — What are the risks and failure modes?
7. **What's the priority?** — If you can't build everything, what matters most?
8. **What terminology needs defining?** — Are there ambiguous terms?

---

## Process

### For Human-Driven Clarification
1. Read `01-idea.md`
2. Copy `templates/clarification.md` to your project as `02-clarification.md`
3. Answer each question honestly — mark any you can't answer yet
4. Update STATUS.md

### For Agent-Driven Clarification
1. Agent reads `01-idea.md`
2. Agent generates a list of clarifying questions using the template
3. Human answers the questions
4. Agent compiles answers into `02-clarification.md`
5. Agent updates STATUS.md

---

## Output / Artifact

**File**: `02-clarification.md`
**Template**: [`templates/clarification.md`](../templates/clarification.md)

---

## Exit Criteria

- [ ] All key questions are answered or explicitly marked as "unknown — acceptable risk"
- [ ] Assumptions are documented
- [ ] The MVP scope is defined
- [ ] Dependencies are listed
- [ ] There is enough clarity to write a specification
- [ ] STATUS.md is updated to reflect completion of Stage 2

---

## Next Step

**→ [Stage 3: Specification](03-specification.md)**

With gaps filled, a precise product or feature specification can now be written.

---

## Feedback Loop

If clarification reveals that the original idea is fundamentally unclear or needs rethinking:

**← Back to [Stage 1: Idea Capture](01-idea-capture.md)**

Update `01-idea.md` with the refined understanding, then return to clarification.
