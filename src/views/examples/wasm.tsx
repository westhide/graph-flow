export default defineComponent({
  setup() {
    const wasmRef = $ref<Element>();

    onMounted(() => {
      wasm.render_app_to(wasmRef!);
    });

    return () => (
      <section>
        <p>Wasm Components</p>

        <div ref={$$(wasmRef)} />
      </section>
    );
  },
});
