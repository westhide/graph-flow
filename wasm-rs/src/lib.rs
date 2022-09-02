#![feature(map_try_insert)]

pub mod components;
pub mod shared;
pub mod utils;

use shared::panic_hook;
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
    panic_hook::set_panic_hook();
    console::log_1(&"Wasm Setup Success".into());
}
