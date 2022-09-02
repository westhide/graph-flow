use serde::{Deserialize, Serialize};

use super::{
    edge::Edge,
    id::Identity,
    node::Node,
    rc_box::{RcBox, WeakBox},
    store::{Insert, Store},
    Tree,
};

/// # [RcTree] structure
pub type RcTree<N, I> = RcBox<Relation<N, I>>;

#[derive(Debug, Serialize, Deserialize)]
pub struct Relation<N, I> {
    #[serde(skip_serializing)]
    pub parent: Parent<N, I>,
    pub node: RcBox<N>,
    pub info: RcBox<I>,
    pub children: Children<N, I>,
}

pub type Parent<N, I> = Option<WeakBox<Relation<N, I>>>;
pub type Children<N, I> = Option<Vec<RcBox<Relation<N, I>>>>;

impl<N, I> RcTree<N, I> {
    pub fn traverse<F>(&self, func: &mut F)
    where
        F: FnMut(&Self),
    {
        func(self);

        match &self.borrow().children {
            Some(children) => {
                children.iter().for_each(|child| child.traverse(func))
            }
            None => return,
        }
    }
}

pub type RcEdge<N, I> = Edge<RcBox<N>, RcBox<I>>;

impl<N, I> RcTree<N, I>
where
    N: Identity,
{
    pub fn relations(&self) -> Vec<RcTree<N, I>> {
        let mut relations = vec![];

        self.traverse(&mut |relation| relations.push(relation.clone()));

        relations
    }

    pub fn nodes(&self) -> Vec<RcBox<N>> {
        let mut nodes = vec![];

        self.traverse(&mut |relation| {
            nodes.push(relation.borrow().node.clone())
        });

        nodes
    }

    pub fn edges(&self) -> Vec<RcEdge<N, I>> {
        let mut edges = vec![];

        self.traverse(&mut |relation| {
            let Relation {
                parent, node, info, ..
            } = &*relation.borrow();

            let parent_node = parent.as_ref().and_then(|parent| {
                Some(parent.upgrade()?.borrow().node.clone())
            });

            let parent_node = match parent_node {
                Some(node) => node,
                None => return,
            };

            edges.push(Edge::new(
                node.id(),
                parent_node,
                node.clone(),
                info.clone(),
            ))
        });

        edges
    }

    pub fn sibling_nodes(&self) -> Option<Vec<RcBox<N>>> {
        match &self.borrow().children {
            Some(children) => {
                let nodes = children
                    .iter()
                    .map(|child| child.borrow().node.clone())
                    .collect();
                Some(nodes)
            }
            None => None,
        }
    }

    /// # Generate [Store] for [RcTree]
    ///
    /// # [Errors](super::store::Insert)
    /// [ID] can not [repeat().
    pub fn store(&self) -> Store<N, I> {
        let mut store = Store::default();

        self.traverse(&mut |relation| {
            let Relation {
                parent, node, info, ..
            } = &*relation.borrow();

            store.insert(node.id(), relation.clone()).unwrap();

            let parent_node = parent.as_ref().and_then(|parent| {
                Some(parent.upgrade()?.borrow().node.clone())
            });

            let parent_node = match parent_node {
                Some(node) => node,
                None => return,
            };

            let edge =
                Edge::new(node.id(), parent_node, node.clone(), info.clone());

            store.insert(node.id(), edge).unwrap();
        });

        store
    }
}

impl<N, I> From<Tree<N, I>> for RcTree<N, I> {
    fn from(tree: Tree<N, I>) -> Self {
        tree.transform(&mut |node, info| (node, info))
    }
}

/// # [RcNodeTree]
/// Wrap type T value by Node
///
/// # Safety
/// Node.id use default [ID](super::id::ID::default).
/// May cause ID collision probability.
pub type RcNodeTree<T, I> = RcTree<Node<T>, I>;
impl<T, I> From<Tree<T, I>> for RcNodeTree<T, I> {
    fn from(tree: Tree<T, I>) -> Self {
        tree.transform(&mut |value, info| (Node::new(value), info))
    }
}
