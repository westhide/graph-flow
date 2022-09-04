use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::utils::tree::{
    handler::TreeHandler,
    id::{Identity, ID},
    rc_tree::{RcNodeTree, RcTree},
    store::Store,
    Tree,
};

#[wasm_bindgen(typescript_custom_section)]
const Ts_Tree: &'static str = r#"
type TreeOptions = {
  node: {id:string,label?:string};
  info: string;
  children?: TreeOptions[];
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "TreeOptions")]
    pub type TsTreeOptions;
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct TreeItem {
    id: ID,
    label: Option<String>,
}

impl Identity for TreeItem {
    fn id(&self) -> ID {
        self.id.clone()
    }
}

#[wasm_bindgen(js_name = "treeHandler")]
pub fn tree_handler(options: TsTreeOptions) {
    let raw_tree: Tree<TreeItem, String> = options.into_serde().unwrap();
    let rc_tree = RcTree::<TreeItem, String>::from(raw_tree);

    let tree_json = serde_json::to_string_pretty(&rc_tree).unwrap();
    web_sys::console::log_1(&(format!("{tree_json}")).into());

    let handler = TreeHandler::from(rc_tree);

    let keys = handler.store.nodes();
    web_sys::console::log_1(&(format!("{keys:#?}")).into());

    let iter: Vec<_> = handler
        .tree
        .iter()
        .map(|cursor| cursor.borrow().node.clone())
        .collect();
    web_sys::console::log_1(&(format!("{iter:#?}")).into());

    // let key = keys[1];
    // let sibling = handler.store.child_nodes(key);
    //
    // let json = serde_json::to_string_pretty(&sibling).unwrap();
    // web_sys::console::log_1(&(format!("{key}{json}")).into());
}
