package load

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/yourusername/health-competition-go/internal/models"
)

// LoadTestConfig holds configuration for load testing
type LoadTestConfig struct {
	BaseURL           string
	NumUsers          int
	RequestsPerUser   int
	ConcurrentUsers   int
	RampUpTime        time.Duration
	TestDuration      time.Duration
	AuthToken         string
	CompetitionID     string
}

// LoadTestResult holds the results of a load test
type LoadTestResult struct {
	TotalRequests    int64
	SuccessRequests  int64
	FailedRequests   int64
	TotalDuration    time.Duration
	AvgResponseTime  time.Duration
	MinResponseTime  time.Duration
	MaxResponseTime  time.Duration
	RequestsPerSec   float64
	ErrorRate        float64
	ResponseTimes    []time.Duration
}

// LoadTester performs load testing on the API
type LoadTester struct {
	config  LoadTestConfig
	client  *http.Client
	results LoadTestResult
	mu      sync.Mutex
}

// NewLoadTester creates a new load tester
func NewLoadTester(config LoadTestConfig) *LoadTester {
	return &LoadTester{
		config: config,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		results: LoadTestResult{
			MinResponseTime: time.Hour, // Initialize with large value
			ResponseTimes:   make([]time.Duration, 0),
		},
	}
}

// Run executes the load test
func (lt *LoadTester) Run() (*LoadTestResult, error) {
	fmt.Printf("Starting load test with %d users, %d requests per user\n",
		lt.config.NumUsers, lt.config.RequestsPerUser)

	startTime := time.Now()
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, lt.config.ConcurrentUsers)

	var totalRequests int64
	var successRequests int64
	var failedRequests int64

	for i := 0; i < lt.config.NumUsers; i++ {
		wg.Add(1)

		// Ramp up gradually
		if lt.config.RampUpTime > 0 {
			delay := lt.config.RampUpTime / time.Duration(lt.config.NumUsers)
			time.Sleep(delay)
		}

		go func(userIndex int) {
			defer wg.Done()

			for j := 0; j < lt.config.RequestsPerUser; j++ {
				semaphore <- struct{}{} // Acquire

				atomic.AddInt64(&totalRequests, 1)

				// Make request
				success, responseTime := lt.makeRequest(userIndex, j)

				if success {
					atomic.AddInt64(&successRequests, 1)
				} else {
					atomic.AddInt64(&failedRequests, 1)
				}

				lt.recordResponseTime(responseTime)

				<-semaphore // Release
			}
		}(i)
	}

	wg.Wait()
	totalDuration := time.Since(startTime)

	// Calculate results
	lt.results.TotalRequests = totalRequests
	lt.results.SuccessRequests = successRequests
	lt.results.FailedRequests = failedRequests
	lt.results.TotalDuration = totalDuration
	lt.results.RequestsPerSec = float64(totalRequests) / totalDuration.Seconds()
	lt.results.ErrorRate = float64(failedRequests) / float64(totalRequests) * 100

	// Calculate average response time
	var totalResponseTime time.Duration
	for _, rt := range lt.results.ResponseTimes {
		totalResponseTime += rt
	}
	if len(lt.results.ResponseTimes) > 0 {
		lt.results.AvgResponseTime = totalResponseTime / time.Duration(len(lt.results.ResponseTimes))
	}

	return &lt.results, nil
}

// makeRequest makes a single API request
func (lt *LoadTester) makeRequest(userIndex, requestIndex int) (bool, time.Duration) {
	userID := fmt.Sprintf("load-test-user-%d", userIndex)

	req := models.ScoreUpdateRequest{
		UserID:        userID,
		CompetitionID: lt.config.CompetitionID,
		Steps:         int64((userIndex + requestIndex) * 1000),
		Distance:      float64(userIndex+requestIndex) * 0.8,
		Calories:      float64((userIndex + requestIndex) * 50),
	}

	body, err := json.Marshal(req)
	if err != nil {
		return false, 0
	}

	url := lt.config.BaseURL + "/api/v1/leaderboard/update"
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return false, 0
	}

	httpReq.Header.Set("Authorization", "Bearer "+lt.config.AuthToken)
	httpReq.Header.Set("Content-Type", "application/json")

	start := time.Now()
	resp, err := lt.client.Do(httpReq)
	responseTime := time.Since(start)

	if err != nil {
		return false, responseTime
	}
	defer resp.Body.Close()

	success := resp.StatusCode >= 200 && resp.StatusCode < 300
	return success, responseTime
}

// recordResponseTime records a response time
func (lt *LoadTester) recordResponseTime(rt time.Duration) {
	lt.mu.Lock()
	defer lt.mu.Unlock()

	lt.results.ResponseTimes = append(lt.results.ResponseTimes, rt)

	if rt < lt.results.MinResponseTime {
		lt.results.MinResponseTime = rt
	}
	if rt > lt.results.MaxResponseTime {
		lt.results.MaxResponseTime = rt
	}
}

// PrintResults prints the load test results
func (lt *LoadTester) PrintResults() {
	fmt.Println("\n=== Load Test Results ===")
	fmt.Printf("Total Requests:     %d\n", lt.results.TotalRequests)
	fmt.Printf("Successful:         %d\n", lt.results.SuccessRequests)
	fmt.Printf("Failed:             %d\n", lt.results.FailedRequests)
	fmt.Printf("Total Duration:     %v\n", lt.results.TotalDuration)
	fmt.Printf("Requests/sec:       %.2f\n", lt.results.RequestsPerSec)
	fmt.Printf("Error Rate:         %.2f%%\n", lt.results.ErrorRate)
	fmt.Printf("Avg Response Time:  %v\n", lt.results.AvgResponseTime)
	fmt.Printf("Min Response Time:  %v\n", lt.results.MinResponseTime)
	fmt.Printf("Max Response Time:  %v\n", lt.results.MaxResponseTime)

	// Calculate percentiles
	if len(lt.results.ResponseTimes) > 0 {
		p50 := lt.calculatePercentile(50)
		p95 := lt.calculatePercentile(95)
		p99 := lt.calculatePercentile(99)

		fmt.Printf("\nResponse Time Percentiles:\n")
		fmt.Printf("  P50: %v\n", p50)
		fmt.Printf("  P95: %v\n", p95)
		fmt.Printf("  P99: %v\n", p99)
	}
}

// calculatePercentile calculates the given percentile
func (lt *LoadTester) calculatePercentile(percentile int) time.Duration {
	if len(lt.results.ResponseTimes) == 0 {
		return 0
	}

	// Sort response times
	times := make([]time.Duration, len(lt.results.ResponseTimes))
	copy(times, lt.results.ResponseTimes)

	// Simple bubble sort (good enough for testing)
	for i := 0; i < len(times); i++ {
		for j := i + 1; j < len(times); j++ {
			if times[i] > times[j] {
				times[i], times[j] = times[j], times[i]
			}
		}
	}

	index := (percentile * len(times)) / 100
	if index >= len(times) {
		index = len(times) - 1
	}

	return times[index]
}

// Example usage function
func RunLoadTest() {
	config := LoadTestConfig{
		BaseURL:         "http://localhost:8080",
		NumUsers:        100,
		RequestsPerUser: 10,
		ConcurrentUsers: 20,
		RampUpTime:      5 * time.Second,
		AuthToken:       "your-test-jwt-token",
		CompetitionID:   "load-test-comp",
	}

	tester := NewLoadTester(config)
	results, err := tester.Run()

	if err != nil {
		fmt.Printf("Load test failed: %v\n", err)
		return
	}

	tester.PrintResults()

	// Check if performance meets requirements
	if results.RequestsPerSec < 100 {
		fmt.Println("\n⚠️  WARNING: Requests per second below target (100)")
	}

	if results.AvgResponseTime > 100*time.Millisecond {
		fmt.Println("\n⚠️  WARNING: Average response time above target (100ms)")
	}

	if results.ErrorRate > 1.0 {
		fmt.Println("\n⚠️  WARNING: Error rate above acceptable threshold (1%)")
	}
}
