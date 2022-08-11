export { linePathDraw, bezierPathDraw } from "./Edge/utils/pathDraw";
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
  type EndpointPosition,
  type EndpointMoveEvent,
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

/*  script  */
import type { MarkOptional } from "@/utils/UseType";
import {
  type PathOptions,
  type PartialEdgeOptions,
  type EdgeEndpointsOptions,
  type PartialNodeOptions,
  Edge,
  Node,
} from "@/components/MyGraphFlow";

export type GraphFlowType = "digraph" | "undigraph" | "tree";

type RelationEdgeOptions = {
  id?: string;
  path?: Partial<PathOptions>;
  endpoints?: EdgeEndpointsOptions;
};

export type Relation = {
  id: string;
  source: PartialNodeOptions | string;
  target: PartialNodeOptions | string;
  edge?: RelationEdgeOptions;
  weight?: number;
};

export type GraphFlowOptions = {
  type?: GraphFlowType;
  relations: MarkOptional<Relation, "id">[];
};

type GraphFlowRelation = {
  id: string;
  source: Node;
  target: Node;
  edge: Edge;
  weight?: number;
};

export class GraphFlow {
  type: GraphFlowType;
  relations: Map<string, GraphFlowRelation> = new Map();

  constructor(options: GraphFlowOptions) {
    const { type = "digraph", relations } = options;
    this.type = type;

    const { useNodes, createEdges } = useGraphFlowStore();

    for (const relation of relations) {
      defaultNanoid(relation);

      const { id, source, target, edge: edgeOptions = {} } = relation;
      const [sourceNode, targetNode] = useNodes([source, target]);

      const { x: sourceX, y: sourceY } = sourceNode!.position;
      const { x: targetX, y: targetY } = targetNode!.position;
      const position = {
        sourceX,
        sourceY,
        targetX,
        targetY,
      };
      edgeOptions.path = {
        position,
        ...edgeOptions.path,
      };
      const edge = createEdges(edgeOptions as PartialEdgeOptions);

      this.relations.set(id!, {
        ...relation,
        source: sourceNode,
        target: targetNode,
        edge: edge,
      } as GraphFlowRelation);

      this._bindMoveEvent(id!);
    }
  }

  protected _bindMoveEvent(relationId: string) {
    const relation = this.relations.get(relationId);

    if (relation === undefined)
      throw new Error(`relation: "${relationId}" undefined`);

    const {
      source,
      target,
      edge: { path },
    } = relation;
    source.setEvent(
      "move",
      (position) => path.moveEndpoint(position, "source"),
      path.id
    );
    target.setEvent(
      "move",
      (position) => path.moveEndpoint(position, "target"),
      path.id
    );
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
      <>
        {nodeElements.value}
        <MyGraphFlowEdge />
      </>
    );
  },
});
