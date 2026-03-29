import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProjectDetail from "../hooks/useProjectDetail";
import StatusBadge from "./StatusBadge";
import WorkflowMap from "./WorkflowMap";
import ArtifactChecklist from "./ArtifactChecklist";
import StageHistory from "./StageHistory";
import FileViewer from "./FileViewer";

function Field({ label, value }) {
  if (!value || value === "None") return null;
  return (
    <div className="detail-field">
      <div className="detail-field-label">{label}</div>
      <div className="detail-field-value">{value}</div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error } = useProjectDetail(id);
  const [viewingFile, setViewingFile] = useState(null);

  if (loading) return <div className="spinner" />;

  if (error) {
    return (
      <div>
        <button className="detail-back" onClick={() => navigate("/")}>
          &larr; Back to projects
        </button>
        <div className="error-message">
          <strong>Failed to load project:</strong> {error}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      <button className="detail-back" onClick={() => navigate("/")}>
        &larr; Back to projects
      </button>

      <div className="detail-header">
        <h2>{project.name}</h2>
        <StatusBadge status={project.stageStatus} />
      </div>

      {project.parseError && (
        <div className="parse-warning">
          <strong>Parse warning:</strong> {project.parseError}
        </div>
      )}

      {/* Workflow Map */}
      <div className="detail-section">
        <h3>Workflow Progress</h3>
        <WorkflowMap
          stageNumber={project.stageNumber}
          stageStatus={project.stageStatus}
        />
      </div>

      {/* Control Panel Fields */}
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Status</h3>
          <Field label="Current Stage" value={project.currentStage} />
          <Field label="Objective" value={project.objective} />
          <Field label="Current Action" value={project.currentActionRequired} />
          <Field label="Who Acts Next" value={project.whoActsNext} />
          <Field label="Artifact Due Next" value={project.artifactDueNext} />
        </div>

        <div className="detail-card">
          <h3>Details</h3>
          <Field label="Required Input From Human" value={project.requiredInputFromHuman} />
          <Field label="Relevant Files" value={project.relevantFiles} />
          <Field label="Blockers" value={project.blockers} />
          <Field label="Open Questions" value={project.openQuestions} />
          <Field label="Last Completed Step" value={project.lastCompletedStep} />
          <Field label="Next Step" value={project.nextStepAfterCurrent} />
          <Field label="Started" value={project.started} />
          <Field label="Last Updated" value={project.lastUpdated} />
        </div>
      </div>

      {/* Artifact Checklist */}
      <div className="detail-section">
        <h3>Artifacts</h3>
        <ArtifactChecklist
          completedArtifacts={project.completedArtifacts || []}
          artifactFiles={project.artifactFiles || {}}
          onFileClick={(filename) => setViewingFile(filename)}
        />
      </div>

      {/* Stage History */}
      <div className="detail-section">
        <h3>Stage History</h3>
        <StageHistory history={project.stageHistory || []} />
      </div>

      {/* File Viewer Overlay */}
      {viewingFile && (
        <FileViewer
          projectId={id}
          filename={viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
}
