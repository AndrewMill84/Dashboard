---
description: Start a new AI build session and orient the agent to the current project state.
---
# Session Start Workflow

Run this workflow at the start of any new working session.

1. **Locate the Project**: Find the `STATUS.md` file for the active project you are working on (usually under `projects/[your-project]/STATUS.md`).
2. **Read the Rules**: Review `AGENTS.md` and any project-specific `CONTEXT.md` to refresh your operating environment.
3. **Read the Status**: Read the `STATUS.md` file completely to understand the project state.
4. **Summarize for the User**: Output a summary containing:
   - **Project:** 
   - **Current Stage:**
   - **Last Completed Step:**
   - **Current Action Required:**
   - **Artifacts Expected Next:** 
5. **Proceed**: Ask the user if they are ready to proceed with the Current Action, or perform it immediately if obvious.
