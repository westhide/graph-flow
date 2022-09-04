use super::{rc_tree::RcTree, Tree};

pub struct RcTreeIterator<N, I> {
    pub stack: Vec<RcTree<N, I>>,
}

impl<N, I> Iterator for RcTreeIterator<N, I> {
    type Item = RcTree<N, I>;

    fn next(&mut self) -> Option<Self::Item> {
        let item = self.stack.pop()?;

        if let Some(children) = &item.borrow().children {
            let cursors = children.values().map(|child| child.clone());
            self.stack.extend(cursors);
        };

        Some(item)
    }
}

pub struct TreeIterator<'a, N, I> {
    pub stack: Vec<&'a Tree<N, I>>,
}

impl<'a, N, I> Iterator for TreeIterator<'a, N, I> {
    type Item = &'a Tree<N, I>;

    fn next(&mut self) -> Option<Self::Item> {
        let item = self.stack.pop()?;

        if let Some(children) = &item.children {
            self.stack.extend(children)
        }

        Some(item)
    }
}
