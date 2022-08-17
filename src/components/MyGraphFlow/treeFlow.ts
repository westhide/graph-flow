import { MarkOptional } from "@/utils/UseType";
import {
  type Position,
  type NodeOptions,
  type RelationEdgeOptions,
  type RelationOptions,
  GraphFlow,
} from "@/components/MyGraphFlow";

type TreeNodeOptions = MarkOptional<NodeOptions, "position">;
type Children = {
  node: TreeNodeOptions;
  edge?: RelationEdgeOptions;
  weight?: number;
  children?: Children[];
};

export type TreeFlowOptions = {
  basePoint?: Position;
  depthSpace?: number;
  rowSpace?: number;
  root: TreeNodeOptions;
  children: Children[];
};

function setNodePosition(
  node: TreeNodeOptions,
  depth: number,
  row: number,
  preset: { basePoint: Position; depthSpace: number; rowSpace: number }
) {
  const { basePoint, depthSpace, rowSpace } = preset;
  const position = {
    x: basePoint.x + depth * depthSpace,
    y: basePoint.y + row * rowSpace,
  };
  defaults(node, {
    position,
  });
}

function addOptions(
  nodesOptions: NodeOptions[],
  relationsOptions: RelationOptions[],
  parent: TreeNodeOptions,
  node: TreeNodeOptions,
  edge?: RelationEdgeOptions,
  weight?: number
) {
  nodesOptions.push(node as NodeOptions);
  relationsOptions.push({
    source: parent.id!,
    target: node.id!,
    edge,
    weight,
  });
}

function generateGraphFlowOptions(
  parent: TreeNodeOptions,
  children: Children[],
  nodesOptions: NodeOptions[],
  relationsOptions: RelationOptions[],
  preset: {
    basePoint: Position;
    depthSpace: number;
    rowSpace: number;
  },
  row = 0,
  depth = 1
) {
  defaultNanoid(parent);
  for (const child of children) {
    const { node, edge, weight, children: grandchildren } = child;
    defaultNanoid(node);

    if (grandchildren) {
      const lastRow = row;
      row = generateGraphFlowOptions(
        node,
        grandchildren,
        nodesOptions,
        relationsOptions,
        preset,
        row,
        depth + 1
      );

      const midRow = (lastRow + row - 1) / 2;
      setNodePosition(node, depth, midRow, preset);
      addOptions(nodesOptions, relationsOptions, parent, node, edge, weight);
    } else {
      setNodePosition(node, depth, row, preset);
      addOptions(nodesOptions, relationsOptions, parent, node, edge, weight);
      row++;
    }
  }
  return row;
}

export class TreeFlow extends GraphFlow {
  constructor(options: TreeFlowOptions[]) {
    const nodesOptions: NodeOptions[] = [];
    const relationsOptions: RelationOptions[] = [];

    const { treeFlow } = useGraphFlowStore().preset;
    const treeBasePoint = treeFlow.basePoint;
    for (const optionsItem of options) {
      const {
        basePoint = treeBasePoint,
        depthSpace = treeFlow.depthSpace,
        rowSpace = treeFlow.rowSpace,
        root,
        children,
      } = optionsItem;
      const preset = { basePoint, depthSpace, rowSpace };
      const row = generateGraphFlowOptions(
        root,
        children,
        nodesOptions,
        relationsOptions,
        preset
      );
      setNodePosition(root, 0, (row + 1) / 2, preset);
      nodesOptions.push(root as NodeOptions);
      treeBasePoint.y = (row + 1) * rowSpace;
    }

    super({ nodes: nodesOptions, relations: relationsOptions });
  }
}
