export { linePathDraw, curvePathDraw, stepPathDraw } from "./utils/pathDraw";
export {
  mergeOffset,
  getEndpointOffset,
  getPositionCenter,
  getPositionDistance,
} from "./utils/position";
export { type NodeRect, type NodeOptions, Node } from "./Node";
export {
  type PathPosition,
  type PathOptions,
  PathType,
  Path,
} from "./Edge/Path";
export {
  type EndpointType,
  type EndpointOptions,
  Endpoint,
} from "./Edge/Endpoint";
export { type EdgeEndpointsOptions, type EdgeOptions, Edge } from "./Edge";

/**  ##Script */
import type { ArrayOrSingle, Merge } from "@/utils/UseType";
import {
  type EdgeOptions,
  type NodeOptions,
  getEndpointOffset,
  Edge,
  Node,
} from "@/components/MyGraphFlow";

export type Position = {
  x: number;
  y: number;
};

export enum PositionType {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Float = "float",
}

export type GraphFlowType = "digraph" | "undigraph" | "tree";

export type RelationEdgeOptions = Partial<
  Merge<
    EdgeOptions,
    {
      path?: Merge<
        EdgeOptions["path"],
        {
          positions?: Partial<EdgeOptions["path"]["positions"]>;
        }
      >;
    }
  >
>;

export type RelationOptions<NodeId extends string = string> = {
  id?: string;
  source: NodeId;
  target: NodeId;
  edge?: RelationEdgeOptions;
  weight?: number;
};

class Relation {
  id: string;
  source: Node;
  target: Node;
  edge: Edge;
  weight?: number;

  constructor(options: RelationOptions, nodes: NodeMap) {
    defaultNanoid(options);

    const { id, source, target, edge: edgeOptions = {}, weight } = options;
    const sourceNode = this._getNode(source, nodes);
    const targetNode = this._getNode(target, nodes);

    const positions = {
      source: sourceNode.position,
      target: targetNode.position,
    };
    // TODO: fix ugly setter
    edgeOptions.path = {
      id: `[${sourceNode.id},${targetNode.id}]`,
      positions,
      ...edgeOptions.path,
    };
    edgeOptions.path.positions = {
      ...positions,
      ...edgeOptions.path.positions,
    };

    const edge = new Edge(edgeOptions as EdgeOptions);

    this.id = id!;
    this.source = sourceNode;
    this.target = targetNode;
    this.edge = edge;
    this.weight = weight;

    this._watchResize();
  }

  protected _getNode(nodeId: string, nodes: NodeMap) {
    const node = nodes.get(nodeId);
    if (node === undefined) throw new Error(`Node.id: "${nodeId}" undefined`);
    return node;
  }

  protected _watchResize() {
    watchPostEffect(() => {
      const { positions } = this.edge.path;
      const sourceOffset = getEndpointOffset(
        this.source.DOMRect,
        positions.sourceType
      );
      const targetOffset = getEndpointOffset(
        this.target.DOMRect,
        positions.targetType
      );
      Object.assign(positions.sourceOffset, { ...sourceOffset });
      Object.assign(positions.targetOffset, { ...targetOffset });
    });
  }
}

type NodeMap = Map<string, Node>;
type RelationMap = Map<string, Relation>;

export type GraphFlowOptions = {
  type?: GraphFlowType;
  nodes: NodeOptions[];
  relations: RelationOptions[];
};

export class GraphFlow {
  type: GraphFlowType;
  nodes: NodeMap = reactive(new Map());
  relations: RelationMap = reactive(new Map());

  constructor(options: GraphFlowOptions) {
    const { graphFlowType } = useGraphFlowStore().preset;

    const {
      type = graphFlowType,
      nodes: nodesOptions,
      relations: relationsOptions,
    } = options;

    this.createNodes(nodesOptions);

    this.createRelations(relationsOptions);

    this.type = type;
  }

  protected _createNode(options: NodeOptions) {
    const node = new Node(options);
    this.nodes.set(node.id, node);
    return node;
  }

  createNodes(options: NodeOptions): Node;
  createNodes(options: NodeOptions[]): Node[];
  createNodes(options: ArrayOrSingle<NodeOptions>) {
    return isArray(options)
      ? options.map((optionsItems) => this._createNode(optionsItems))
      : this._createNode(options);
  }

  protected _createRelation(options: RelationOptions) {
    const relation = new Relation(options, this.nodes);
    this.relations.set(relation.id, relation);
    return relation;
  }

  createRelations(options: RelationOptions): Relation;
  createRelations(options: RelationOptions[]): Relation[];
  createRelations(options: ArrayOrSingle<RelationOptions>) {
    return isArray(options)
      ? options.map((optionsItem) => this._createRelation(optionsItem))
      : this._createRelation(options);
  }

  getNode(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (node === undefined) throw new Error(`Node.id: "${nodeId}" undefined`);
    return node;
  }
}

/** ##Component */

import type { Ref, InjectionKey } from "vue";
import { default as MyGraphFlowNode } from "@/components/MyGraphFlow/Node";
import { default as MyGraphFlowEdge } from "@/components/MyGraphFlow/Edge";

export const graphFlowKey: InjectionKey<GraphFlow> = Symbol("GraphFlow");
export const containerKey: InjectionKey<Ref<HTMLElement>> = Symbol("WrapBox");

export default defineComponent({
  props: {
    graphFlow: {
      type: GraphFlow,
      required: true,
    },
  },
  setup({ graphFlow }) {
    const container = ref<HTMLElement | null>(null);

    provide(graphFlowKey, graphFlow);
    provide(containerKey, container);

    const slots = useSlots();

    const { nodes } = graphFlow;

    const nodeElements = computed(() => {
      const elements: JSX.Element[] = [];
      for (const node of nodes.values()) {
        elements.push(<MyGraphFlowNode node={node} />);
      }
      return elements;
    });

    return () => (
      <div ref={container} class="relative">
        <div>{nodeElements.value}</div>
        <MyGraphFlowEdge />
        {slots["default"]?.()}
      </div>
    );
  },
});
