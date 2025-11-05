package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("🔍 Supabase Storage Configuration Test")
	fmt.Println("========================================")

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("⚠️  Warning: .env file not found")
		fmt.Println("   Looking for environment variables in system...")
	} else {
		fmt.Println("✅ .env file loaded")
	}

	fmt.Println()

	// Check required environment variables
	requiredVars := map[string]string{
		"SUPABASE_URL":              os.Getenv("SUPABASE_URL"),
		"SUPABASE_SERVICE_ROLE_KEY": os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		"SUPABASE_STORAGE_BUCKET":   os.Getenv("SUPABASE_STORAGE_BUCKET"),
		"DATABASE_URL":              os.Getenv("DATABASE_URL"),
	}

	allPresent := true
	for key, value := range requiredVars {
		if value == "" {
			fmt.Printf("❌ %s: NOT SET\n", key)
			allPresent = false
		} else {
			// Mask sensitive values
			displayValue := value
			if key == "SUPABASE_SERVICE_ROLE_KEY" || key == "DATABASE_URL" {
				if len(value) > 20 {
					displayValue = value[:10] + "..." + value[len(value)-10:]
				} else {
					displayValue = "***"
				}
			}
			fmt.Printf("✅ %s: %s\n", key, displayValue)
		}
	}

	fmt.Println()

	if !allPresent {
		fmt.Println("❌ CONFIGURATION INCOMPLETE")
		fmt.Println()
		fmt.Println("📋 Next Steps:")
		fmt.Println("1. Copy env.template to .env")
		fmt.Println("2. Fill in your Supabase credentials")
		fmt.Println("3. Run this test again")
		fmt.Println()
		fmt.Println("Get your credentials from:")
		fmt.Println("https://app.supabase.com → Your Project → Settings → API")
		os.Exit(1)
	}

	fmt.Println("✅ ALL REQUIRED VARIABLES ARE SET")
	fmt.Println()

	// Test Supabase URL format
	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL != "" {
		fmt.Println("🔗 Testing Supabase URL format...")

		// Extract project ref from URL
		// Format: https://[project-ref].supabase.co
		if len(supabaseURL) > 8 && supabaseURL[:8] == "https://" {
			projectRef := supabaseURL[8:]
			if len(projectRef) > 12 && projectRef[len(projectRef)-12:] == ".supabase.co" {
				projectID := projectRef[:len(projectRef)-12]
				fmt.Printf("   Project ID: %s\n", projectID)
				fmt.Println("   ✅ URL format looks correct")
			} else {
				fmt.Println("   ⚠️  URL format may be incorrect")
				fmt.Println("   Expected: https://[project-ref].supabase.co")
			}
		} else {
			fmt.Println("   ⚠️  URL should start with https://")
		}
	}

	fmt.Println()
	fmt.Println("📋 Next Steps:")
	fmt.Println("1. Go to Supabase Dashboard → Storage")
	fmt.Println("2. Create a bucket named 'avatars'")
	fmt.Println("3. Set the bucket to PUBLIC")
	fmt.Println("4. Run the SQL script: setup-avatar-storage.sql")
	fmt.Println("5. Start the Go backend: go run cmd/server/main.go")
	fmt.Println("6. Test avatar upload in the web app")
	fmt.Println()
	fmt.Println("✅ Configuration test complete!")
}
