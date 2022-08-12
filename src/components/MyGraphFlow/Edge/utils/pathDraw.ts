import {
  type Position,
  type PathPosition,
  type EndpointType,
  PathPositionType,
} from "@/components/MyGraphFlow";

export function getPathOffset(
  rect: DOMRect,
  positionType: PathPositionType,
  endpointType: EndpointType
) {
  const { width, height } = rect;
  let x = 0,
    y = 0;
  switch (positionType) {
    case PathPositionType.Left:
      y = height / 2;
      if (endpointType === "target") x = width;
      break;
    case PathPositionType.Right:
      y = height / 2;
      if (endpointType === "source") x = width;
      break;
    case PathPositionType.Top:
      x = width / 2;
      if (endpointType === "target") y = height;
      break;
    case PathPositionType.Bottom:
      x = width / 2;
      if (endpointType === "source") y = height;
      break;
    case PathPositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${positionType}" undefined`);
  }
  return { x, y };
}

function _mergeOffset(raw: Position, offset: Position) {
  return { x: raw.x + offset.x, y: raw.y + offset.y };
}

function mergeOffset(positions: PathPosition) {
  const { source, sourceOffset, target, targetOffset } = positions;
  return {
    ...positions,
    source: _mergeOffset(source, sourceOffset),
    target: _mergeOffset(target, targetOffset),
  };
}

export function linePathDraw(positions: PathPosition) {
  const { source, target } = mergeOffset(positions);
  return `M${source.x},${source.y} ${target.x},${target.y}`;
}

function controlOffset(distance: number, curvature: number) {
  const offsetA = 0.5 * distance;
  const offsetB = curvature * 25 * Math.sqrt(-distance);
  return distance >= 0 ? offsetA : offsetB;
}

function getControlPoint({
  type,
  source: { x: scX, y: scY },
  target: { x: tcX, y: tcY },
  curvature,
}: PathPosition) {
  const cOx = controlOffset(scX - tcX, curvature);
  const cOy = controlOffset(scY - tcY, curvature);

  switch (type) {
    case PathPositionType.Left:
      scX = scX - cOx;
      tcX = tcX + cOx;
      break;
    case PathPositionType.Right:
      scX = scX + cOx;
      tcX = tcX - cOx;
      break;
    case PathPositionType.Top:
      scY = scY - cOy;
      tcY = tcY + cOy;
      break;
    case PathPositionType.Bottom:
      scY = scY + cOy;
      tcY = tcY - cOy;
      break;
    case PathPositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${type}" undefined`);
  }
  return {
    sourceControl: { x: scX, y: scY },
    targetControl: { x: tcX, y: tcY },
  };
}

export function bezierPathDraw(position: PathPosition) {
  position = mergeOffset(position);

  const controlPoint = getControlPoint(position);
  const { source, target, sourceControl, targetControl } = {
    ...controlPoint,
    ...position,
  };
  return `M${source.x},${source.y} C${sourceControl.x},${sourceControl.y} ${targetControl.x},${targetControl.y} ${target.x},${target.y}`;
}
