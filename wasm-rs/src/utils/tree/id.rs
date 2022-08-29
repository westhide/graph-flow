use std::{ops::Add, rc::Rc};

use nanoid::nanoid;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone)]
pub struct ID(Rc<String>);

impl ID {
    pub fn new(id: &str) -> Self {
        let id = Rc::new(id.to_string());
        Self(id)
    }
}

impl Default for ID {
    fn default() -> Self {
        let id = nanoid!(10);
        Self(Rc::new(id))
    }
}

impl Add for ID {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        let id = format!("{}{}", self.0, rhs.0);
        Self(Rc::new(id))
    }
}

impl Add<&str> for ID {
    type Output = Self;

    fn add(self, rhs: &str) -> Self::Output {
        let id = format!("{}{}", self.0, rhs);
        Self(Rc::new(id))
    }
}

pub trait Identity {
    fn id(&self) -> ID;
}
