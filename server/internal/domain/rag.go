package domain

// RAGSearchRequest mirrors the Python FastAPI request model for /rag_search
type RAGSearchRequest struct {
	Query         string  `json:"query"`
	UserLatitude  float64 `json:"user_latitude"`
	UserLongitude float64 `json:"user_longitude"`
	RadiusMeters  float64 `json:"radius_meters"`
	Limit         int     `json:"limit"`
}

// ProfileResult mirrors the ProfileResult model from Python
type ProfileResult struct {
	ID             int      `json:"id"`
	Name           string   `json:"name"`
	Email          string   `json:"email"`
	Interests      []string `json:"interests"`
	DistanceMeters *float64 `json:"distance_meters"` // Use pointer for nullable float
}

// RAGSearchResponse mirrors the Python FastAPI response model for /rag_search
type RAGSearchResponse struct {
	GeneratedSummary string          `json:"generated_summary"`
	Profiles         []ProfileResult `json:"profiles"`
}
type SmartSearchRequest struct {
	Query         string   `json:"query" binding:"required"` // 'binding:"required"' for Gin validation
	UserLatitude  *float64 `json:"user_latitude"`            // Optional, use pointer for nullable
	UserLongitude *float64 `json:"user_longitude"`           // Optional, use pointer for nullable
	RadiusMeters  *float64 `json:"radius_meters"`            // Optional, use pointer for nullable
}
