const STATUS_STYLES = {
  "not-started": { bg: "var(--bg-tertiary)", color: "var(--text-muted)", label: "Not Started" },
  "in-progress": { bg: "var(--accent-subtle)", color: "var(--accent)", label: "In Progress" },
  blocked: { bg: "var(--red-subtle)", color: "var(--red)", label: "Blocked" },
  complete: { bg: "var(--green-subtle)", color: "var(--green)", label: "Complete" },
};

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "-");
  const style = STATUS_STYLES[normalized] || STATUS_STYLES["not-started"];

  return (
    <span
      className="status-badge"
      style={{
        background: style.bg,
        color: style.color,
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}
