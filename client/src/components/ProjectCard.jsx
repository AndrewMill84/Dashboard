import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { STAGES } from "../utils/stages";

function ProgressBar({ stageNumber }) {
  const current = stageNumber || 0;

  return (
    <div className="progress-bar">
      {STAGES.map((stage) => (
        <div
          key={stage.number}
          className={`progress-step ${
            stage.number < current
              ? "progress-step--done"
              : stage.number === current
              ? "progress-step--active"
              : ""
          }`}
          title={stage.name}
        />
      ))}
    </div>
  );
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const missing = project.hasStatus === false;

  const action = project.currentActionRequired || "";
  const truncatedAction =
    action.length > 80 ? action.slice(0, 77) + "\u2026" : action;

  return (
    <article
      className={`project-card ${missing ? "project-card--missing" : ""}`}
      onClick={() => navigate(`/project/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/project/${project.id}`);
      }}
    >
      <div className="card-header">
        <h3 className="card-title">{project.name}</h3>
        {missing ? (
          <span className="card-missing-badge">No STATUS.md</span>
        ) : (
          <StatusBadge status={project.stageStatus} />
        )}
      </div>

      {missing ? (
        <div className="card-missing-body">
          <p className="card-missing-text">
            This project folder does not contain a <code>STATUS.md</code> file.
            Add one to track this project with the AI Build OS workflow.
          </p>
        </div>
      ) : (
        <>
          <div className="card-stage">
            {project.currentStage || "Unknown stage"}
          </div>

          <ProgressBar stageNumber={project.stageNumber} />

          {truncatedAction && (
            <p className="card-action">{truncatedAction}</p>
          )}

          <div className="card-footer">
            <span className="card-who">
              {project.whoActsNext === "agent"
                ? "Agent"
                : project.whoActsNext === "human"
                ? "Human"
                : project.whoActsNext || "\u2014"}
            </span>

            {project.blockers && project.blockers !== "None" && (
              <span className="card-blocker">Blocked</span>
            )}

            {project.lastUpdated && (
              <span className="card-updated">{project.lastUpdated}</span>
            )}
          </div>
        </>
      )}
    </article>
  );
}
