import {
  type EndpointOptions,
  type EndpointType,
  type PathOptions,
  graphFlowKey,
  Endpoint,
  Path,
} from "@/components/MyGraphFlow";

// TODO: auto import nest tsx components
import { default as MyGraphFlowContainerSVG } from "@/components/MyGraphFlow/Container/SVG.vue";
import { default as MyGraphFlowEdgeEndpoint } from "@/components/MyGraphFlow/Edge/Endpoint";
import { default as MyGraphFlowEdgePath } from "@/components/MyGraphFlow/Edge/Path";

export type EdgeEndpointsOptions = Partial<
  Record<EndpointType, Partial<EndpointOptions>>
>;

export type EdgeOptions = {
  id?: string;
  path: PathOptions;
  endpoints?: EdgeEndpointsOptions;
};

export class Edge {
  id: string;
  path: Path;
  endpoints: Partial<Record<EndpointType, Endpoint>> = {};

  constructor(options: EdgeOptions) {
    defaultNanoid(options);
    const { id, path: pathOptions, endpoints: endpointsOptions } = options;

    this.id = id!;
    this.path = new Path(pathOptions);

    if (endpointsOptions !== undefined) {
      for (const [type, endpointOptions] of Object.entries(endpointsOptions))
        this._createEndpoint(endpointOptions, type as EndpointType);
    }
  }

  protected _createEndpoint(
    options: Partial<EndpointOptions>,
    type: EndpointType
  ) {
    const { positions } = this.path;

    defaults(options, {
      type,
      positionType: positions.type,
      position: positions[type],
      offset: positions[`${type}Offset`],
    });

    this.endpoints[type] = new Endpoint(options as EndpointOptions);
  }
}

export default defineComponent({
  setup: function () {
    const { relations } = inject(graphFlowKey)!;

    const element = computed(() => {
      const pathElements: JSX.Element[] = [],
        endpointElements: JSX.Element[][] = [];

      for (const {
        edge: { path, endpoints },
      } of relations.values()) {
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
        {/* * render svg container once, path should register here */}
        <MyGraphFlowContainerSVG class="absolute h-full w-full">
          {element.value.pathElements}
        </MyGraphFlowContainerSVG>

        {element.value.endpointElements}
      </>
    );
  },
});
