import {
  type Position,
  type PathPosition,
  PathPositionType,
} from "@/components/MyGraphFlow";

/** calculate PathType.Bezier control point offset */
function controlOffset(distance: number, curvature: number) {
  const offsetA = 0.5 * distance;
  const offsetB = curvature * 25 * Math.sqrt(-distance);
  return distance >= 0 ? offsetA : offsetB;
}
/** calculate PathType.Bezier control point position */
function getControlPositions(
  {
    type,
    source: { x: scX, y: scY },
    target: { x: tcX, y: tcY },
  }: PathPosition,
  curvature: number
) {
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
    sourceControl: { x: scX, y: scY } as Position,
    targetControl: { x: tcX, y: tcY } as Position,
  };
}

/** ## PathType.Line path draw */
export function linePathDraw(positions: PathPosition) {
  const { source, target } = positions;
  return `M${source.x},${source.y} ${target.x},${target.y}`;
}

/** ## PathType.Bezier path draw */
export function bezierPathDraw(positions: PathPosition, curvature: number) {
  const { sourceControl, targetControl } = getControlPositions(
    positions,
    curvature
  );
  const { source, target } = positions;

  return `M${source.x},${source.y} C${sourceControl.x},${sourceControl.y} ${targetControl.x},${targetControl.y} ${target.x},${target.y}`;
}
