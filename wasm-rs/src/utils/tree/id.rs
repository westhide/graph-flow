use std::{
    fmt::{Display, Formatter},
    ops::{Add, Deref},
    rc::Rc,
};

use nanoid::nanoid;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone)]
pub struct ID(Rc<String>);

impl ID {
    pub fn new(id: String) -> Self {
        let id = Rc::new(id);
        Self(id)
    }
}

impl From<&str> for ID {
    fn from(id: &str) -> Self {
        let id = id.to_string();
        Self::new(id)
    }
}

impl Deref for ID {
    type Target = Rc<String>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Default for ID {
    /// Generate id by [nanoid]
    ///
    /// # Safety
    /// May cause [ID collision probability](https://zelark.github.io/nano-id-cc/)
    fn default() -> Self {
        let id = nanoid!();
        Self::new(id)
    }
}

impl Display for ID {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Add for ID {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        let id = format!("{}{}", self.0, rhs.0);
        Self::new(id)
    }
}

impl Add<&str> for ID {
    type Output = Self;

    fn add(self, rhs: &str) -> Self::Output {
        let id = format!("{}{}", self.0, rhs);
        Self::new(id)
    }
}

pub trait Identity {
    fn id(&self) -> ID;
}
