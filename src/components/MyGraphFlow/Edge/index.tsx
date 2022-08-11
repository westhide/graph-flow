import type { MarkOptional } from "@/utils/UseType";
import {
  Endpoint,
  type PartialEndpointOptions,
  type EndpointType,
  type PartialPathOptions,
  Path,
} from "@/components/MyGraphFlow";

// TODO: auto import nest tsx components
import { default as MyGraphFlowContainerSVG } from "@/components/MyGraphFlow/Container/SVG.vue";
import { default as MyGraphFlowEdgeEndpoint } from "@/components/MyGraphFlow/Edge/Endpoint";
import { default as MyGraphFlowEdgePath } from "@/components/MyGraphFlow/Edge/Path";

export type EdgeEndpointsOptions = Partial<
  Record<EndpointType, MarkOptional<PartialEndpointOptions, "position">>
>;

export type EdgeOptions = {
  id: string;
  path: PartialPathOptions;
  endpoints?: EdgeEndpointsOptions;
};

export type PartialEdgeOptions = MarkOptional<EdgeOptions, "id">;

export class Edge {
  id: string;
  path: Path;
  endpoints: Partial<Record<EndpointType, Endpoint>> = {};

  constructor(options: PartialEdgeOptions) {
    const { id = nanoid(), path: path, endpoints } = options;

    this.id = id;
    this.path = new Path(path);

    if (endpoints !== undefined) {
      for (const [type, endpoint] of Object.entries(endpoints)) {
        const position = this.path.endpointPosition(type as EndpointType);

        this.endpoints[type as EndpointType] = new Endpoint({
          position,
          ...endpoint,
        });

        this._bindMoveEvent(type as EndpointType);
      }
    }
  }

  protected _bindMoveEvent(type: EndpointType) {
    if (this.endpoints[type] === undefined)
      throw new Error(`endpoint: "${type}" undefined`);

    return this.endpoints[type]!.setEvent(
      "move",
      (position) => this.path.moveEndpoint(position, type),
      this.path.id
    );
  }
}

export default defineComponent({
  setup: function () {
    const { edges } = useGraphFlowStore();

    const element = computed(() => {
      const pathElements: JSX.Element[] = [],
        endpointElements: JSX.Element[][] = [];

      for (const { path, endpoints } of edges.values()) {
        pathElements.push(<MyGraphFlowEdgePath path={path} />);

        const endpointElement = Object.values(endpoints).map((endpoint) => {
          return <MyGraphFlowEdgeEndpoint endpoint={endpoint} />;
        });
        endpointElements.push(endpointElement);
      }

      return { pathElements, endpointElements };
    });

    return () => (
      <>
        {/* * render svg container once, path should register here*/}
        <MyGraphFlowContainerSVG>
          {element.value.pathElements}
        </MyGraphFlowContainerSVG>

        {element.value.endpointElements}
      </>
    );
  },
});
