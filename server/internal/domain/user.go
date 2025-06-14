package domain

import (
	"gorm.io/datatypes"
)

type Profile struct {
	Id       int            `gorm:"primaryKey;autoIncrement"`
	Name     string         `gorm:"not null"`
	Email    string         `gorm:"unique;not null"`
	Password string         `gorm:"not null"`
	Intersts datatypes.JSON `gorm:"type:jsonb;not null"`
}
