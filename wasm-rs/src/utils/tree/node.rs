use std::{cell::RefCell, ops::Deref, rc::Rc};

use serde::{Deserialize, Serialize};

use super::id::{Identity, ID};

#[derive(Debug, Serialize, Deserialize)]
pub struct Node<T> {
    id: ID,
    value: T,
}

impl<T> Node<T> {
    pub fn new(value: T) -> Self {
        let id = ID::default();
        Self { id, value }
    }
}

impl<T> Deref for Node<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.value
    }
}

impl<T> From<T> for Node<T>
where
    T: Identity,
{
    fn from(value: T) -> Self {
        let id = value.id();
        Self { id, value }
    }
}

impl<T> Identity for Node<T> {
    fn id(&self) -> ID {
        self.id.clone()
    }
}

impl<T: Identity> Identity for Rc<T> {
    fn id(&self) -> ID {
        self.as_ref().id()
    }
}

impl<T: Identity> Identity for RefCell<T> {
    fn id(&self) -> ID {
        self.borrow().id()
    }
}
