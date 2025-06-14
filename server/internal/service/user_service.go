package service

import (
	"errors"

	"github.com/HarshithRajesh/creeo/internal/domain"
	"github.com/HarshithRajesh/creeo/internal/repository"
)

type UserService interface {
	CreateProfile(profile *domain.Profile) error
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
