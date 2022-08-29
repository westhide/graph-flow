use wasm_bindgen::prelude::*;

use crate::utils::tree::{handler::TreeHandler, ops::AddChild, Tree};

#[wasm_bindgen(typescript_custom_section)]
const Ts_Tree: &'static str = r#"
type TreeOptions = {
  node: string;
  info: string;
  children?: TreeOptions[];
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "TreeOptions")]
    pub type TsTreeOptions;
}

#[wasm_bindgen(js_name = "treeHandler")]
pub fn tree_handler(options: TsTreeOptions) {
    let raw_tree: Tree<String, String> = options.into_serde().unwrap();
    let mut handler = TreeHandler::new(raw_tree);
    let rc_tree = TreeHandler::rc_tree(Tree::new(
        "5".to_string(),
        "1-5".to_string(),
        None,
    ));
    handler.update_tree().add_child(rc_tree);
    web_sys::console::log_1(&(format!("{handler:#?}")).into());
}
