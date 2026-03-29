# Stage 7 — Review & Validation

## Purpose

Verify that the completed implementation meets the specification, follows the plan, and works correctly. This is a structured quality check — not just "does it run?" but "does it do the right thing?"

---

## Required Inputs

- Completed `06-implementation-log.md` (Stage 6)
- `03-spec.md` (Stage 3) for requirements verification
- `04-plan.md` (Stage 4) for design verification
- `05-tasks.md` (Stage 5) to confirm all tasks are done

---

## Key Questions to Answer

1. **Does the implementation match the spec?** — Walk through each requirement
2. **Does the implementation match the plan?** — Were there deviations?
3. **Are all tasks complete?** — Check `05-tasks.md` for any remaining items
4. **Do all tests pass?** — Run the full test suite
5. **Does the build succeed?** — Clean build from scratch
6. **Are there any regressions?** — Has existing functionality been broken?
7. **Is the code clean?** — Linting, formatting, obvious issues
8. **Are edge cases handled?** — Check the edge cases from clarification
9. **Is documentation up to date?** — Code comments, README, API docs

---

## Process

1. Copy `templates/review-checklist.md` to your project as `07-review.md`
2. Work through each check systematically
3. For any failures, create a fix task and return to Stage 6
4. Once all checks pass, complete the review artifact

---

## Output / Artifact

**File**: `07-review.md`
**Template**: [`templates/review-checklist.md`](../templates/review-checklist.md)

---

## Exit Criteria

- [ ] All requirements from `03-spec.md` are verified
- [ ] All tasks from `05-tasks.md` are complete
- [ ] Tests pass
- [ ] Build succeeds
- [ ] No regressions detected
- [ ] Code quality checks pass
- [ ] Review checklist is complete with all items passing
- [ ] STATUS.md is updated to reflect completion of Stage 7

---

## Next Step

**→ [Stage 8: Documentation](08-documentation.md)**

With a verified implementation, document what was built, what was learned, and what patterns emerged.

---

## Feedback Loop

If the review finds issues:

**← Back to [Stage 6: Implementation](06-implementation.md)**

Create fix tasks in `05-tasks.md`, implement them, log them, and return to review.
