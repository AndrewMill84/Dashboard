import { STAGES } from "../utils/stages";

export default function WorkflowMap({ stageNumber, stageStatus }) {
  const isBlocked = (stageStatus || "").toLowerCase().includes("blocked");

  return (
    <div className="workflow-map">
      {STAGES.map((stage, i) => {
        let cls = "workflow-stage";
        if (stage.number < stageNumber) cls += " workflow-stage--completed";
        else if (stage.number === stageNumber)
          cls += isBlocked
            ? " workflow-stage--blocked"
            : " workflow-stage--active";

        const connectorDone = stage.number < stageNumber;

        return (
          <div key={stage.number} style={{ display: "flex", alignItems: "flex-start", gap: 4, flex: 1 }}>
            <div className={cls}>
              <div className="workflow-dot">{stage.number}</div>
              <span className="workflow-stage-label">{stage.short}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`workflow-connector ${connectorDone ? "workflow-connector--done" : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
