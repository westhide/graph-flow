use super::Tree;

// TODO: generic_associated_types
pub trait AddChild<T = Self> {
    type Output;

    fn add_child(&mut self, child: T) -> Self::Output;
}

impl<N, I> AddChild for Tree<N, I> {
    type Output = ();

    fn add_child(&mut self, child: Self) -> Self::Output {
        let Self {
            children, ..
        } = self;

        if let Some(children) = children {
            children.push(child)
        } else {
            *children = Some(vec![child])
        }
    }
}
