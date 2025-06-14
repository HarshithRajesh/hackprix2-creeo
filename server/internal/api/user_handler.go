package api

import (
	"net/http"

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
