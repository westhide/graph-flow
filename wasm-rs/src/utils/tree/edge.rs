use serde::{Deserialize, Serialize};

use super::id::{Identity, ID};

/// # [Edge] between node.
///
/// from<sup>NodeA</sup> --\[[info](I)]--> to<sup>NodeB</sup>
#[derive(Debug, Serialize, Deserialize)]
pub struct Edge<N1, N2, I> {
    pub id: ID,
    pub from: N1,
    pub to: N2,
    pub info: I,
}

impl<N1, N2, I> Identity for Edge<N1, N2, I> {
    fn id(&self) -> ID {
        self.id.clone()
    }
}
