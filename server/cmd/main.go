package main

import (
	"github.com/HarshithRajesh/creeo/internal/api"
	"github.com/HarshithRajesh/creeo/internal/config"
	"github.com/HarshithRajesh/creeo/internal/repository"
	"github.com/HarshithRajesh/creeo/internal/service"
	"github.com/gin-gonic/gin"
)

func health(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Health check Done!!"})
}

func main() {
	db := config.ConnectDB()

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := api.NewUserHandler(userService)

	router := gin.Default()
	router.GET("/health", health)
	router.POST("/profile/create", userHandler.CreateProfile)
	router.GET("/profile", userHandler.GetProfile)
	router.POST("/location", userHandler.Location)
	router.GET("/nearby", userHandler.GetNearbyProfiles)
	router.Run()
}
