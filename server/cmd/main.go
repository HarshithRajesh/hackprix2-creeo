package main

import (
	"github.com/gin-gonic/gin"
)

func health(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Health check Done!!"})
}

func main() {
	router := gin.Default()
	router.GET("/health", health)
	router.Run()
}
