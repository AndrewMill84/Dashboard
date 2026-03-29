export const STAGES = [
  { number: 1, name: "Idea Capture", short: "Idea" },
  { number: 2, name: "Clarification", short: "Clarify" },
  { number: 3, name: "Specification", short: "Spec" },
  { number: 4, name: "Technical Plan", short: "Plan" },
  { number: 5, name: "Task Breakdown", short: "Tasks" },
  { number: 6, name: "Implementation", short: "Build" },
  { number: 7, name: "Review", short: "Review" },
  { number: 8, name: "Documentation", short: "Docs" },
  { number: 9, name: "Handoff", short: "Handoff" },
];

export function getStageByNumber(num) {
  return STAGES.find((s) => s.number === num) || null;
}
