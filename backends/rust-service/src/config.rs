use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub port: u16,
    pub supabase_url: String,
    pub supabase_anon_key: String,
    pub supabase_jwt_secret: String,
    pub redis_url: String,
    pub database_url: String,
    pub environment: String,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        dotenv::dotenv().ok();

        Ok(Config {
            port: env::var("PORT")
                .unwrap_or_else(|_| "8081".to_string())
                .parse()
                .unwrap_or(8081),
            supabase_url: env::var("SUPABASE_URL")
                .unwrap_or_default(),
            supabase_anon_key: env::var("SUPABASE_ANON_KEY")
                .unwrap_or_default(),
            supabase_jwt_secret: env::var("SUPABASE_JWT_SECRET")
                .unwrap_or_default(),
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_default(),
            environment: env::var("ENVIRONMENT")
                .unwrap_or_else(|_| "development".to_string()),
        })
    }
}
