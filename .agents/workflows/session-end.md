---
description: Wrap up an AI build session, ensure all state is saved, and prepare the handoff for the next session.
---
# Session End Workflow

Run this workflow when concluding a working session to ensure a clean state for the next session.

1. **Save Work**: Ensure all code and artifact changes form a complete, working checkpoint and have been properly saved.
2. **Update Status Panel**: Update the project's `STATUS.md` file:
   - Update `Last Completed Step`
   - Update `Current Action Required`
   - Update `Next Step After Current`
   - Update `Last Updated` date
   - Mark any completed artifacts in the `Completed Artifacts` checklist.
3. **Log Memory**: Check if any significant design decisions or new scalable patterns were discovered during this session. If so, append them to `memory/decisions.md` or `memory/patterns.md`.
4. **Draft Handoff**: If this concludes a major step or handoff, create or update the `09-handoff.md` file summarizing what was accomplished, what remains, and known issues.
5. **Summarize**: Provide the user with a final summary of what was saved and readied for the next session.
