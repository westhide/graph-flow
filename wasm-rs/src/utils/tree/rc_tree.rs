use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

use super::{
    edge::Edge,
    id::{Identity, ID},
    iterator::RcTreeIterator,
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
pub type Children<N, I> = Option<IndexMap<ID, RcTree<N, I>>>;

impl<N, I> RcTree<N, I> {
    pub fn iter(&self) -> RcTreeIterator<N, I> {
        RcTreeIterator {
            stack: vec![self.clone()],
        }
    }

    pub fn traverse<F>(&self, func: &mut F)
    where
        F: FnMut(&Self),
    {
        func(self);

        if let Some(children) = &self.borrow().children {
            children.values().for_each(|child| child.traverse(func))
        }
    }
}

pub type RcEdge<N, I> = Edge<Option<RcBox<N>>, RcBox<N>, RcBox<I>>;

impl<N, I> RcTree<N, I>
where
    N: Identity,
{
    pub fn keys(&self) -> Vec<ID> {
        let mut keys = vec![];

        self.traverse(&mut |cursor| keys.push(cursor.id()));

        keys
    }

    pub fn nodes(&self) -> Vec<RcBox<N>> {
        let mut nodes = vec![];

        self.traverse(&mut |cursor| {
            let node = cursor.borrow().node.clone();
            nodes.push(node)
        });

        nodes
    }

    pub fn cursors(&self) -> Vec<RcTree<N, I>> {
        let mut cursors = vec![];

        self.traverse(&mut |cursor| cursors.push(cursor.clone()));

        cursors
    }

    pub fn edges(&self) -> Vec<RcEdge<N, I>> {
        let mut edges = vec![];

        self.traverse(&mut |cursor| {
            let Relation {
                parent,
                node,
                info,
                ..
            } = &*cursor.borrow();

            let parent_node = parent.as_ref().and_then(|parent| {
                let node = parent.upgrade()?.borrow().node.clone();
                Some(node)
            });

            edges.push(Edge {
                id: node.id(),
                from: parent_node,
                to: node.clone(),
                info: info.clone(),
            })
        });

        edges
    }

    pub fn child_nodes(&self) -> Option<Vec<RcBox<N>>> {
        let nodes = self
            .borrow()
            .children
            .as_ref()?
            .values()
            .map(|child| child.borrow().node.clone())
            .collect();
        Some(nodes)
    }

    pub fn sibling_nodes(&self) -> Option<Vec<RcBox<N>>> {
        self.borrow().parent.as_ref()?.upgrade()?.child_nodes()
    }

    /// # Generate [Store] for [RcTree]
    ///
    /// # [Errors](super::store::Insert)
    /// [ID] can not [repeat().
    pub fn store(&self) -> Store<N, I> {
        let mut store = Store::default();

        self.traverse(&mut |cursor| {
            let Relation {
                parent,
                node,
                info,
                ..
            } = &*cursor.borrow();

            store.insert(node.id(), cursor.clone()).unwrap();

            let parent_node = parent.as_ref().and_then(|parent| {
                Some(parent.upgrade()?.borrow().node.clone())
            });

            let edge = Edge {
                id: node.id(),
                from: parent_node,
                to: node.clone(),
                info: info.clone(),
            };

            store.insert(node.id(), edge).unwrap();
        });

        store
    }
}

impl<N, I> Identity for Relation<N, I>
where
    N: Identity,
{
    fn id(&self) -> ID {
        self.node.id()
    }
}

impl<N, I> From<Tree<N, I>> for RcTree<N, I>
where
    N: Identity,
{
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
