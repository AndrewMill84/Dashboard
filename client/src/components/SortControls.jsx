const SORT_OPTIONS = [
  { value: "name", label: "Name (A\u2013Z)" },
  { value: "updated", label: "Last Updated" },
  { value: "stage", label: "Stage" },
];

export default function SortControls({ sortBy, onSortChange }) {
  return (
    <div className="sort-controls">
      <span className="sort-label">Sort by</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`sort-btn ${sortBy === opt.value ? "sort-btn--active" : ""}`}
          onClick={() => onSortChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
