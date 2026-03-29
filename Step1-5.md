````markdown
# New Project Start — Quick Diagram

```mermaid
flowchart LR
    A[1. Create Project Folder] --> B[2. Copy STATUS.md]
    B --> C[3. Create 01-idea.md]
    C --> D[4. Define Next Action in STATUS.md]
    D --> E[5. Move Through Workflow Stages]
````

## Quick summary

The startup flow is:

**Create project folder → add `STATUS.md` → create `01-idea.md` → define the current next action → follow the stages and keep `STATUS.md` updated.**

Your guide is built around `STATUS.md` being the file that always tells you or the agent what happens next.

## The first 5 things to do

### 1. Create the new project folder

Start by creating a dedicated folder for the project under your projects area.

What to do:

* choose a clear project name
* create the folder
* treat this as the project’s working home for all artifacts

Example:

```powershell
mkdir projects/my-project
```

Why this matters:

* it gives the project a clean boundary
* it keeps the operating system separate from project execution
* it makes the project easy for an agent to scan and resume later

---

### 2. Copy in `STATUS.md`

Next, copy the starter `STATUS.md` into the new project folder.

What to do:

* copy the template from `project-starter/STATUS.md`
* place it in the project root
* immediately fill in the basic project status fields

At minimum, set:

* project name
* current stage
* stage status
* current action required
* who acts next
* artifact due next

Example:

```powershell
Copy-Item project-starter/STATUS.md projects/my-project/STATUS.md
```

Why this matters:

* this is your control panel
* when you come back later, this file tells you where you are
* agents can read it first and continue without guesswork

---

### 3. Create `01-idea.md` from the idea template

Stage 1 is to copy `templates/idea-intake.md` into the project folder as `01-idea.md` and fill it in.

What to do:

* copy the idea template
* rename it to `01-idea.md`
* write down the first clear version of the idea

Include:

* what you want to build
* who it is for
* the problem it solves
* why it matters
* what success looks like
* any early constraints or preferences

Why this matters:

* it stops you from starting vaguely
* it gives the AI something concrete to work from
* it becomes the base for clarification and specification

---

### 4. Define the immediate next action in `STATUS.md`

Once the idea file exists, update `STATUS.md` so it clearly states what must happen next.

What to do:

* set the current stage to **Idea Capture** if you are still drafting the idea, or **Clarification** if the idea is already captured
* write one plain-English next action
* identify who acts next: you, the agent, or both
* specify the next artifact due

Examples of good “current action required” entries:

* “Complete the initial idea statement and success criteria in `01-idea.md`.”
* “Review `01-idea.md` and answer clarification questions to prepare `02-clarification.md`.”
* “Ask the agent to generate a clarification checklist from the idea file.”

Why this matters:

* it turns the project from a folder with files into an active workflow
* it makes resuming work much easier
* it gives an agent a clear handoff point

---

### 5. Move through the stages and keep `STATUS.md` current

After setup, move through the workflow one stage at a time and update `STATUS.md` as you go.

The core stage flow is:

1. Idea Capture
2. Clarification
3. Specification
4. Technical Plan
5. Task Breakdown
6. Implementation
7. Review & Validation
8. Documentation
9. Handoff

What to do:

* open the relevant stage definition
* create the next artifact using the matching template
* complete one stage at a time
* update `STATUS.md` every time the project moves forward

Why this matters:

* it keeps the build structured
* it avoids jumping ahead too early
* it makes project continuity much stronger

## Ultra-short version

The first 5 things are:

1. Create the project folder
2. Copy in `STATUS.md`
3. Create `01-idea.md` from the template
4. Fill in the current stage and next action in `STATUS.md`
5. Follow the workflow stage-by-stage and update `STATUS.md` as you go

```
```
