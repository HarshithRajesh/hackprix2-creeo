package repository

import (
	"database/sql"
	"errors"

	"github.com/HarshithRajesh/domain"
)

type UserRepository interface {
	CreateProfile(profile *domain.Profile) error
	GetProfile(profile *domain.Profile) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	&userRepository{db}
}

func (r *userRepository) CreateProfile(profile *domain.Profile) error {
	query := `INSERT INTO profiles(id,name,email,password,interests) 
              VALUES($1,$2,$3,$4,$5)`
	_, err := r.db.Exec(query, &profile.Id, &profile.Name, &profile.Email,
		&profile.Password, &profile.Interests)
	if err != nil {
		return errors.New("failed to create the user profile" + err.Error())
	}
	return nil
}

func (r *userRepository) GetProfile(profile *domain.Profile) error {
}
