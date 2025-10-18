package services

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheService struct {
	client *redis.Client
}

func NewCacheService(client *redis.Client) *CacheService {
	return &CacheService{
		client: client,
	}
}

// Set stores a value in cache with expiration
func (s *CacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return s.client.Set(ctx, key, data, expiration).Err()
}

// Get retrieves a value from cache
func (s *CacheService) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := s.client.Get(ctx, key).Bytes()
	if err != nil {
		return err
	}
	return json.Unmarshal(data, dest)
}

// Delete removes a key from cache
func (s *CacheService) Delete(ctx context.Context, key string) error {
	return s.client.Del(ctx, key).Err()
}

// Exists checks if a key exists
func (s *CacheService) Exists(ctx context.Context, key string) (bool, error) {
	count, err := s.client.Exists(ctx, key).Result()
	return count > 0, err
}

// Increment increments a counter
func (s *CacheService) Increment(ctx context.Context, key string) (int64, error) {
	return s.client.Incr(ctx, key).Result()
}

// ZAdd adds a member to a sorted set
func (s *CacheService) ZAdd(ctx context.Context, key string, score float64, member string) error {
	return s.client.ZAdd(ctx, key, redis.Z{
		Score:  score,
		Member: member,
	}).Err()
}

// ZRangeWithScores retrieves a range from sorted set with scores
func (s *CacheService) ZRangeWithScores(ctx context.Context, key string, start, stop int64) ([]redis.Z, error) {
	return s.client.ZRangeWithScores(ctx, key, start, stop).Result()
}

// ZRevRangeWithScores retrieves a range from sorted set in reverse order with scores
func (s *CacheService) ZRevRangeWithScores(ctx context.Context, key string, start, stop int64) ([]redis.Z, error) {
	return s.client.ZRevRangeWithScores(ctx, key, start, stop).Result()
}

// ZRank gets the rank of a member in sorted set
func (s *CacheService) ZRank(ctx context.Context, key, member string) (int64, error) {
	return s.client.ZRank(ctx, key, member).Result()
}

// ZRevRank gets the reverse rank of a member in sorted set
func (s *CacheService) ZRevRank(ctx context.Context, key, member string) (int64, error) {
	return s.client.ZRevRank(ctx, key, member).Result()
}

// ZScore gets the score of a member in sorted set
func (s *CacheService) ZScore(ctx context.Context, key, member string) (float64, error) {
	return s.client.ZScore(ctx, key, member).Result()
}

// Publish publishes a message to a channel
func (s *CacheService) Publish(ctx context.Context, channel string, message interface{}) error {
	data, err := json.Marshal(message)
	if err != nil {
		return err
	}
	return s.client.Publish(ctx, channel, data).Err()
}

// Subscribe subscribes to a channel
func (s *CacheService) Subscribe(ctx context.Context, channel string) *redis.PubSub {
	return s.client.Subscribe(ctx, channel)
}
