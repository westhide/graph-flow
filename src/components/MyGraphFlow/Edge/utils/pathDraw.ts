import { type PathPosition, PathPositionType } from "@/components/MyGraphFlow";

export function linePathDraw({ source, target }: PathPosition) {
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
    sourceControl: { x: scX, y: scY },
    targetControl: { x: tcX, y: tcY },
  };
}

export function bezierPathDraw(position: PathPosition) {
  const controlPoint = getControlPoint(position);
  const { source, target, sourceControl, targetControl } = {
    ...controlPoint,
    ...position,
  };
  return `M${source.x},${source.y} C${sourceControl.x},${sourceControl.y} ${targetControl.x},${targetControl.y} ${target.x},${target.y}`;
}
