import { MarkOptional } from "@/utils/UseType";
import {
  type Position,
  type NodeOptions,
  type RelationEdgeOptions,
  type RelationOptions,
  type Edge,
  GraphFlow,
} from "@/components/MyGraphFlow";

type TreeNodeOptions = MarkOptional<NodeOptions, "position">;
type ChildrenOptions = {
  node: TreeNodeOptions;
  edge?: RelationEdgeOptions;
  weight?: number;
  children?: ChildrenOptions[];
};

export type TreeFlowOptions = {
  basePoint?: Position;
  depthSpace?: number;
  rowSpace?: number;
  root: TreeNodeOptions;
  children: ChildrenOptions[];
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

function generateGraphFlowOptions(
  parent: TreeNodeOptions,
  children: ChildrenOptions[],
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

    const lastRow = row;
    if (grandchildren) {
      row = generateGraphFlowOptions(
        node,
        grandchildren,
        nodesOptions,
        relationsOptions,
        preset,
        row,
        depth + 1
      );
    } else row++;

    const midRow = (lastRow + row - 1) / 2;
    setNodePosition(node, depth, midRow, preset);

    nodesOptions.push(node as NodeOptions);
    relationsOptions.push({
      source: parent.id!,
      target: node.id!,
      edge,
      weight,
    });
  }
  return row;
}

type Children = {
  node: Node;
  edge?: Edge;
  weight?: number;
  children?: Children[];
};
type Tree = {
  root: Node;
  children: Children[];
  basePoint?: Position;
  depthSpace?: number;
  rowSpace?: number;
};

export class TreeFlow extends GraphFlow {
  trees: Tree[];

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

    // TODO: tree struct
    this.trees = [];
  }

  protected _watchLayout() {
    //
  }
}
