# Idea — DevDashboard

## Project Name
DevDashboard

## Project Type
Local web application / project workflow dashboard

## Core Idea

DevDashboard is a local web application that sits on top of my AI Build Operating System and gives me a clear visual view of my software projects, their current stage, what has already been done, and what the next required action is.

The purpose of the dashboard is to make the workflow easier to operate in practice. Right now, the build process is structured through markdown files, templates, stage documents, and `STATUS.md`, but it is still manual to navigate. To understand where a project stands, I have to open folders, inspect files, and piece together the current state. DevDashboard should remove that friction by reading the project structure directly and turning it into a simple, usable interface.

The markdown files and project folders remain the source of truth. DevDashboard does not replace the workflow. It visualizes it.

---

## What Problem This Solves

My current build process is strong in structure but weak in immediate usability. The system tells me how projects should move from idea to completion, but it still takes effort to see where I left off.

The current pain points are:

- I need to manually open project folders
- I need to inspect `STATUS.md` and stage files to understand state
- I lose time re-orienting myself when returning to a project
- it is harder to manage multiple projects at once
- the next action is not always visually obvious
- there is no central place showing all active projects and their progress

This dashboard solves that by giving me a visual control panel for all projects.

---

## Main Goal

The goal is to create a simple local app that makes it obvious:

- what projects exist
- what stage each project is currently in
- what has been completed
- what needs to happen next
- who needs to act next
- which artifact is due next
- whether anything is blocked
- how to jump back into work quickly

The dashboard should make it easy for me to resume any project with minimal thinking.

---

## How the Dashboard Should Work

The dashboard should scan a parent folder containing project folders.

Each project folder is expected to follow the conventions of the AI Build Operating System, including files such as:

- `STATUS.md`
- `01-idea.md`
- `02-clarification.md`
- `03-spec.md`
- `04-plan.md`
- `05-tasks.md`
- `06-implementation-log.md`
- `07-review.md`
- `08-report.md`
- `09-handoff.md`
- `decisions.md`

The app should read these files, especially `STATUS.md`, and use them to determine the state of the project.

### Core interpretation logic
The application should:
- identify valid project folders
- read `STATUS.md`
- determine the current stage
- determine stage status
- show what artifact is due next
- show who acts next
- surface blockers and open questions
- detect which artifacts exist and which are missing
- show progress across the workflow

---

## What the UI Should Show

## 1. Project List View

This is the main dashboard screen.

It should show all known projects in a clean summary format.

For each project, display:
- project name
- current stage
- stage status
- next required action
- who acts next
- artifact due next
- blockers
- last updated date
- progress through workflow stages

This page should help me quickly understand which projects need attention and what kind of attention they need.

---

## 2. Project Detail View

When I click into a project, I should see a more complete view of that project.

This should include:
- project name
- project objective or summary
- current stage
- current stage status
- current action required
- who acts next
- required input from human
- blockers
- open questions
- next artifact due
- relevant files
- completed artifacts
- stage history if available

This page should function like a project control panel.

---

## 3. Visual Workflow Map

Each project should show the workflow visually.

The stage flow is:

**Idea → Clarification → Specification → Plan → Tasks → Build → Review → Documentation → Handoff**

The UI should clearly show:
- completed stages
- current active stage
- blocked stage if applicable
- upcoming stages
- possibly whether the workflow needs to move back a stage

This should make the process easy to understand at a glance.

---

## The Role of `STATUS.md`

`STATUS.md` should remain the main control file for each project.

The dashboard should treat it as the primary source for:
- current stage
- stage status
- current action required
- who acts next
- artifact due next
- blockers
- open questions
- relevant files
- last completed step
- next step after current one

This is important because it means the app does not need to guess too much. It can rely on the workflow conventions already established.

The dashboard can also use file existence checks as supporting context, but `STATUS.md` should be the main source of project state.

---

## MVP Scope

The first version should stay simple.

### Version 1 should likely be read-only

The MVP should:
- run locally
- scan one parent projects folder
- identify project folders
- read `STATUS.md`
- detect standard artifact files
- show project list
- show project detail
- show a visual stage tracker
- highlight next required action
- make it easy to open or reference relevant files

This first version does not need to:
- edit project files
- create new projects
- update `STATUS.md`
- generate AI prompts automatically
- manage teams or remote users

The first goal is visibility and clarity.

---

## Future Versions

Once the MVP works well, later versions could add:

- editing `STATUS.md` from the UI
- creating a new project from templates
- generating missing artifact files
- opening files directly in the preferred editor
- prompting an AI agent for the next stage
- detecting stale projects
- surfacing decision logs and lessons learned
- showing alerts for missing artifacts
- offering filtered views such as “projects blocked” or “human action required”

These are useful future features, but they should not distract from the MVP.

---

## Technical Direction

I want this to be a simple website-style local application, and I want to stay consistent with the type of stack I use across other apps.

Because of that, it makes sense to use:

- Node.js
- npm
- a simple web app architecture
- likely React-based frontend
- potentially Next.js if we want a more structured local app

The reason for this is consistency:
- same general stack as other apps
- same package manager
- easier for me to run
- easier for AI agents to work with
- easier to extend later

So the current thinking is that the dashboard should be a small local npm-based web app.

---

## Why This Fits the Existing Process

This project does not invent a new process. It builds on the process already defined in the AI Build Operating System.

That means:
- the AI Build Operating System remains the workflow and file convention layer
- DevDashboard becomes the visual operating layer
- project folders remain on disk
- markdown files remain the truth
- the app simply reads and presents that information better

This is important because it keeps the system coherent and avoids duplication.

---

## Who This Is For

Primary user:
- me, as the operator managing multiple software projects with AI support

Secondary use:
- it should also support AI agents indirectly by preserving a clear project structure and workflow state

The app is mainly for my own productivity, clarity, and continuity.

---

## What Success Looks Like

The project will be successful if I can:

- open one dashboard and see all active projects
- instantly understand where a project stands
- see the next required action clearly
- know whether I need to act or the agent needs to act
- quickly open the relevant project artifact
- spend less time re-orienting myself
- manage multiple projects more effectively
- use my existing AI Build OS much more easily in practice

A successful result would mean that the dashboard becomes the first place I check when deciding what to work on next.

---

## Constraints

Known constraints at this stage:

- must run locally
- should be simple and lightweight
- should use existing project folder conventions
- should rely primarily on `STATUS.md`
- should use an npm-based stack for consistency
- should support multiple projects
- should prioritize clarity over complexity
- should start with a useful MVP rather than trying to solve everything at once

---

## Out of Scope for the First Version

To keep the first version realistic, these should be out of scope:

- cloud hosting
- multi-user login
- team collaboration
- replacing markdown as source of truth
- direct code generation from the dashboard
- advanced analytics
- syncing across machines
- automatic project management beyond visual tracking

---

## Open Questions

These still need to be resolved in clarification:

- Should the app only scan one root directory, or should multiple locations be supported later?
- Should clicking a file open it externally, or should the app preview content internally?
- How should a valid project folder be identified?
- Should the dashboard trust only `STATUS.md`, or also infer stage completion from files present?
- Should project creation be added later in-app, or remain manual?
- Is Next.js the best choice for the MVP, or would a lighter React/Vite app be better?

---

## Simple Summary

DevDashboard is a local visual dashboard that reads the folders and markdown artifacts from my AI Build Operating System and turns them into an easy-to-follow project view, so I can quickly see where each project stands, what the next action is, and how to continue.

## Metadata

| Field | Value |
|---|---|
| **Project** | DevDashboard |
| **Date** | 2026-03-29 |
| **Author** | Andre |
| **Stage** | 1 — Idea Capture |

---

## The Idea

I want to build a small local web application called **DevDashboard** that acts as a visual dashboard for my AI Build Operating System.

The idea is to have one place where I can see all of my projects, understand what stage each project is in, see what has already been completed, and know what the next required action is. Instead of manually opening folders and markdown files to figure out where I left off, I want the application to read the project files and folders and present that information in a visual, easy-to-follow way.

The dashboard should sit on top of the workflow and project artifacts I already use. It should not replace the markdown-based process. Instead, it should use files like `STATUS.md` and the standard stage artifacts to determine the state of a project and help me continue from the correct point.

---

## Motivation

My current AI Build Operating System is useful, but it is still very document-driven. To understand the state of a project, I have to open folders, inspect files, and manually work out where I am in the process.

That creates friction:
- it takes time to re-orient myself
- the next action is not always obvious
- it is harder to manage multiple projects at once
- I can lose momentum when returning to a project after some time away

I want a visual layer that makes the workflow easier to operate in practice and helps me move forward more quickly and confidently.

---

## Who Is This For?

Primarily for me.

I am the main user of this system as the person managing and building multiple projects with the help of AI agents. The dashboard should help me quickly understand where each project stands and what I need to do next.

Secondarily, it should also align well with AI agents by using a predictable project structure and standard project artifacts.

---

## What Does Success Look Like?

This project is successful if I can:

- Open the dashboard and immediately see all active projects
- Understand the current stage of each project at a glance
- See the next required action without reading multiple files
- Tell whether the next step is for me, the AI agent, or both
- Open the most relevant artifact quickly
- Resume work on any project with minimal re-orientation
- Use the dashboard as the main visual operating layer for my build workflow

---

## What Exists Already?

I already have an AI Build Operating System that defines:
- workflow stages
- templates
- project artifacts
- `STATUS.md` as the control file
- standard artifact naming conventions

This project should build on top of that system.

The dashboard should use the existing project folder structure and markdown artifacts rather than introducing a completely new workflow system.

---

## Known Constraints

- Must work locally on my machine
- Should be simple and practical rather than over-engineered
- Should build on the existing AI Build Operating System
- Markdown files remain the source of truth
- The dashboard should read project files and folders from disk
- Version 1 should ideally stay small and focused
- Must support multiple projects over time

---

## Out of Scope

For the first version, this project should not include:

- a full remote/cloud-hosted platform
- team collaboration features
- authentication or user accounts
- replacing the markdown workflow entirely
- a heavy project management system
- advanced analytics or reporting
- automatic AI execution from the dashboard unless very simple

These can be considered later if useful.

---

## Initial Rough Thinking

My initial thought is to build a lightweight local web app that scans a parent projects directory and reads each project’s `STATUS.md` plus the standard artifact files.

The app should likely have:
- a project list view
- a project detail view
- a visual workflow/stage tracker
- clear display of current stage, next action, and blockers
- quick links to relevant files

For version 1, a read-only dashboard is probably the best starting point. Once that works, it could later support editing status, creating projects from templates, or generating next-step prompts.

---

## Open Questions

- Should version 1 be fully read-only?
- Should the app rely mainly on `STATUS.md`, or also detect progress from artifact files?
- What is the best tech stack for the MVP?
- Should clicking a file open it externally or show a preview in the app?
- What is the best way to identify a valid project folder?
- Should the dashboard support creating new projects in the MVP, or only viewing existing ones?

---

<!-- NEXT STEP: Move to Stage 2 — Clarification. Use templates/clarification.md -->