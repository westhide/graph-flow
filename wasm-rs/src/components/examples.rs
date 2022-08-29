use sycamore::prelude::*;
use wasm_bindgen::prelude::*;
use web_sys::Node;

/// Component Example 1
#[component]
fn ComponentExample1<G: Html>(cx: Scope) -> View<G> {
    let name = create_signal(cx, String::new());

    let displayed_name = || {
        if name.get().is_empty() {
            "World".to_string()
        } else {
            name.get().as_ref().clone()
        }
    };

    view! { cx,
        section {
            strong(class="inline-block mt-2"){
                "Example1"
            }
            h1 {
                "Hello "
                (displayed_name())
                "!"
            }

            input(class="border border-black", placeholder="What is your name?", bind:value=name)
        }
    }
}

/// Component Example 1 render entry
#[wasm_bindgen(js_name = "renderComponentExample1To")]
pub fn render_component_example_1_to(node: &Node) {
    sycamore::render_to(|ctx| view! { ctx, ComponentExample1 {} }, node);
}
