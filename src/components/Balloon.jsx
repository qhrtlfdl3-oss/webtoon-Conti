import { BALLOON_IMAGES } from "../constants";

function Balloon({
  balloon,
  isSelected,
  startBalloonMove,
  startBalloonResize,
}) {
  return (
    <div
      className={`balloon-group ${isSelected ? "selected" : ""}`}
      style={{
        left: balloon.x,
        top: balloon.y,
        width: balloon.width,
        height: balloon.height,
      }}
      onPointerDown={(e) => startBalloonMove(e, balloon)}
    >
      {balloon.type !== "text" && (
        <img
          className="balloon-img"
          src={BALLOON_IMAGES[balloon.type]}
          alt=""
          draggable={false}
        />
      )}

      <div className="balloon-text">{balloon.text}</div>

      {isSelected && (
        <>
          <div
            className="resize-handle top-left"
            onPointerDown={(e) => startBalloonResize(e, balloon, "top-left")}
          />
          <div
            className="resize-handle top-right"
            onPointerDown={(e) => startBalloonResize(e, balloon, "top-right")}
          />
          <div
            className="resize-handle bottom-left"
            onPointerDown={(e) => startBalloonResize(e, balloon, "bottom-left")}
          />
          <div
            className="resize-handle bottom-right"
            onPointerDown={(e) =>
              startBalloonResize(e, balloon, "bottom-right")
            }
          />
        </>
      )}
    </div>
  );
}

export default Balloon;