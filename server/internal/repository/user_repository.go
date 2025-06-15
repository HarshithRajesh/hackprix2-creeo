package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/HarshithRajesh/creeo/internal/domain"
)

type UserRepository interface {
	CreateProfile(profile *domain.Profile) error
	GetProfile(id int) (*domain.ProfileSummary, error)
	GetProfileByEmail(email string) (*domain.Profile, error)
	Location(loc *domain.Location) error
	GetNearbyProfiles(id int, radius int) ([]*domain.ProfileWithLocation, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateProfile(profile *domain.Profile) error {
	query := `INSERT INTO profiles(name,email,password,interests,description,age,pronouns,languages,social_links)  
              VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`
	_, err := r.db.Exec(query, &profile.Name, &profile.Email,
		&profile.Password, &profile.Interests, &profile.Description, &profile.Age, &profile.Pronouns, &profile.Languages, &profile.SocialLinks)
	if err != nil {
		return errors.New("failed to create the user profile" + err.Error())
	}
	return nil
}

func (r *userRepository) GetProfile(id int) (*domain.ProfileSummary, error) {
	var prof domain.ProfileSummary
	query := `SELECT id,name,interests,description,age,pronouns,languages,social_links FROM profiles WHERE id=$1`

	row := r.db.QueryRow(query, id)
	err := row.Scan(&prof.Id, &prof.Name, &prof.Interests, &prof.Description, &prof.Age, &prof.Pronouns, &prof.Languages, &prof.SocialLinks)
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

func (r *userRepository) Location(loc *domain.Location) error {
	pointWKT := fmt.Sprintf("SRID=4326;POINT(%f %f)", loc.Location.Lng, loc.Location.Lat)
	query := `INSERT INTO geolocation (profile_id, location, updated_at)
            VALUES ($1, ST_GeogFromText($2), $3)
            ON CONFLICT (profile_id)
            DO UPDATE SET
            location = EXCLUDED.location,
            updated_at = EXCLUDED.updated_at;
              `
	id := loc.Id
	log.Println(id, pointWKT)
	_, err := r.db.Exec(query, loc.Id, pointWKT, time.Now())
	if err != nil {
		return errors.New("failed to update geolocation" + err.Error())
	}
	return nil
}

func (r *userRepository) GetNearbyProfiles(id int, radius int) ([]*domain.ProfileWithLocation, error) {
	query := `WITH TargetUserLocation AS (
    SELECT
        g.location AS target_location
    FROM geolocation g
    WHERE g.profile_id = $1
  )
  SELECT
      p.id,
      p.name,
      p.email,
      p.interests,
      g.updated_at AS location_updated_at, 
      ST_Y(g.location::geometry) AS latitude,
      ST_X(g.location::geometry) AS longitude,
      ST_Distance(g.location, TUL.target_location) AS distance_meters
  FROM profiles p
  JOIN geolocation g ON p.id = g.profile_id
  JOIN TargetUserLocation TUL ON TRUE
  WHERE
      p.id != $1 AND 
      ST_DWithin(g.location, TUL.target_location, $2) 
  ORDER BY distance_meters;`
	rows, err := r.db.Query(query, id, radius)
	if err != nil {
		return nil, fmt.Errorf("%w: failed to fetch nearby profiles", err.Error())
	}
	defer rows.Close()
	var nearbyprofiles []*domain.ProfileWithLocation

	for rows.Next() {
		prof := &domain.ProfileWithLocation{}
		var tempGeo domain.GeoPoint

		if err := rows.Scan(&prof.Id, &prof.Name, &prof.Email, &prof.Interests,
			&prof.UpdatedAt, &tempGeo.Lat, &tempGeo.Lng, &prof.Distance); err != nil {
			return nil, fmt.Errorf("failed to scan profiles: %v", err)
		}
		prof.Location = tempGeo
		nearbyprofiles = append(nearbyprofiles, prof)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error encountered during nearby profiles iteration: %v", err)
	}
	return nearbyprofiles, nil
}
