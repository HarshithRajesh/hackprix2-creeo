package service

import (
	"errors"
	"fmt"

	"github.com/HarshithRajesh/creeo/internal/domain"
	"github.com/HarshithRajesh/creeo/internal/repository"
)

type UserService interface {
	CreateProfile(profile *domain.Profile) error
	GetProfile(id int) (*domain.ProfileSummary, error)
	Location(loc *domain.Location) error
	GetNearbyProfiles(id int, radius int) ([]*domain.ProfileWithLocation, error)
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo}
}

func (s *userService) CreateProfile(profile *domain.Profile) error {
	existingUser, _ := s.repo.GetProfileByEmail(profile.Email)
	if existingUser != nil {
		return errors.New("Profile already exists")
	}
	return s.repo.CreateProfile(profile)
}

func (s *userService) GetProfile(id int) (*domain.ProfileSummary, error) {
	var prof *domain.ProfileSummary
	prof, err := s.repo.GetProfile(id)
	if err != nil {
		return nil, errors.New("Profile not exists")
	}
	return prof, nil
}

func (s *userService) Location(loc *domain.Location) error {
	err := s.repo.Location(loc)
	if err != nil {
		return fmt.Errorf("failed to set the location %w", err)
	}
	return nil
}

func (s *userService) GetNearbyProfiles(id int, radius int) ([]*domain.ProfileWithLocation, error) {
	results, err := s.repo.GetNearbyProfiles(id, radius)
	if err != nil {
		return nil, fmt.Errorf("service failed to fetch nearby profiles: %w", err)
	}
	return results, nil
}
