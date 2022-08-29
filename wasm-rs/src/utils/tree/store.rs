use std::{collections::HashMap, hash::Hash};

use serde::{Deserialize, Serialize};

use super::edge::Edge;

/// Store nodes and relations.
/// **Use [Weak] reference in [Relation].**
#[derive(Debug, Serialize, Deserialize)]
pub struct Store<K, N, I>
where
    K: Eq + Hash,
{
    pub nodes: HashMap<K, N>,

    pub edges: HashMap<K, Edge<N, I>>,
}

impl<K, N, I> Store<K, N, I>
where
    K: Eq + Hash,
{
    pub fn new(nodes: HashMap<K, N>, edges: HashMap<K, Edge<N, I>>) -> Self {
        Self { nodes, edges }
    }
}

pub trait StoreGenerator<K, N, I>
where
    K: Eq + Hash,
{
    fn gen_store(&self) -> Store<K, N, I>;
}
