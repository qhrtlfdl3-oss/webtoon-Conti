import WebtoonPanel from "./WebtoonPanel";
import Balloon from "./Balloon";
import { PAGE_WIDTH, PAGE_HEIGHT } from "../constants";

function CanvasPage({
  activePage,
  pageRefs,
  zoom,
  selected,
  setSelected,
  onMouseMove,
  stopAction,
  startPanelMove,
  startPanelResize,
  startBalloonMove,
  startBalloonResize,
}) {
  if (!activePage) return null;

  return (
    <div
      className="zoom-stage"
      style={{
        width: PAGE_WIDTH * zoom,
        height: PAGE_HEIGHT * zoom,
      }}
    >
      <div
        className="webtoon-page"
        ref={(el) => {
          pageRefs.current[activePage.id] = el;
        }}
        style={{
          transform: `scale(${zoom})`,
        }}
       onPointerMove={onMouseMove}
onPointerUp={stopAction}
onPointerLeave={stopAction}
onPointerDown={() => setSelected(null)}
      >
        <div className="page-size-label">
          {PAGE_WIDTH} × {PAGE_HEIGHT} px
        </div>

        {activePage.panels.map((panel, index) => {
          const isSelected =
            selected?.type === "panel" &&
            selected?.pageId === activePage.id &&
            selected?.itemId === panel.id;

          return (
            <WebtoonPanel
              key={panel.id}
              panel={panel}
              index={index}
              isSelected={isSelected}
              startPanelMove={startPanelMove}
              startPanelResize={startPanelResize}
            />
          );
        })}

        {activePage.balloons.map((balloon) => {
          const isSelected =
            selected?.type === "balloon" &&
            selected?.pageId === activePage.id &&
            selected?.itemId === balloon.id;

          return (
            <Balloon
              key={balloon.id}
              balloon={balloon}
              isSelected={isSelected}
              startBalloonMove={startBalloonMove}
              startBalloonResize={startBalloonResize}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CanvasPage;