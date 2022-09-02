use std::{collections::hash_map::OccupiedError, fmt::Display};

/// # Tree [Result] generic type
pub type Result<T, E = Error> = std::result::Result<T, E>;

/// # Tree [Error]
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    Message(String),
}

impl<K, V> From<OccupiedError<'_, K, V>> for Error
where
    K: Display,
{
    fn from(err: OccupiedError<K, V>) -> Self {
        let key = err.entry.key();
        let message =
            format!("id:'{key}' already exist, cannot try insert twice");
        Error::Message(message)
    }
}
