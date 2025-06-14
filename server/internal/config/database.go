package config

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}
}

func ConnectDB() {
	conn := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgre", conn)
	if err != nil {
		log.Fatalf("Failed to connect to the database %v", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("Unable to connect to database %v", err)
	}
	log.Println("Database connected !!!!!!!!!!!")
	return db
}
