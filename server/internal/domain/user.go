package domain

import (
	"time"

	"gorm.io/datatypes"
)

type Profile struct {
	Id          int            `gorm:"primaryKey;autoIncrement"`
	Name        string         `gorm:"not null"`
	Email       string         `gorm:"unique;not null"`
	Password    string         `gorm:"not null"`
	Interests   datatypes.JSON `gorm:"type:jsonb;not null"`
	Description string         `gorm:"not null"`
	Age         int            `gorm:"not null"`
	Pronouns    string         `gorm:"not null"`
	Languages   string         `gorm:"not null"`
	SocialLinks datatypes.JSON `gorm:"type:jsonb;not null"`
}

type GeoPoint struct {
	Lng float64 `json:"lng"`
	Lat float64 `json:"lat"`
}

type Location struct {
	Id        int      `gorm:"primaryKey;not null"`
	Location  GeoPoint `gorm:"type:geography(Point,4326);not null"`
	UpdatedAt time.Time
}
type ProfileWithLocation struct {
	Id        int            `json:"id"`
	Name      string         `json:"name"`
	Email     string         `json:"email"`
	Interests datatypes.JSON `json:"interests"`
	UpdatedAt time.Time      `json:"updatedAt"`
	Location  GeoPoint       `json:"location"`
	Distance  float64        `json:"distance"` // meters
}

type ProfileSummary struct {
	Id          int
	Name        string
	Interests   string
	Description string
	Age         int
	Pronouns    string
	Languages   string
	SocialLinks datatypes.JSON
}

type ConnectionList struct {
	Id   int
	Name string
}
