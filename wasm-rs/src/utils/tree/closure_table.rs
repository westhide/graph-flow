/// # [ClosureTable]
#[derive(Default)]
pub struct ClosureTable<N, I> {
    pub ancestor: N,
    pub descendant: N,
    pub distance: u32,
    pub depth: u32,

    pub info: I,
}

impl<N, I> ClosureTable<N, I> {}
