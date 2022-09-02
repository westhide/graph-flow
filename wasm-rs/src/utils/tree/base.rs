use serde::{Deserialize, Serialize};

use super::{
    rc_box::RcBox,
    rc_tree::{Parent, RcTree, Relation},
};

/// # [Tree] structure
#[derive(Debug, Serialize, Deserialize)]
pub struct Tree<N, I> {
    pub node: N,
    pub info: I,
    pub children: Option<Vec<Tree<N, I>>>,
}

impl<N, I> Tree<N, I> {
    pub fn new(node: N, info: I, children: Option<Vec<Tree<N, I>>>) -> Self {
        Self {
            node,
            info,
            children,
        }
    }
}

impl<N, I> Tree<N, I> {
    fn _transform<N2, I2, F>(
        self,
        func: &mut F,
        parent: Parent<N2, I2>,
    ) -> RcTree<N2, I2>
    where
        F: FnMut(N, I) -> (N2, I2),
    {
        let Self {
            node,
            info,
            children,
        } = self;

        let (node, info) = (*func)(node, info);
        let node = RcBox::new(node);
        let info = RcBox::new(info);

        let rc_tree = RcBox::new(Relation {
            parent,
            node,
            info,
            children: None,
        });

        if let Some(children) = children {
            let rc_children = children
                .into_iter()
                .map(|child| child._transform(func, Some(rc_tree.weak())))
                .collect();

            rc_tree.borrow_mut().children = Some(rc_children)
        }

        rc_tree
    }

    pub fn transform<N2, I2, F>(self, func: &mut F) -> RcTree<N2, I2>
    where
        F: FnMut(N, I) -> (N2, I2),
    {
        self._transform(func, None)
    }
}
