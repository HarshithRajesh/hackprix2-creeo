package api

import (
	"log"
	"net/http"
	"strconv"

	"github.com/HarshithRajesh/creeo/internal/domain"
	"github.com/HarshithRajesh/creeo/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{userService}
}

func (h *UserHandler) CreateProfile(c *gin.Context) {
	var profile *domain.Profile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request Payload", "error message": err.Error()})
		return
	}
	err := h.userService.CreateProfile(profile)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to create the profile", "error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Profile created Successfully !!!"})
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	idStr := c.Query("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id didnt get converted to int", "Error message": err.Error()})
		return
	}
	prof, err := h.userService.GetProfile(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "didnt fetch the profile", "Error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": prof})
}

func (h *UserHandler) Location(c *gin.Context) {
	var loc *domain.Location

	if err := c.ShouldBindJSON(&loc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request Payload", "error": err.Error(),
		})
		return
	}

	err := h.userService.Location(loc)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Location updated"})
}

func (h *UserHandler) GetNearbyProfiles(c *gin.Context) {
	idStr := c.Query("id")
	radiusStr := c.Query("radius")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	radius, err := strconv.Atoi(radiusStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	profiles, err := h.userService.GetNearbyProfiles(id, radius)
	if err != nil {
		log.Printf("Error %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch nearby profiles", "Error messages:": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profiles)
}
