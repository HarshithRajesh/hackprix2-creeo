package api

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/HarshithRajesh/creeo/internal/domain"
	"github.com/HarshithRajesh/creeo/internal/ml_client"
	"github.com/HarshithRajesh/creeo/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService service.UserService
	MLClient    *ml_client.Client
}

func NewUserHandler(userService service.UserService, mlClient *ml_client.Client) *UserHandler {
	return &UserHandler{
		userService: userService,
		MLClient:    mlClient,
	}
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

func (h *UserHandler) SmartProfileSearchHandler(c *gin.Context) {
	var req domain.SmartSearchRequest // Use the new request struct

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload: " + err.Error(),
		})
		return
	}

	// Get required 'query' parameter
	// Gin's binding:"required" will already handle this, but an explicit check is fine.
	if req.Query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query field is required in the request body"})
		return
	}

	// Defaults for Hyderabad (HITEC City) and radius
	// Use pointers for optional fields. If nil, use default.
	userLatitude := 13.4439
	userLongitude := 77.3892
	radiusMeters := 10000.0 // 10 km

	if req.UserLatitude != nil {
		userLatitude = *req.UserLatitude
	}
	if req.UserLongitude != nil {
		userLongitude = *req.UserLongitude
	}
	if req.RadiusMeters != nil {
		radiusMeters = *req.RadiusMeters
	}

	// Prepare request for ML service (this struct is what the Python service expects)
	mlRequest := domain.RAGSearchRequest{ // Ensure you're using ml_client.RAGSearchRequest
		Query:         req.Query,
		UserLatitude:  userLatitude,
		UserLongitude: userLongitude,
		RadiusMeters:  radiusMeters,
		Limit:         5, // Request top 5 profiles
	}

	// Call ML service using the injected MLClient
	ragResponse, err := h.MLClient.SearchProfiles(mlRequest)
	if err != nil {
		log.Printf("SmartProfileSearchHandler: Error calling ML service: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to get smart search results: %v", err.Error())})
		return
	}

	c.JSON(http.StatusOK, ragResponse)
}

func (h *UserHandler) ConnectProfile(c *gin.Context) {
	id1Str := c.Query("id1")
	id2Str := c.Query("id2")

	id1, err := strconv.Atoi(id1Str)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id 1"})
		return
	}
	id2, err := strconv.Atoi(id2Str)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id 2"})
		return
	}
	err = h.userService.ConnectProfile(id1, id2)
	if err != nil {
		log.Printf("Error %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnt Connect", "Error messages:": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Connected"})
}

func (h *UserHandler) ListOfConnections(c *gin.Context) {
	idStr := c.Query("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	prof, err := h.userService.ListOfConnections(id)
	if err != nil {
		log.Printf("Error %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch nearby profiles", "Error messages:": err.Error()})
		return

	}
	c.JSON(http.StatusOK, prof)
}
