use std::{
    cell::{Ref, RefCell, RefMut},
    ops::Deref,
    rc::{Rc, Weak},
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RcBox<T>(Rc<RefCell<T>>);

impl<T> RcBox<T> {
    pub fn new(value: T) -> Self {
        Self(Rc::new(RefCell::new(value)))
    }

    pub fn weak(&self) -> WeakBox<T> {
        let weak = Rc::downgrade(self);
        WeakBox(weak)
    }

    pub fn borrow(&self) -> Ref<T> {
        self.as_ref().borrow()
    }

    pub fn borrow_mut(&self) -> RefMut<T> {
        self.as_ref().borrow_mut()
    }
}

impl<T> Deref for RcBox<T> {
    type Target = Rc<RefCell<T>>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> Clone for RcBox<T> {
    fn clone(&self) -> Self {
        RcBox(self.0.clone())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WeakBox<T>(Weak<RefCell<T>>);

impl<T> WeakBox<T> {
    pub fn upgrade(&self) -> Option<RcBox<T>> {
        let rc = self.0.upgrade()?;
        Some(RcBox(rc))
    }
}

impl<T> Deref for WeakBox<T> {
    type Target = Weak<RefCell<T>>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
