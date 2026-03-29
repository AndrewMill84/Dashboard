export default function ArtifactChecklist({
  completedArtifacts,
  artifactFiles,
  onFileClick,
}) {
  return (
    <ul className="artifact-list">
      {completedArtifacts.map((artifact) => {
        const exists = artifactFiles?.[artifact.name] ?? false;
        const clickable = exists && onFileClick;

        return (
          <li key={artifact.name} className="artifact-item">
            <div
              className={`artifact-check ${
                artifact.completed
                  ? "artifact-check--done"
                  : "artifact-check--pending"
              }`}
            >
              {artifact.completed ? "\u2713" : "\u00B7"}
            </div>

            <span
              className={`artifact-name ${
                clickable ? "artifact-name--clickable" : ""
              }`}
              onClick={clickable ? () => onFileClick(artifact.name) : undefined}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter") onFileClick(artifact.name);
                    }
                  : undefined
              }
            >
              {artifact.name}
            </span>

            <span className="artifact-label">{artifact.label}</span>

            <span
              className={`artifact-exists ${
                exists ? "artifact-exists--yes" : "artifact-exists--no"
              }`}
              title={exists ? "File exists on disk" : "File not found"}
            />
          </li>
        );
      })}
    </ul>
  );
}
