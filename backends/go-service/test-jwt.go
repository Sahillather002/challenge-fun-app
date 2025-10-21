package main

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("🔐 JWT Token Validation Test")
	fmt.Println("============================")

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("⚠️  Could not load .env file: %v", err)
	}

	jwtSecret := os.Getenv("SUPABASE_JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("❌ SUPABASE_JWT_SECRET not found in environment")
	}

	fmt.Printf("🔑 JWT Secret configured: %s\n", jwtSecret[:min(20, len(jwtSecret))] + "...")

	// This is a sample token structure that Supabase might generate
	// You'll need to get a real token from your frontend after login
	fmt.Println("\n📝 To test with a real token:")
	fmt.Println("1. Login to your web app")
	fmt.Println("2. Open browser dev tools > Network tab")
	fmt.Println("3. Make a request to any API endpoint")
	fmt.Println("4. Copy the Authorization header value")
	fmt.Println("5. The token should start with 'Bearer eyJ...'")

	fmt.Println("\n🔧 Common JWT Secret Issues:")
	fmt.Println("1. Using 'anon key' instead of 'JWT Secret'")
	fmt.Println("2. Copying wrong value from Supabase dashboard")
	fmt.Println("3. Extra spaces or characters in the secret")

	fmt.Println("\n💡 Get JWT Secret from:")
	fmt.Println("Supabase Dashboard > Settings > API > JWT Secret")
}
