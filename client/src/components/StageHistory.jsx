export default function StageHistory({ history }) {
  if (!history || history.length === 0) {
    return <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No stage history recorded.</p>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Stage</th>
          <th>Who</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {history.map((row, i) => (
          <tr key={i}>
            <td style={{ whiteSpace: "nowrap" }}>{row.date}</td>
            <td>{row.stage}</td>
            <td>{row.who}</td>
            <td>{row.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
