import {
  type PartialEdgeOptions,
  type PartialNodeOptions,
  type GraphFlowOptions,
  linePathDraw,
  bezierPathDraw,
  PathType,
  PathPositionType,
  Edge,
  Node,
  GraphFlow,
} from "@/components/MyGraphFlow";

export default defineStore("graphFlow", () => {
  const preset = {
    graphFlowType: "digraph" as const,
    path: {
      type: PathType.Bezier,
      positionType: PathPositionType.Right,
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
    return isString(tag) ? nodes.get(tag) : _createNode(tag);
  }

  function useNodes(options: NodeOptionsOrId): Node | undefined;
  function useNodes(options: NodeOptionsOrId[]): (Node | undefined)[];
  function useNodes(tag: NodeOptionsOrId | NodeOptionsOrId[]) {
    return isArray(tag)
      ? tag.map((tagItem) => _useNode(tagItem))
      : _useNode(tag);
  }

  function createGraphFlow(options: GraphFlowOptions) {
    return new GraphFlow(options);
  }

  return {
    preset,
    nodes,
    edges,
    createEdges,
    createNodes,
    useNodes,
    createGraphFlow,
  };
});
