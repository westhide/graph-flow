import {
  getPositionCenter,
  getPositionDistance,
  type PathPosition,
  type Position,
  PositionType,
} from "@/components/MyGraphFlow";

/**
 * ## PathType.Line path draw
 */
export function linePathDraw(positions: PathPosition) {
  const { source, target } = positions;
  return `M ${source.x},${source.y} ${target.x},${target.y}`;
}

/**
 * ## PathType.Bezier path draw
 * calculate PathType.Bezier control point offset
 */
function controlOffset(distance: number, curvature: number) {
  const offsetA = 0.5 * distance;
  const offsetB = curvature * 25 * Math.sqrt(-distance);
  return distance >= 0 ? offsetA : offsetB;
}
/**
 * calculate control position with different PositionType
 */
function controlPosition(
  { x, y }: Position,
  offset: Position,
  type: PositionType
) {
  switch (type) {
    case PositionType.Left:
      x = x - offset.x;
      break;
    case PositionType.Right:
      x = x + offset.x;
      break;
    case PositionType.Top:
      y = y - offset.y;
      break;
    case PositionType.Bottom:
      y = y + offset.y;
      break;
    case PositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${type}" undefined`);
  }
  return { x, y };
}
/** calculate PathType.Bezier control point position */
function getControlPositions({
  sourceType,
  targetType,
  source,
  target,
  curvature,
}: PathPosition) {
  const cOx = controlOffset(source.x - target.y, curvature);
  const cOy = controlOffset(source.y - target.y, curvature);
  const offset = { x: cOx, y: cOy };
  const sourceControl = controlPosition(source, offset, sourceType);
  const targetControl = controlPosition(target, offset, targetType);
  return {
    sourceControl,
    targetControl,
  };
}
/**
 * Bezier path draw
 */
export function curvePathDraw(positions: PathPosition) {
  const { sourceControl, targetControl } = getControlPositions(positions);
  const { source, target } = positions;

  return `M ${source.x},${source.y} 
          C ${sourceControl.x},${sourceControl.y} ${targetControl.x},${targetControl.y} ${target.x},${target.y}`;
}

/**
 * ## PathType.Step path draw
 */
function stepBrokenLine({
  sourceType,
  source,
  targetType,
  target,
  stepCornerSize,
}: PathPosition) {
  const { Right, Left, Top, Bottom } = PositionType;
  const { x: centerX, y: centerY } = getPositionCenter(source, target);
  const { x: distanceX, y: distanceY } = getPositionDistance(source, target);

  const size = Math.min(
    Math.abs(distanceX / 2),
    Math.abs(distanceY / 2),
    stepCornerSize
  );

  const xSize = distanceX > 0 ? size : -size;
  const ySize = distanceY > 0 ? size : -size;

  switch (`${sourceType},${targetType}`) {
    case `${Right},${Left}`:
    case `${Left},${Right}`:
      return `L ${centerX - xSize},${source.y}
              Q ${centerX},${source.y} ${centerX},${source.y + ySize} 
              L ${centerX},${target.y - ySize}
              Q ${centerX},${target.y} ${centerX + xSize},${target.y}`;

    case `${Bottom},${Top}`:
    case `${Top},${Bottom}`:
      return `L ${source.x},${centerY - ySize}
              Q ${source.x},${centerY} ${source.x + xSize},${centerY} 
              L ${target.x - xSize},${centerY}
              Q ${target.x},${centerY} ${target.x},${centerY + ySize}`;

    case `${Right},${Top}`:
    case `${Right},${Bottom}`:
    case `${Left},${Top}`:
    case `${Left},${Bottom}`:
      return `L ${target.x - xSize},${source.y}
              Q ${target.x},${source.y} ${target.x},${source.y + ySize}`;

    case `${Bottom},${Left}`:
    case `${Bottom},${Right}`:
    case `${Top},${Left}`:
    case `${Top},${Right}`:
      return `L ${source.x},${target.y - ySize}
              Q ${source.x},${target.y} ${source.x + xSize},${target.y}`;

    // TODO: finish edge case and float
    default:
      return "";
  }
}

export function stepPathDraw(positions: PathPosition) {
  const { source, target } = positions;
  const brokenLine = stepBrokenLine(positions);

  return `M ${source.x},${source.y} 
          ${brokenLine} 
          L ${target.x},${target.y}`;
}
