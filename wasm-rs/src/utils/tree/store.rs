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
    pub relations: Map<ID, RcTree<N, I>>,

    pub edges: Map<ID, RcEdge<N, I>>,
}

impl<N, I> Store<N, I>
where
    N: Identity,
{
    pub fn node(&self, id: &str) -> Option<&RcBox<N>> {
        let id = ID::from(id);
        let edge = self.edges.get(&id)?;
        Some(&edge.to)
    }

    pub fn parent_node(&self, id: &str) -> Option<&RcBox<N>> {
        let id = ID::from(id);
        let edge = self.edges.get(&id)?;
        Some(&edge.from)
    }

    pub fn edge(&self, id: &str) -> Option<&RcEdge<N, I>> {
        let id = ID::from(id);
        self.edges.get(&id)
    }

    pub fn relation(&self, id: &str) -> Option<&RcTree<N, I>> {
        let id = ID::from(id);
        self.relations.get(&id)
    }

    pub fn sibling_nodes(&self, id: &str) -> Option<Vec<RcBox<N>>> {
        let id = ID::from(id);
        let parent_id = self.parent_node(&id)?.borrow().id();
        let relation = self.relations.get(&parent_id)?;
        relation.sibling_nodes()
    }
}

impl<N, I> Default for Store<N, I> {
    fn default() -> Self {
        let relations = Map::new();
        let edges = Map::new();

        Self { relations, edges }
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
        Ok(self.relations.try_insert(key, value)?)
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
