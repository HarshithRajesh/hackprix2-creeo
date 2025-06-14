package repository

import (
	"database/sql"
	"errors"

	"github.com/HarshithRajesh/creeo/internal/domain"
)

type UserRepository interface {
	CreateProfile(profile *domain.Profile) error
	GetProfile(id int) (*domain.Profile, error)
	GetProfileByEmail(email string) (*domain.Profile, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateProfile(profile *domain.Profile) error {
	query := `INSERT INTO profiles(name,email,password,interests) 
              VALUES($1,$2,$3,$4)`
	_, err := r.db.Exec(query, &profile.Name, &profile.Email,
		&profile.Password, &profile.Interests)
	if err != nil {
		return errors.New("failed to create the user profile" + err.Error())
	}
	return nil
}

func (r *userRepository) GetProfile(id int) (*domain.Profile, error) {
	var prof domain.Profile
	query := `SELECT id,name,interests FROM profiles WHERE id=$1`
	row := r.db.QueryRow(query, id)
	err := row.Scan(&prof.Id, &prof.Name, &prof.Interests)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("Profile not found")
		}
		return nil, errors.New("Failed to fetch the profile details" + err.Error())
	}
	return &prof, nil
}

func (r *userRepository) GetProfileByEmail(email string) (*domain.Profile, error) {
	var prof domain.Profile
	query := `SELECT * FROM profiles WHERE email=$1`
	row := r.db.QueryRow(query, email)
	err := row.Scan(&prof.Id, &prof.Name, &prof.Email, &prof.Password, &prof.Interests)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("No profile found" + err.Error())
		}
		return nil, errors.New("Failed to fetch the user")
	}
	return &prof, nil
}

//
// func (r *userRepository) Location (loc *domain.Location) error{
//
// }
