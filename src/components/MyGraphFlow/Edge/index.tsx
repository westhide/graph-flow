import { PropType } from "vue";
import {
  Endpoint,
  type EndpointOptions,
  type EndpointType,
  type PartialPathOptions,
  Path,
} from "@/components/MyGraphFlow";

// TODO: auto import nest tsx components
import { default as MyGraphFlowContainerSVG } from "@/components/MyGraphFlow/Container/SVG.vue";
import { default as MyGraphFlowEdgeEndpoint } from "@/components/MyGraphFlow/Edge/Endpoint";
import { default as MyGraphFlowEdgePath } from "@/components/MyGraphFlow/Edge/Path";
import { MarkOptional } from "@/utils/UseType";

export type EdgeOptions = {
  path: PartialPathOptions;
  endpoints?: Partial<
    Record<EndpointType, MarkOptional<EndpointOptions, "position">>
  >;
};

export class Edge {
  path: Path;
  endpoints: Partial<Record<EndpointType, Endpoint>> = {};

  constructor(options: EdgeOptions) {
    const { path: pathOptions, endpoints: endpointsOptions } = options;

    this.path = new Path(pathOptions);

    if (endpointsOptions !== undefined) {
      for (const [type, options] of Object.entries(endpointsOptions)) {
        const position = this.path.endpointPosition(type as EndpointType);
        this.endpoints[type as EndpointType] = new Endpoint({
          position,
          ...options,
        });
        this._bindMoveEvent(type as EndpointType);
      }
    }
  }

  protected _bindMoveEvent(type: EndpointType, key?: string) {
    return this.endpoints[type]!.setEvent(
      "move",
      (position) => this.path.moveEndpoint(position, type),
      key
    );
  }
}

export function createEdges(optionsList: EdgeOptions[]) {
  const edges = optionsList.map((options) => new Edge(options));

  return reactive(edges);
}

export default defineComponent({
  props: {
    edges: {
      type: Array as PropType<Edge[]>,
      required: true,
    },
  },
  setup: function ({ edges }) {
    const pathElements = computed(() =>
      edges.map(({ path }) => <MyGraphFlowEdgePath path={path} />)
    );

    const endpointElements = computed(() =>
      edges.map(({ endpoints }) =>
        Object.values(endpoints).map((endpoint) => {
          return <MyGraphFlowEdgeEndpoint endpoint={endpoint} />;
        })
      )
    );

    return () => (
      <>
        {/* * render svg container once, path should register here*/}
        <MyGraphFlowContainerSVG>{pathElements.value}</MyGraphFlowContainerSVG>

        {endpointElements.value}
      </>
    );
  },
});
