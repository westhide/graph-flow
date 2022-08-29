use std::{cell::RefCell, rc::Rc};

use serde::{Deserialize, Serialize};

use super::{
    id::ID,
    node::Node,
    store::{Store, StoreGenerator},
    Tree,
};
use crate::utils::tree::id::Identity;

type RcTree<T, I> = Tree<Rc<T>, Rc<I>>;
type RcStore<T, I> = Store<ID, Rc<T>, Rc<I>>;

#[derive(Debug, Serialize, Deserialize)]
pub struct TreeHandler<T, I> {
    tree: RcTree<T, I>,

    pub store: RcStore<T, I>,
}

impl<T, I> TreeHandler<T, I> {
    pub fn new(tree: RcTree<T, I>, store: RcStore<T, I>) -> Self {
        Self { tree, store }
    }

    fn transform<N, F>(tree: Tree<T, I>, func: F) -> TreeHandler<N, I>
    where
        N: Identity,
        F: Fn(T) -> N,
    {
        let tree = tree.transform(&mut |value, info| {
            let rc_node = Rc::new(func(value));
            let rc_info = Rc::new(info);
            (rc_node, rc_info)
        });
        let store = tree.gen_store();
        TreeHandler::new(tree, store)
    }

    pub fn node_tree(tree: Tree<T, I>) -> TreeHandler<Node<T>, I> {
        TreeHandler::transform(tree, Node::new)
    }

    pub fn rc_tree(tree: Tree<T, I>) -> TreeHandler<RefCell<T>, I>
    where
        T: Identity,
    {
        TreeHandler::transform(tree, RefCell::new)
    }

    pub fn get_tree(&self) -> &RcTree<T, I> {
        &self.tree
    }

    // TODO: when update tree, sync store data
    pub fn update_tree(&mut self) -> &mut RcTree<T, I> {
        &mut self.tree
    }

    // fn add_child(&mut self,parent:&Self, child: Tree<T, I>) {
    //     let Self {node, children, .. } = parent;
    //
    //     let child = Self::rc_tree(child);
    //
    //     if let Some(children) = children {
    //         children.push(child)
    //     } else {
    //         *children = Some(vec![child])
    //     }
    // }
}

// impl<T,I> Deref for TreeHandler<T,I> {
//     type Target =RcTree<T,I>;
//
//     fn deref(&self) -> &Self::Target {
//         &self.tree
//     }
// }

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
