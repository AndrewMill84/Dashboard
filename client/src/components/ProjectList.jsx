import { useState, useMemo } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "./ProjectCard";
import SortControls from "./SortControls";

function normalizeStageStatus(s) {
  return (s || "").toLowerCase().replace(/\s+/g, "-");
}

function isCompleteProject(p) {
  return normalizeStageStatus(p.stageStatus) === "complete";
}

/** Least advanced first; complete status last when stages tie. */
function workflowCompare(a, b) {
  const stageA = a.stageNumber ?? 0;
  const stageB = b.stageNumber ?? 0;
  if (stageA !== stageB) return stageA - stageB;
  const ca = isCompleteProject(a);
  const cb = isCompleteProject(b);
  if (ca !== cb) return ca ? 1 : -1;
  return a.name.localeCompare(b.name);
}

function sortProjects(projects, sortBy) {
  const sorted = [...projects];
  switch (sortBy) {
    case "workflow":
      return sorted.sort((a, b) => {
        const engagedA = a.statusEngaged === true;
        const engagedB = b.statusEngaged === true;
        if (engagedA !== engagedB) return engagedA ? -1 : 1;
        return workflowCompare(a, b);
      });
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "updated":
      return sorted.sort((a, b) => {
        const aDate = a.lastUpdated || "";
        const bDate = b.lastUpdated || "";
        return bDate.localeCompare(aDate);
      });
    case "stage":
      return sorted.sort((a, b) => {
        const cmp = (a.stageNumber || 0) - (b.stageNumber || 0);
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      });
    default:
      return sorted;
  }
}

export default function ProjectList() {
  const { projects, loading, error, refresh } = useProjects();
  const [sortBy, setSortBy] = useState("workflow");

  const sorted = useMemo(
    () => sortProjects(projects, sortBy),
    [projects, sortBy]
  );

  if (loading) {
    return <div className="spinner" />;
  }

  if (error) {
    return (
      <div className="error-message">
        <strong>Failed to load projects:</strong> {error}
        <button className="retry-btn" onClick={refresh}>
          Retry
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <h2>No projects found</h2>
        <p>
          No directories with a <code>STATUS.md</code> file were found in the
          configured scan directories.
        </p>
      </div>
    );
  }

  const engaged =
    sortBy === "workflow"
      ? sorted.filter((p) => p.statusEngaged === true)
      : [];
  const inactive =
    sortBy === "workflow"
      ? sorted.filter((p) => p.statusEngaged !== true)
      : [];

  return (
    <div>
      <div className="list-header">
        <h2 className="list-title">
          Projects <span className="list-count">{sorted.length}</span>
        </h2>
        <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {sortBy === "workflow" ? (
        <>
          {engaged.length > 0 && (
            <>
              <h3 className="list-subsection-title">
                Active workflow{" "}
                <span className="list-count">{engaged.length}</span>
              </h3>
              <div className="project-grid">
                {engaged.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}

          {inactive.length > 0 && (
            <>
              <h3
                className={
                  engaged.length > 0
                    ? "section-divider"
                    : "list-subsection-title"
                }
              >
                Not started or empty STATUS{" "}
                <span className="list-count">{inactive.length}</span>
              </h3>
              <div className="project-grid">
                {inactive.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="project-grid">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
