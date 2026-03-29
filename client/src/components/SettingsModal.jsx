import { useState, useEffect, useCallback } from "react";
import {
  fetchConfig,
  addScanDirectory,
  removeScanDirectory,
} from "../api/client";

export default function SettingsModal({ onClose, onDirectoriesChanged }) {
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDir, setNewDir] = useState("");
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConfig();
      setDirectories(data.scanDirectories);
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

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = newDir.trim();
    if (!trimmed) return;

    setActionError(null);
    setActionLoading(true);
    try {
      const result = await addScanDirectory(trimmed);
      setDirectories(result.scanDirectories);
      setNewDir("");
      onDirectoriesChanged?.();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemove(dir) {
    if (directories.length <= 1) {
      setActionError("Cannot remove the last scan directory");
      return;
    }

    setActionError(null);
    setActionLoading(true);
    try {
      const result = await removeScanDirectory(dir);
      setDirectories(result.scanDirectories);
      onDirectoriesChanged?.();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="file-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal">
        <div className="file-viewer-header">
          <span className="file-viewer-title">Settings</span>
          <button className="file-viewer-close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>

        <div className="settings-content">
          <h3 className="settings-section-title">Scan Directories</h3>
          <p className="settings-description">
            Add folders to scan for projects. Any subfolder containing a{" "}
            <code>STATUS.md</code> file will appear on the dashboard.
          </p>

          {loading && <div className="spinner" />}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <>
              <ul className="settings-dir-list">
                {directories.map((dir) => (
                  <li key={dir} className="settings-dir-item">
                    <span className="settings-dir-path">{dir}</span>
                    <button
                      className="settings-dir-remove"
                      onClick={() => handleRemove(dir)}
                      disabled={actionLoading || directories.length <= 1}
                      title={
                        directories.length <= 1
                          ? "Cannot remove the last directory"
                          : "Remove directory"
                      }
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              <form className="settings-add-form" onSubmit={handleAdd}>
                <input
                  type="text"
                  className="settings-add-input"
                  placeholder="Enter folder path, e.g. C:/Projects"
                  value={newDir}
                  onChange={(e) => setNewDir(e.target.value)}
                  disabled={actionLoading}
                />
                <button
                  type="submit"
                  className="settings-add-btn"
                  disabled={actionLoading || !newDir.trim()}
                >
                  {actionLoading ? "Adding..." : "Add"}
                </button>
              </form>

              {actionError && (
                <div className="error-message" style={{ marginTop: 12 }}>
                  {actionError}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
