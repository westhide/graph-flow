use wasm_bindgen::prelude::*;
use web_sys::Element;

pub fn get_element_by_id(id: &str) -> Element {
    let windows = web_sys::window().unwrap_throw();
    let document = windows.document().unwrap_throw();
    document.get_element_by_id(id).unwrap_throw()
}
