function WebtoonPanel({
  panel,
  index,
  isSelected,
  startPanelMove,
  startPanelResize,
}) {
  return (
    <div
      className={`webtoon-panel ${isSelected ? "selected" : ""}`}
      style={{
        left: panel.x,
        top: panel.y,
        width: panel.width,
        height: panel.height,
      }}
      onPointerDown={(e) => startPanelMove(e, panel)}
    >
      <div className="panel-number">{index + 1}</div>

      {isSelected && (
        <>
          <div
            className="panel-corner top-left"
            onPointerDown={(e) => startPanelResize(e, panel, "top-left")}
          />
          <div
            className="panel-corner top-right"
            onPointerDown={(e) => startPanelResize(e, panel, "top-right")}
          />
          <div
            className="panel-corner bottom-left"
            onPointerDown={(e) => startPanelResize(e, panel, "bottom-left")}
          />
          <div
            className="panel-corner bottom-right"
            onPointerDown={(e) => startPanelResize(e, panel, "bottom-right")}
          />
        </>
      )}
    </div>
  );
}

export default WebtoonPanel;