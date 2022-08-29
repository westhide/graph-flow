use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::{
    edge::Edge,
    id::{Identity, ID},
    store::{Store, StoreGenerator},
};

type Children<N, I> = Option<Vec<Tree<N, I>>>;

/// parent-children [Tree]
#[derive(Debug, Serialize, Deserialize)]
pub struct Tree<N, I> {
    pub node: N,
    pub info: I,
    pub children: Children<N, I>,
}

impl<N, I> Tree<N, I> {
    pub fn new(node: N, info: I, children: Children<N, I>) -> Self {
        Self {
            node,
            info,
            children,
        }
    }

    pub fn transform<N2, I2, F>(self, func: &mut F) -> Tree<N2, I2>
    where
        F: FnMut(N, I) -> (N2, I2),
    {
        let Self {
            node,
            info,
            children,
        } = self;

        let (node, info) = (*func)(node, info);
        let children = children.map(|children| {
            children
                .into_iter()
                .map(|child| child.transform(func))
                .collect()
        });
        Tree::new(node, info, children)
    }

    pub fn relations<'a>(&'a self, parent: &'a N) -> Vec<(&N, Edge<&N, &I>)>
    where
        N: Identity,
    {
        let Self {
            node,
            info,
            children,
        } = self;

        let id = parent.id() + "," + node.id();

        let edge = Edge::new(id, parent, node, info);
        let item = (node, edge);

        if let Some(children) = children {
            let mut list: Vec<(&N, Edge<&N, &I>)> = children
                .iter()
                .map(|child| child.relations(node))
                .flatten()
                .collect();
            list.push(item);
            list
        } else {
            vec![item]
        }
    }

    pub fn get_nodes(&self) -> Vec<&N>
    where
        N: Identity,
    {
        let Self { node, .. } = self;

        self.relations(node)
            .into_iter()
            .map(|(node, _)| node)
            .collect()
    }

    pub fn get_edges(&self) -> Vec<Edge<&N, &I>>
    where
        N: Identity,
    {
        let Self { node: root, .. } = self;
        let mut relations = self.relations(root);
        relations.pop();

        relations.into_iter().map(|(_, edge)| edge).collect()
    }
}

impl<N, I> StoreGenerator<ID, N, I> for Tree<N, I>
where
    N: Identity + Clone,
    I: Clone,
{
    fn gen_store(&self) -> Store<ID, N, I> {
        let Self { node: root, .. } = self;
        let mut relations = self.relations(root);
        relations.pop();

        let mut nodes_map = HashMap::new();
        let mut edges_map = HashMap::new();

        nodes_map.insert(root.id(), root.clone());

        for (node, edge) in relations {
            nodes_map.insert(node.id(), node.clone());

            let edge = Edge::inner_clone(edge);
            edges_map.insert(edge.id(), edge);
        }

        Store::new(nodes_map, edges_map)
    }
}
