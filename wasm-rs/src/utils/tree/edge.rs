use serde::{Deserialize, Serialize};

use super::id::{Identity, ID};
/// [Edge] between node.
///
/// from<sup>NodeA</sup> --\[[info](I)]--> to<sup>NodeB</sup>
#[derive(Debug, Serialize, Deserialize)]
pub struct Edge<N, I> {
    id: ID,
    pub from: N,
    pub to: N,
    pub info: I,
}

impl<N, I> Edge<N, I> {
    pub fn new(id: ID, from: N, to: N, info: I) -> Self {
        Self { id, from, to, info }
    }

    pub fn inner_clone(edge: Edge<&N, &I>) -> Edge<N, I>
    where
        N: Clone,
        I: Clone,
    {
        let Edge { id, from, to, info } = edge;
        let from = from.clone();
        let to = to.clone();
        let info = info.clone();
        Self::new(id, from, to, info)
    }
}

impl<N, I> Identity for Edge<N, I> {
    fn id(&self) -> ID {
        self.id.clone()
    }
}
