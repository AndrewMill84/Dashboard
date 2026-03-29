import { useState, useMemo } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "./ProjectCard";
import SortControls from "./SortControls";

function sortProjects(projects, sortBy) {
  const sorted = [...projects];
  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "updated":
      return sorted.sort((a, b) => {
        const aDate = a.lastUpdated || "";
        const bDate = b.lastUpdated || "";
        return bDate.localeCompare(aDate);
      });
    case "stage":
      return sorted.sort(
        (a, b) => (a.stageNumber || 0) - (b.stageNumber || 0)
      );
    default:
      return sorted;
  }
}

export default function ProjectList() {
  const { projects, loading, error, refresh } = useProjects();
  const [sortBy, setSortBy] = useState("name");

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

  const tracked = sorted.filter((p) => p.hasStatus !== false);
  const untracked = sorted.filter((p) => p.hasStatus === false);

  return (
    <div>
      <div className="list-header">
        <h2 className="list-title">
          Projects <span className="list-count">{sorted.length}</span>
        </h2>
        <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {tracked.length > 0 && (
        <div className="project-grid">
          {tracked.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {untracked.length > 0 && (
        <>
          <h3 className="section-divider">
            Not yet initialized <span className="list-count">{untracked.length}</span>
          </h3>
          <div className="project-grid">
            {untracked.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
