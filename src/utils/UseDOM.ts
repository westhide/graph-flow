export function isDOMFullscreen() {
  return !!document.fullscreenElement;
}

export function resolveRect(rect: DOMRect) {
  const { x, y, width, height, left, right, bottom, top } = rect;
  return {
    x,
    y,
    width,
    height,
    left,
    right,
    bottom,
    top,
  };
}
