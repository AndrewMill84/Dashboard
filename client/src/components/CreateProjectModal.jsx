import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConfig, createProject } from "../api/client";

export default function CreateProjectModal({ onClose, onProjectCreated }) {
  const navigate = useNavigate();
  const [directories, setDirectories] = useState([]);
  const [bootstrapSourcePath, setBootstrapSourcePath] = useState("");
  const [location, setLocation] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchConfig();
      setDirectories(data.scanDirectories || []);
      setBootstrapSourcePath(data.bootstrapSourcePath || "");
      setLocation((current) => current || data.scanDirectories?.[0] || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
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

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedLocation = location.trim();
    const trimmedFolderName = folderName.trim();

    if (!trimmedLocation || !trimmedFolderName) {
      return;
    }

    setActionError(null);
    setActionLoading(true);

    try {
      const result = await createProject(trimmedLocation, trimmedFolderName);
      onProjectCreated?.();
      onClose();
      navigate(`/project/${result.project.id}`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  const createDisabled =
    actionLoading ||
    !location.trim() ||
    !folderName.trim() ||
    !bootstrapSourcePath;

  return (
    <div className="file-overlay" onClick={handleOverlayClick}>
      <div className="create-project-modal">
        <div className="file-viewer-header">
          <span className="file-viewer-title">Create Project</span>
          <button className="file-viewer-close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>

        <div className="create-project-content">
          <p className="create-project-description">
            Create a new folder, copy the AI Build OS starter scaffold into it,
            and jump straight into Stage 1.
          </p>
          <p className="create-project-note">
            If this location is not already being scanned, DevDashboard will add
            it automatically so the new project appears right away.
          </p>

          {loading && <div className="spinner" />}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <>
              {!bootstrapSourcePath && (
                <div className="error-message">
                  <code>bootstrapSourcePath</code> is not configured in{" "}
                  <code>config.json</code>.
                </div>
              )}

              <div className="create-project-source">
                <span className="create-project-source-label">
                  Starter source
                </span>
                <code>{bootstrapSourcePath || "Not configured"}</code>
              </div>

              <form className="create-project-form" onSubmit={handleSubmit}>
                <div className="create-project-field">
                  <label
                    className="create-project-label"
                    htmlFor="project-location"
                  >
                    Location
                  </label>
                  <input
                    id="project-location"
                    className="create-project-input"
                    list="scan-directory-options"
                    placeholder="Enter a parent folder path"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    disabled={actionLoading}
                  />
                  <datalist id="scan-directory-options">
                    {directories.map((directory) => (
                      <option key={directory} value={directory} />
                    ))}
                  </datalist>
                </div>

                <div className="create-project-field">
                  <label
                    className="create-project-label"
                    htmlFor="project-folder-name"
                  >
                    Folder name
                  </label>
                  <input
                    id="project-folder-name"
                    className="create-project-input"
                    placeholder="e.g. Sales Dashboard"
                    value={folderName}
                    onChange={(event) => setFolderName(event.target.value)}
                    disabled={actionLoading}
                  />
                </div>

                {actionError && <div className="error-message">{actionError}</div>}

                <div className="create-project-actions">
                  <button
                    type="button"
                    className="create-project-cancel"
                    onClick={onClose}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="create-project-submit"
                    disabled={createDisabled}
                  >
                    {actionLoading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
