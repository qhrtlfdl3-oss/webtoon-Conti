import { useState } from "react";

function Navigator({
  activePage,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  zoom,
  setZoom,
  navigatorTop,
  navigatorHeight,
  scrollNavigator,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const safeTop = Math.max(0, Math.min(100, navigatorTop));
  const safeHeight = Math.max(3, Math.min(100 - safeTop, navigatorHeight));

  return (
    <div className="navigator-box small">
      <button
        className="navigator-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "네비게이터 접기" : "네비게이터 펼치기"}
      >
        {isOpen ? "▴ 네비게이터" : "▾ 네비게이터"}
      </button>

      {isOpen && (
        <>
          <div className="navigator-preview small" onClick={scrollNavigator}>
            {activePage?.panels.map((panel) => (
              <div
                key={panel.id}
                className="navigator-panel"
                style={{
                  left: `${(panel.x / PAGE_WIDTH) * 100}%`,
                  top: `${(panel.y / PAGE_HEIGHT) * 100}%`,
                  width: `${(panel.width / PAGE_WIDTH) * 100}%`,
                  height: `${(panel.height / PAGE_HEIGHT) * 100}%`,
                }}
              />
            ))}

            <div
              className="navigator-view"
              style={{
                top: `${safeTop}%`,
                height: `${safeHeight}%`,
              }}
            />
          </div>

          <div className="zoom-row">
            <input
              type="range"
              min="30"
              max="150"
              value={zoom * 100}
              onChange={(e) => setZoom(Number(e.target.value) / 100)}
            />

            <span className="zoom-percent">{Math.round(zoom * 100)}</span>

            <button
              className="zoom-reset"
              onClick={() => setZoom(1)}
              title="100%로 되돌리기"
            >
              ◎
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Navigator;