export default defineComponent({
  setup() {
    const wasmRef = $ref<Element>();

    onMounted(() => {
      wasm.renderComponentExample1To(wasmRef!);
      wasm.treeHandler({
        node: { id: "1", label: "label1" },
        info: "root",
        children: [
          {
            node: { id: "2" },
            info: "1-2",
            children: [{ node: { id: "3" }, info: "2-3" }],
          },
          { node: { id: "4" }, info: "1-4" },
        ],
      });
    });

    return () => (
      <section>
        <p>Wasm Components</p>

        <div ref={$$(wasmRef)}>Inner</div>
      </section>
    );
  },
});
