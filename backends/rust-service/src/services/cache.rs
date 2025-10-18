use redis::{aio::ConnectionManager, AsyncCommands, Client};
use serde::{de::DeserializeOwned, Serialize};
use std::time::Duration;

pub async fn create_redis_client(url: &str) -> Result<ConnectionManager, redis::RedisError> {
    let client = Client::open(url)?;
    let manager = ConnectionManager::new(client).await?;
    Ok(manager)
}

#[derive(Clone)]
pub struct CacheService {
    client: ConnectionManager,
}

impl CacheService {
    pub fn new(client: ConnectionManager) -> Self {
        Self { client }
    }

    pub async fn set<T: Serialize>(
        &self,
        key: &str,
        value: &T,
        expiration: Duration,
    ) -> Result<(), redis::RedisError> {
        let mut conn = self.client.clone();
        let data = serde_json::to_string(value).map_err(|e| {
            redis::RedisError::from((
                redis::ErrorKind::TypeError,
                "Serialization error",
                e.to_string(),
            ))
        })?;
        
        conn.set_ex(key, data, expiration.as_secs() as usize).await
    }

    pub async fn get<T: DeserializeOwned>(&self, key: &str) -> Result<T, redis::RedisError> {
        let mut conn = self.client.clone();
        let data: String = conn.get(key).await?;
        serde_json::from_str(&data).map_err(|e| {
            redis::RedisError::from((
                redis::ErrorKind::TypeError,
                "Deserialization error",
                e.to_string(),
            ))
        })
    }

    pub async fn delete(&self, key: &str) -> Result<(), redis::RedisError> {
        let mut conn = self.client.clone();
        conn.del(key).await
    }

    pub async fn exists(&self, key: &str) -> Result<bool, redis::RedisError> {
        let mut conn = self.client.clone();
        conn.exists(key).await
    }

    pub async fn zadd(&self, key: &str, score: f64, member: &str) -> Result<(), redis::RedisError> {
        let mut conn = self.client.clone();
        conn.zadd(key, member, score).await
    }

    pub async fn zrevrange_withscores(
        &self,
        key: &str,
        start: isize,
        stop: isize,
    ) -> Result<Vec<(String, f64)>, redis::RedisError> {
        let mut conn = self.client.clone();
        conn.zrevrange_withscores(key, start, stop).await
    }

    pub async fn zrevrank(&self, key: &str, member: &str) -> Result<Option<isize>, redis::RedisError> {
        let mut conn = self.client.clone();
        conn.zrevrank(key, member).await
    }

    pub async fn zscore(&self, key: &str, member: &str) -> Result<Option<f64>, redis::RedisError> {
        let mut conn = self.client.clone();
        conn.zscore(key, member).await
    }

    pub async fn zcard(&self, key: &str) -> Result<i32, redis::RedisError> {
        let mut conn = self.client.clone();
        conn.zcard(key).await
    }

    pub async fn publish<T: Serialize>(
        &self,
        channel: &str,
        message: &T,
    ) -> Result<(), redis::RedisError> {
        let mut conn = self.client.clone();
        let data = serde_json::to_string(message).map_err(|e| {
            redis::RedisError::from((
                redis::ErrorKind::TypeError,
                "Serialization error",
                e.to_string(),
            ))
        })?;
        conn.publish(channel, data).await
    }
}
