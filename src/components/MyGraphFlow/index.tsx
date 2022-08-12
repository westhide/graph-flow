export {
  getPathOffset,
  linePathDraw,
  bezierPathDraw,
} from "./Edge/utils/pathDraw";
export {
  type PathPosition,
  type PathOptions,
  type PartialPathOptions,
  PathType,
  PathPositionType,
  Path,
} from "./Edge/Path";
export {
  type EndpointType,
  type EndpointOptions,
  type PartialEndpointOptions,
  Endpoint,
} from "./Edge/Endpoint";
export {
  type EdgeEndpointsOptions,
  type EdgeOptions,
  type PartialEdgeOptions,
  Edge,
} from "./Edge";
export { type NodeOptions, type PartialNodeOptions, Node } from "./Node";

/*  common  */
export type Position = {
  x: number;
  y: number;
};

/*  script  */
import type { MarkOptional } from "@/utils/UseType";
import {
  type PartialPathOptions,
  type PartialEdgeOptions,
  type EdgeEndpointsOptions,
  type PartialNodeOptions,
  Edge,
  Node,
} from "@/components/MyGraphFlow";

export type GraphFlowType = "digraph" | "undigraph" | "tree";

type RelationEdgeOptions = {
  id?: string;
  path?: MarkOptional<PartialPathOptions, "positions">;
  endpoints?: EdgeEndpointsOptions;
};

export type RelationOptions = {
  id?: string;
  source: PartialNodeOptions | string;
  target: PartialNodeOptions | string;
  edge?: RelationEdgeOptions;
  weight?: number;
};

export class Relation {
  id: string;
  source: Node;
  target: Node;
  edge: Edge;
  weight?: number;

  constructor(options: RelationOptions) {
    defaultNanoid(options);

    const { useNodes, createEdges } = useGraphFlowStore();

    const { id, source, target, edge: edgeOptions = {}, weight } = options;
    const sourceNode = useNodes(source);
    const targetNode = useNodes(target);

    const positions = {
      source: sourceNode.position,
      target: targetNode.position,
    };
    edgeOptions.path = {
      positions,
      ...edgeOptions.path,
    };

    const edge = createEdges(edgeOptions as PartialEdgeOptions);

    this.id = id!;
    this.source = sourceNode;
    this.target = targetNode;
    this.edge = edge;
    this.weight = weight;

    this._bindEvent();
  }

  protected _bindEvent() {
    const { path } = this.edge;
    this.source.bindPathMoveEvent(path, "source");
    this.target.bindPathMoveEvent(path, "target");

    this.source.bindPathOffset(path, "source");
    this.target.bindPathOffset(path, "target");
  }
}

export type GraphFlowOptions = {
  type?: GraphFlowType;
  nodes?: PartialNodeOptions[];
  relations: RelationOptions[];
};

export class GraphFlow {
  type: GraphFlowType;
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  relations: Map<string, Relation>;

  constructor(options: GraphFlowOptions) {
    const {
      nodes,
      edges,
      relations,
      createRelations,
      useNodes,
      preset: { graphFlowType },
    } = useGraphFlowStore();

    const {
      type = graphFlowType,
      nodes: nodesOptions,
      relations: relationsOptions,
    } = options;

    if (nodes !== undefined) useNodes(nodesOptions!);

    createRelations(relationsOptions);

    this.type = type;
    this.nodes = nodes;
    this.edges = edges;
    this.relations = relations;
  }
}

/*  component  */

import { default as MyGraphFlowNode } from "@/components/MyGraphFlow/Node";
import { default as MyGraphFlowEdge } from "@/components/MyGraphFlow/Edge";

export default defineComponent({
  setup() {
    const { nodes } = useGraphFlowStore();

    const nodeElements = computed(() => {
      const elements: JSX.Element[] = [];
      for (const node of nodes.values()) {
        elements.push(<MyGraphFlowNode node={node} />);
      }
      return elements;
    });

    return () => (
      <div class="relative">
        <div>{nodeElements.value}</div>
        <MyGraphFlowEdge />
      </div>
    );
  },
});
