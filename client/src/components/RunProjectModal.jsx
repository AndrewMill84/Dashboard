import { useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatPathForDisplay(fsPath) {
  if (!fsPath) return "";
  return fsPath.replace(/\\/g, "/");
}

export default function RunProjectModal({
  projectName,
  projectPath,
  howToRunMarkdown,
  onClose,
}) {
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="file-overlay" onClick={handleOverlayClick}>
      <div className="run-project-modal">
        <div className="file-viewer-header">
          <span className="file-viewer-title">
            Run — {projectName}
          </span>
          <button
            type="button"
            className="file-viewer-close"
            onClick={onClose}
            title="Close"
          >
            &times;
          </button>
        </div>
        <div className="run-project-content">
          <div className="run-project-field">
            <div className="run-project-label">Location</div>
            <code className="run-project-path">{formatPathForDisplay(projectPath)}</code>
          </div>

          <div className="run-project-field">
            <div className="run-project-label">How to run</div>
            {howToRunMarkdown ? (
              <div className="file-viewer-content run-project-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {howToRunMarkdown}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="run-project-placeholder">
                No <code className="run-project-inline-code">## How to run</code>{" "}
                section in <code className="run-project-inline-code">STATUS.md</code>{" "}
                yet. Add that section with commands and notes (Markdown and fenced
                code blocks). The dashboard will show it here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
