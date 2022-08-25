use sycamore::prelude::*;
use wasm_bindgen::prelude::*;
use web_sys::Node;

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
        div {
            strong(class="inline-block mt-2"){
                "Example01"
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

#[wasm_bindgen]
pub fn render_app_to(node: &Node) {
    sycamore::render_to(|ctx| view! { ctx, ComponentExample1 {} }, node);
}
