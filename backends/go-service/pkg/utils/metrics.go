package utils

import (
	"net/http"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Metrics holds all Prometheus metrics
type Metrics struct {
	// HTTP metrics
	HTTPRequestsTotal   *prometheus.CounterVec
	HTTPRequestDuration *prometheus.HistogramVec
	HTTPRequestSize     *prometheus.HistogramVec
	HTTPResponseSize    *prometheus.HistogramVec

	// Business metrics
	LeaderboardUpdates  prometheus.Counter
	FitnessDataSyncs    prometheus.Counter
	WebSocketConnections prometheus.Gauge
	CacheHits           prometheus.Counter
	CacheMisses         prometheus.Counter

	// Database metrics
	DBConnectionsActive prometheus.Gauge
	DBQueryDuration     *prometheus.HistogramVec

	// External API metrics
	ExternalAPICallsTotal    *prometheus.CounterVec
	ExternalAPICallsDuration *prometheus.HistogramVec
}

// NewMetrics creates and registers all Prometheus metrics
func NewMetrics() *Metrics {
	return &Metrics{
		HTTPRequestsTotal: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "http_requests_total",
				Help: "Total number of HTTP requests",
			},
			[]string{"method", "endpoint", "status"},
		),
		HTTPRequestDuration: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "http_request_duration_seconds",
				Help:    "HTTP request duration in seconds",
				Buckets: prometheus.DefBuckets,
			},
			[]string{"method", "endpoint"},
		),
		HTTPRequestSize: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "http_request_size_bytes",
				Help:    "HTTP request size in bytes",
				Buckets: prometheus.ExponentialBuckets(100, 10, 8),
			},
			[]string{"method", "endpoint"},
		),
		HTTPResponseSize: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "http_response_size_bytes",
				Help:    "HTTP response size in bytes",
				Buckets: prometheus.ExponentialBuckets(100, 10, 8),
			},
			[]string{"method", "endpoint"},
		),
		LeaderboardUpdates: promauto.NewCounter(
			prometheus.CounterOpts{
				Name: "leaderboard_updates_total",
				Help: "Total number of leaderboard updates",
			},
		),
		FitnessDataSyncs: promauto.NewCounter(
			prometheus.CounterOpts{
				Name: "fitness_data_syncs_total",
				Help: "Total number of fitness data syncs",
			},
		),
		WebSocketConnections: promauto.NewGauge(
			prometheus.GaugeOpts{
				Name: "websocket_connections_active",
				Help: "Number of active WebSocket connections",
			},
		),
		CacheHits: promauto.NewCounter(
			prometheus.CounterOpts{
				Name: "cache_hits_total",
				Help: "Total number of cache hits",
			},
		),
		CacheMisses: promauto.NewCounter(
			prometheus.CounterOpts{
				Name: "cache_misses_total",
				Help: "Total number of cache misses",
			},
		),
		DBConnectionsActive: promauto.NewGauge(
			prometheus.GaugeOpts{
				Name: "db_connections_active",
				Help: "Number of active database connections",
			},
		),
		DBQueryDuration: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "db_query_duration_seconds",
				Help:    "Database query duration in seconds",
				Buckets: prometheus.DefBuckets,
			},
			[]string{"query_type"},
		),
		ExternalAPICallsTotal: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "external_api_calls_total",
				Help: "Total number of external API calls",
			},
			[]string{"service", "status"},
		),
		ExternalAPICallsDuration: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "external_api_calls_duration_seconds",
				Help:    "External API call duration in seconds",
				Buckets: prometheus.DefBuckets,
			},
			[]string{"service"},
		),
	}
}

// RecordHTTPRequest records HTTP request metrics
func (m *Metrics) RecordHTTPRequest(method, endpoint string, status int, duration time.Duration) {
	m.HTTPRequestsTotal.WithLabelValues(method, endpoint, strconv.Itoa(status)).Inc()
	m.HTTPRequestDuration.WithLabelValues(method, endpoint).Observe(duration.Seconds())
}

// RecordHTTPRequestSize records HTTP request size
func (m *Metrics) RecordHTTPRequestSize(method, endpoint string, size int64) {
	m.HTTPRequestSize.WithLabelValues(method, endpoint).Observe(float64(size))
}

// RecordHTTPResponseSize records HTTP response size
func (m *Metrics) RecordHTTPResponseSize(method, endpoint string, size int64) {
	m.HTTPResponseSize.WithLabelValues(method, endpoint).Observe(float64(size))
}

// Handler returns the Prometheus HTTP handler
func (m *Metrics) Handler() http.Handler {
	return promhttp.Handler()
}
