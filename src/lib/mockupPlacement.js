const FRONT_AREA = { width: 1800, height: 2400 };

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizePlacement(placement) {
  const scale = Number(placement?.scale ?? 20);
  const y = Number(placement?.y ?? 0);
  return {
    scale: Number.isFinite(scale) ? scale : 20,
    y: Number.isFinite(y) ? y : 0,
  };
}

export function toPrintfulPosition(placement) {
  const { scale, y } = normalizePlacement(placement);

  // Tuned to keep front designs near upper chest, matching Printful previews.
  const width = clamp(Math.round(880 + scale * 11), 620, 1320);
  const height = width;
  const left = Math.round((FRONT_AREA.width - width) / 2);
  const top = clamp(Math.round(300 + y * 6), 70, FRONT_AREA.height - height - 90);

  return {
    area_width: FRONT_AREA.width,
    area_height: FRONT_AREA.height,
    width,
    height,
    top,
    left,
  };
}

export function toOverlayPercentages(placement) {
  const pos = toPrintfulPosition(placement);
  return {
    widthPct: (pos.width / FRONT_AREA.width) * 100,
    topPct: (pos.top / FRONT_AREA.height) * 100,
    leftPct: (pos.left / FRONT_AREA.width) * 100,
  };
}

export function toEditorPlacement(placement) {
  const pos = toPrintfulPosition(placement);

  const frame = { left: 60, top: 20, width: 160, height: 200 };
  const widthPx = frame.width * (pos.width / FRONT_AREA.width);
  const topPx = frame.top + frame.height * (pos.top / FRONT_AREA.height);
  const centerXPx = frame.left + frame.width * ((pos.left + pos.width / 2) / FRONT_AREA.width);

  return {
    widthPx,
    topPx,
    centerXPx,
  };
}
