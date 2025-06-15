package ml_client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/HarshithRajesh/creeo/internal/domain"
)

// Client represents a client for your ML microservice
type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

// NewClient creates a new ML client
func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second, // Allow enough time for LLM response
		},
	}
}

// SearchProfiles calls the /rag_search endpoint of the ML service
func (c *Client) SearchProfiles(request domain.RAGSearchRequest) (*domain.RAGSearchResponse, error) {
	url := fmt.Sprintf("%s/rag_search", c.BaseURL)

	jsonReq, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal RAG search request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonReq))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make HTTP request to ML service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errBody map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errBody)
		return nil, fmt.Errorf("ML service returned non-OK status: %d, detail: %v", resp.StatusCode, errBody)
	}

	var ragResponse domain.RAGSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&ragResponse); err != nil {
		return nil, fmt.Errorf("failed to decode RAG search response: %w", err)
	}

	return &ragResponse, nil
}
