use serde::{Deserialize, Serialize};

use super::{id::Identity, rc_tree::RcTree, store::Store};

/// # [TreeHandler]
#[derive(Debug, Serialize, Deserialize)]
pub struct TreeHandler<N, I> {
    pub tree: RcTree<N, I>,

    pub store: Store<N, I>,
}

impl<N, I> TreeHandler<N, I>
where
    N: Identity,
{
    pub fn new(tree: RcTree<N, I>, store: Store<N, I>) -> Self {
        Self { tree, store }
    }

    // pub fn add_child<T>(&mut self, child: RcTree<N, I>) -> Option<&Rc<N>> {
    //     // let c = parent.as_ref();
    //     // Some(parent)
    //     // let Self {node, children, .. } = parent;
    //     //
    //     // let child = Self::rc_tree(child);
    //     //
    //     // if let Some(children) = children {
    //     //     children.push(child)
    //     // } else {
    //     //     *children = Some(vec![child])
    //     // }
    //     None
    // }
}

impl<N, I> From<RcTree<N, I>> for TreeHandler<N, I>
where
    N: Identity,
{
    /// # Panics
    /// Node [ID] can not repeat
    fn from(tree: RcTree<N, I>) -> Self {
        let store = tree.store();
        TreeHandler::new(tree, store)
    }
}

// TODO
// pub fn from_closure_table() {}
// pub fn to_closure_table(&self) {}

// TODO
// macro_rules! tree {
//     // node
//     ($node:expr) => {};
//
//     // node & children
//     ($node:expr, $children:expr) => {};
// }
