pub mod components;
pub mod utils;

pub use utils::use_dom;
use wasm_bindgen::prelude::*;
use web_sys::console;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

extern crate web_sys;

#[wasm_bindgen(start)]
pub fn setup() {
    utils::set_panic_hook();
    console::log_1(&"Wasm Setup Success".into());
}
