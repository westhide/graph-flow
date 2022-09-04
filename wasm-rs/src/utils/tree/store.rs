use serde::{Deserialize, Serialize};

use super::{
    error::Result,
    id::{Identity, ID},
    rc_box::RcBox,
    rc_tree::{RcEdge, RcTree},
};

pub type Map<K, V> = ahash::AHashMap<K, V>;

/// # [Store]
#[derive(Debug, Serialize, Deserialize)]
pub struct Store<N, I> {
    pub cursors: Map<ID, RcTree<N, I>>,

    pub edges: Map<ID, RcEdge<N, I>>,
}

impl<N, I> Store<N, I>
where
    N: Identity,
{
    pub fn keys(&self) -> Vec<&ID> {
        self.cursors.keys().collect()
    }

    pub fn nodes(&self) -> Vec<&RcBox<N>> {
        self.edges.values().map(|edge| &edge.to).collect()
    }

    pub fn node(&self, id: &ID) -> Option<&RcBox<N>> {
        let edge = self.edges.get(id)?;
        Some(&edge.to)
    }

    pub fn parent_node(&self, id: &ID) -> Option<&RcBox<N>> {
        self.edges.get(id)?.from.as_ref()
    }

    pub fn edge(&self, id: &ID) -> Option<&RcEdge<N, I>> {
        self.edges.get(id)
    }

    pub fn cursor(&self, id: &ID) -> Option<&RcTree<N, I>> {
        self.cursors.get(id)
    }

    pub fn sibling_nodes(&self, id: &ID) -> Option<Vec<RcBox<N>>> {
        let cursor = self.cursors.get(id)?;
        cursor.sibling_nodes()
    }

    pub fn child_nodes(&self, id: &ID) -> Option<Vec<RcBox<N>>> {
        let cursor = self.cursors.get(id)?;
        cursor.child_nodes()
    }
}

impl<N, I> Default for Store<N, I> {
    fn default() -> Self {
        let cursors = Map::new();
        let edges = Map::new();

        Self {
            cursors,
            edges,
        }
    }
}

/// # Store [Insert] Trait
///
/// ---
pub trait Insert<V> {
    /// # Errors
    /// throw [OccupiedError](std::collections::hash_map::OccupiedError) if [key](ID) exist when **try_insert**
    fn insert(&mut self, key: ID, value: V) -> Result<&mut V>;
}

impl<N, I> Insert<RcTree<N, I>> for Store<N, I> {
    fn insert(
        &mut self,
        key: ID,
        value: RcTree<N, I>,
    ) -> Result<&mut RcTree<N, I>> {
        Ok(self.cursors.try_insert(key, value)?)
    }
}

impl<N, I> Insert<RcEdge<N, I>> for Store<N, I> {
    fn insert(
        &mut self,
        key: ID,
        value: RcEdge<N, I>,
    ) -> Result<&mut RcEdge<N, I>> {
        Ok(self.edges.try_insert(key, value)?)
    }
}
