import {
  type PartialEdgeOptions,
  type PartialNodeOptions,
  type RelationOptions,
  type GraphFlowOptions,
  linePathDraw,
  bezierPathDraw,
  PathType,
  PathPositionType,
  Edge,
  Node,
  Relation,
  GraphFlow,
} from "@/components/MyGraphFlow";

export default defineStore("graphFlow", () => {
  const preset = {
    graphFlowType: "digraph" as const,
    path: {
      type: PathType.Bezier,
      positions: {
        type: PathPositionType.Right,
        sourceOffset: { x: 0, y: 0 },
        targetOffset: { x: 0, y: 0 },
        curvature: 0.25,
      },
      map: {
        [PathType.Line]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          pathDraw: linePathDraw,
        },
        [PathType.Bezier]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          pathDraw: bezierPathDraw,
        },
      },
    },
    endpoint: {
      draggable: false,
    },
    node: {
      label: "Node",
      draggable: true,
    },
  };

  const nodes = reactive(new Map<string, Node>());
  const edges = reactive(new Map<string, Edge>());
  const relations = reactive(new Map<string, Relation>());

  function _createEdge(options: PartialEdgeOptions) {
    const edge = new Edge(options);
    edges.set(edge.id, edge);
    return edge;
  }

  function createEdges(options: PartialEdgeOptions): Edge;
  function createEdges(options: PartialEdgeOptions[]): Edge[];
  function createEdges(options: PartialEdgeOptions | PartialEdgeOptions[]) {
    return isArray(options)
      ? options.map((optionsItem) => _createEdge(optionsItem))
      : _createEdge(options);
  }

  function _createNode(options: PartialNodeOptions) {
    const node = new Node(options);
    nodes.set(node.id, node);
    return node;
  }

  function createNodes(options: PartialNodeOptions): Node;
  function createNodes(options: PartialNodeOptions[]): Node[];
  function createNodes(options: PartialNodeOptions | PartialNodeOptions[]) {
    return isArray(options)
      ? options.map((optionsItem) => _createNode(optionsItem))
      : _createNode(options);
  }

  type NodeOptionsOrId = PartialNodeOptions | string;
  function _useNode(tag: NodeOptionsOrId) {
    if (isString(tag)) {
      const node = nodes.get(tag);
      if (node === undefined) throw new Error(`Node.id: "${tag}" undefined`);
      return node;
    } else {
      return _createNode(tag);
    }
  }

  function useNodes(options: NodeOptionsOrId): Node;
  function useNodes(options: NodeOptionsOrId[]): Node[];
  function useNodes(tag: NodeOptionsOrId | NodeOptionsOrId[]) {
    return isArray(tag)
      ? tag.map((tagItem) => _useNode(tagItem))
      : _useNode(tag);
  }

  function _createRelation(options: RelationOptions) {
    const relation = new Relation(options);
    relations.set(relation.id, relation);
    return relation;
  }

  function createRelations(options: RelationOptions): Relation;
  function createRelations(options: RelationOptions[]): Relation[];
  function createRelations(options: RelationOptions | RelationOptions[]) {
    return isArray(options)
      ? options.map((optionsItem) => _createRelation(optionsItem))
      : _createRelation(options);
  }

  function createGraphFlow(options: GraphFlowOptions) {
    return new GraphFlow(options);
  }

  return {
    preset,
    nodes,
    edges,
    relations,
    createEdges,
    createNodes,
    createRelations,
    useNodes,
    createGraphFlow,
  };
});
