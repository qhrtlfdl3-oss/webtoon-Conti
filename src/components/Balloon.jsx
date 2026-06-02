import { BALLOON_IMAGES } from "../constants";

function Balloon({
  balloon,
  allBalloons,
  isSelected,
  startBalloonMove,
  startBalloonResize,
  showText = true,
}) {
  const getVisibleBox = (item) => {
    const insetX = item.width * 0.1;
    const insetY = item.height * 0.1;

    return {
      left: item.x + insetX,
      top: item.y + insetY,
      right: item.x + item.width - insetX,
      bottom: item.y + item.height - insetY,
    };
  };

  const overlapMasks =
    balloon.maskOverlap && allBalloons
      ? allBalloons
          .filter((other) => other.id !== balloon.id)
          .map((other) => {
            const a = getVisibleBox(balloon);
            const b = getVisibleBox(other);

            const left = Math.max(a.left, b.left);
            const top = Math.max(a.top, b.top);
            const right = Math.min(a.right, b.right);
            const bottom = Math.min(a.bottom, b.bottom);

            if (right <= left || bottom <= top) return null;

            return {
              id: other.id,
              centerX: left - balloon.x + (right - left) / 2,
              centerY: top - balloon.y + (bottom - top) / 2,
            };
          })
          .filter(Boolean)
      : [];

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

      {overlapMasks.map((mask) => {
        const size = balloon.maskSize || 70;

        return (
          <div
            key={mask.id}
            className="overlap-circle"
            style={{
              width: size,
              height: size,
              left: mask.centerX - size / 2,
              top: mask.centerY - size / 2,
            }}
          />
        );
      })}

      {showText && <div className="balloon-text">{balloon.text}</div>}

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