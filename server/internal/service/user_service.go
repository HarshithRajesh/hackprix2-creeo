package service

import (
	"errors"

	"github.com/HarshithRajesh/creeo/internal/domain"
	"github.com/HarshithRajesh/creeo/internal/repository"
)

type UserService interface {
	CreateProfile(profile *domain.Profile) error
	GetProfile(id int) (*domain.Profile, error)
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

func (s *userService) GetProfile(id int) (*domain.Profile, error) {
	var prof *domain.Profile
	prof, err := s.repo.GetProfile(id)
	if err != nil {
		return nil, errors.New("Profile not exists")
	}
	return prof, nil
}
