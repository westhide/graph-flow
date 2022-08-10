import { type PathPosition, PathPositionType } from "@/components/MyGraphFlow";

export function linePathDraw({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: PathPosition) {
  return `M${sourceX},${sourceY} ${targetX},${targetY}`;
}

function controlOffset(distance: number, curvature: number) {
  const offsetA = 0.5 * distance;
  const offsetB = curvature * 25 * Math.sqrt(-distance);
  return distance >= 0 ? offsetA : offsetB;
}

function getControlPoint({
  type,
  sourceX: scX,
  sourceY: scY,
  targetX: tcX,
  targetY: tcY,
  curvature = 0.25,
}: PathPosition) {
  const xOffset = controlOffset(scX - tcX, curvature);
  const yOffset = controlOffset(scY - tcY, curvature);

  switch (type) {
    case PathPositionType.Left:
      scX = scX - xOffset;
      tcX = tcX + xOffset;
      break;
    case PathPositionType.Right:
      scX = scX + xOffset;
      tcX = tcX - xOffset;
      break;
    case PathPositionType.Top:
      scY = scY - yOffset;
      tcY = tcY + yOffset;
      break;
    case PathPositionType.Bottom:
      scY = scY + yOffset;
      tcY = tcY - yOffset;
      break;
    case PathPositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${type}" undefined`);
  }
  return {
    sourceControlX: scX,
    sourceControlY: scY,
    targetControlX: tcX,
    targetControlY: tcY,
  };
}

export function bezierPathDraw(position: PathPosition) {
  const controlPoint = getControlPoint(position);
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  } = { ...controlPoint, ...position };
  return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
}
