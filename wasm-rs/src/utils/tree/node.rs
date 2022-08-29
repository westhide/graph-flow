use std::{cell::RefCell, rc::Rc};

use serde::{Deserialize, Serialize};

use super::id::{Identity, ID};

#[derive(Debug, Serialize, Deserialize)]
pub struct Node<T> {
    id: ID,
    pub value: RefCell<T>,
}

impl<T> Node<T> {
    pub fn new(value: T) -> Self {
        let id = ID::default();
        let value = RefCell::new(value);

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
