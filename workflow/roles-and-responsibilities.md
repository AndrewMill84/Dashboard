# Roles & Responsibilities

A clear definition of who does what in the AI Build OS process. This prevents confusion at every stage about whether the human or the agent should be acting.

---

## Core Principle

> **The human decides _what_ and _why_. The agent decides _how_ and executes.**

The human owns the vision, the scope, and the approval gates.
The agent owns the structured execution, the artifact production, and the validation.

---

## Human Responsibilities

| Responsibility | When | Why |
|---|---|---|
| **Define goals** | Stage 1 — Idea Capture | Only the human knows what they actually want to build |
| **Provide context** | Stage 1–2 | Background knowledge, business rules, constraints, and preferences that aren't in the codebase |
| **Clarify ambiguity** | Stage 2 — Clarification | When the agent asks a question, the human must answer it — not the other way around |
| **Approve scope** | Stage 3 — Specification ⛳ | The spec is a contract — the human must sign off before planning begins |
| **Approve the plan** | Stage 4 — Technical Plan ⛳ | The human must agree with the approach before any code is written |
| **Review outputs** | Stage 6–7 | Implementation and review outputs need human eyes for business correctness |
| **Accept or reject work** | Stage 7 — Review | The human decides whether the deliverable meets expectations |
| **Record strategic decisions** | Any stage | Decisions about direction, priority, and scope are the human's to make |
| **Keep STATUS.md current** | Any stage | If the human changes direction, they must update the control panel |
| **Provide timely input** | When `Required Input From Human` is set | The process stalls when human input is needed but not given |

### What the human should NOT do

- Write implementation code (unless they want to — but the agent is better at it)
- Guess at technical design without checking with the agent
- Skip stages because something "seems simple"
- Approve artifacts without reading them

---

## Agent Responsibilities

| Responsibility | When | Why |
|---|---|---|
| **Transform inputs into structured artifacts** | Stages 2–5, 8–9 | The agent turns raw human input into well-structured, template-compliant documents |
| **Ask clarifying questions** | Stage 2 — Clarification | The agent drives the Q&A to fill gaps; it should not guess when it can ask |
| **Propose plans** | Stage 4 — Technical Plan | The agent designs the technical approach and presents it for approval |
| **Break work into tasks** | Stage 5 — Task Breakdown | The agent creates small, reviewable, ordered tasks from the approved plan |
| **Implement scoped tasks** | Stage 6 — Implementation | The agent executes one task at a time, following the plan |
| **Validate outputs** | Stage 6–7 | The agent runs tests, checks builds, and verifies acceptance criteria |
| **Surface risks and gaps** | Any stage | If the agent spots a problem, it must flag it rather than silently working around it |
| **Update logs and handoffs** | Stage 6, 8, 9 | The agent maintains `06-implementation-log.md`, `08-report.md`, `09-handoff.md` |
| **Update STATUS.md** | Every stage transition | The agent keeps the control panel current as work progresses |
| **Update project memory** | Stage 8 | The agent records decisions, patterns, and failures in `memory/` |
| **Follow templates** | All stages | The agent uses the prescribed templates — it does not invent new artifact formats |
| **Check memory before acting** | Before any design decision | The agent checks `memory/decisions.md` and `memory/patterns.md` before creating new approaches |

### What the agent should NOT do

- Make scope decisions without human approval
- Skip stages or combine multiple stages into one
- Make destructive changes without explicit approval
- Guess when it could ask
- Continue when `Required Input From Human` is set and unanswered

---

## Responsibility by Stage

| Stage | Human | Agent |
|---|---|---|
| **1. Idea Capture** | Write the idea | Help articulate it; ask prompting questions |
| **2. Clarification** | Answer questions | Ask the right questions; compile answers into artifact |
| **3. Specification** | Review and approve ⛳ | Draft the spec from clarified inputs |
| **4. Technical Plan** | Review and approve ⛳ | Design the approach; check memory for patterns |
| **5. Task Breakdown** | Review for reasonableness | Break the plan into ordered, scoped tasks |
| **6. Implementation** | Monitor; one task at a time | Execute tasks; log each session; validate |
| **7. Review** | Accept or reject | Run checks; complete the review checklist |
| **8. Documentation** | Spot-check the report | Write the report; update memory |
| **9. Handoff** | Confirm the handoff is complete | Write the handoff note; update STATUS.md |

---

## The Two Approval Gates

These are the moments where **nothing proceeds until the human says yes**:

| Gate | Artifact | What the human is approving |
|---|---|---|
| ⛳ **Gate 1** | `03-spec.md` | That the right thing is being built |
| ⛳ **Gate 2** | `04-plan.md` | That it's being built the right way |

If the agent reaches one of these gates, it must **stop and wait** for human approval. It should set:
- `Who Acts Next` → `human`
- `Required Input From Human` → `Review and approve [spec/plan]`
- `Stage Status` → `blocked` (awaiting approval)

---

## When Roles Overlap

Some activities are shared:

| Activity | Who |
|---|---|
| **Decisions during implementation** | Agent proposes → human approves (for anything non-trivial) |
| **Spotting bugs or issues** | Either — whoever finds it flags it |
| **Updating STATUS.md** | Both — whoever completes an action updates it |
| **Going back a stage** | Either can trigger it — but the human must approve if it crosses an approval gate |
