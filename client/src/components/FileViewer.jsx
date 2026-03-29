import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchFile } from "../api/client";

export default function FileViewer({ projectId, filename, onClose }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFile(projectId, filename);
        if (!cancelled) setContent(data.content);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, filename]);

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
      <div className="file-viewer">
        <div className="file-viewer-header">
          <span className="file-viewer-title">{filename}</span>
          <button className="file-viewer-close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>

        <div className="file-viewer-content">
          {loading && <div className="spinner" />}

          {error && (
            <div className="error-message">
              <strong>Failed to load file:</strong> {error}
            </div>
          )}

          {!loading && !error && content !== null && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
