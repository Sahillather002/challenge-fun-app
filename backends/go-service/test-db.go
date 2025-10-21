package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	fmt.Println("🔍 Supabase Database Connection Test")
	fmt.Println("==================================")

	// Load .env file if it exists
	err := godotenv.Load()
	if err != nil {
		log.Printf("⚠️  Could not load .env file: %v", err)
	}

	// Get DATABASE_URL
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("❌ DATABASE_URL environment variable is not set")
	}

	fmt.Printf("📋 DATABASE_URL: %s\n", databaseURL)

	// Parse connection details
	parts := strings.Split(databaseURL, "@")
	if len(parts) < 2 {
		log.Fatal("❌ Invalid DATABASE_URL format")
	}

	hostPart := parts[1]
	host := strings.Split(hostPart, ":")[0]

	fmt.Printf("🌐 Host: %s\n", host)
	fmt.Printf("🔒 SSL Mode: %s\n", checkSSLMode(databaseURL))

	// Test connection
	fmt.Println("\n🔌 Testing database connection...")

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("❌ Failed to open database connection: %v", err)
	}
	defer db.Close()

	// Ping the database
	err = db.Ping()
	if err != nil {
		fmt.Printf("❌ Failed to ping database: %v\n", err)
		fmt.Println("\n🔧 Troubleshooting tips:")
		fmt.Println("1. Check if your Supabase project exists")
		fmt.Println("2. Verify the hostname in your DATABASE_URL")
		fmt.Println("3. Check your internet connection")
		fmt.Println("4. Ensure your Supabase project is not paused")
		fmt.Println("5. Try using a local PostgreSQL database instead")
		os.Exit(1)
	}

	fmt.Println("✅ Database connection successful!")

	// Get database info
	var version string
	err = db.QueryRow("SELECT version()").Scan(&version)
	if err != nil {
		fmt.Printf("⚠️  Could not get database version: %v\n", err)
	} else {
		fmt.Printf("📊 Database Version: %s\n", version)
	}

	fmt.Println("\n🎉 Supabase connection test completed successfully!")
}

func checkSSLMode(url string) string {
	if strings.Contains(url, "sslmode=disable") {
		return "Disabled"
	} else if strings.Contains(url, "sslmode=require") {
		return "Required"
	} else if strings.Contains(url, "sslmode=") {
		return "Custom"
	}
	return "Default (prefer)"
}
