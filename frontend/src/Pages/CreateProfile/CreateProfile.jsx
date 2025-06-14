import React, { useState } from "react";
import { ProfileInput } from "../../Components";
import { useNavigate } from 'react-router-dom'
import "./CreateProfile.css";
import "../../Components/Card/Card.css";
import { profileService } from '../../Service/api';

const INTERESTS = [
  'music', 'art', 'vibing', 'reading', 'hiking', 'cooking',
  'travel', 'photography', 'gaming', 'tech', 'sports'
];
const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin'
];

const CreateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    pronouns: "",
    about: "",
    age: "",
    interests: [],
    languages: [],
    instagram: "",
    facebook: "",
    twitter: ""
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  React.useEffect(() => {
    localStorage.setItem('profileSelections', JSON.stringify({
      interests: selectedInterests,
      languages: selectedLanguages
    }));
    setForm((prev) => ({
      ...prev,
      interests: selectedInterests,
      languages: selectedLanguages
    }));
  }, [selectedInterests, selectedLanguages]);

  const addInterest = (e) => {
    const value = e.target.value;
    if (value && !selectedInterests.includes(value)) {
      setSelectedInterests([...selectedInterests, value]);
    }
    e.target.value = '';
  };
  const removeInterest = (interest) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };
  const addLanguage = (e) => {
    const value = e.target.value;
    if (value && !selectedLanguages.includes(value)) {
      setSelectedLanguages([...selectedLanguages, value]);
    }
    e.target.value = '';
  };
  const removeLanguage = (lang) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      email: form.name.toLowerCase().replace(/\s+/g, '') + '@example.com',
      password: '123',
    };

    try {
      const response = await profileService.createProfile(payload);
      setMessage('Profile created successfully!');
      console.log('Profile created:', response);
      navigate('/');
    } catch (error) {
      setMessage('Error creating profile. Please try again.');
      console.error('Error:', error);
    }

    alert("Profile saved!");
  };


  return (
    <div className="create-profile-root">
      <div className="create-profile-container">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="create-profile-form">
          <h2>Edit Profile</h2>
          <ProfileInput
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Name"
          />
          <ProfileInput
            value={form.about}
            onChange={handleChange("about")}
            placeholder="About Me"
          />
          {/* Pronouns and Age in same row */}
          <div className="profile-row">
            <div className="profile-row-item">
              <ProfileInput
                value={form.pronouns}
                onChange={handleChange("pronouns")}
                placeholder="Pronouns"
              />
            </div>
            <div className="profile-row-item">
              <ProfileInput
                type="number"
                value={form.age}
                onChange={handleChange("age")}
                placeholder="Age"
              />
            </div>
          </div>
          {/* Interests and Languages in same row */}
          <div className="profile-row">
            <div className="profile-row-item">

              <select className="dropdown" onChange={addInterest} defaultValue="">
                <option value="" disabled>Add Interest</option>
                {INTERESTS.filter(i => !selectedInterests.includes(i)).map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
            </div>
            <div className="profile-row-item">

              <select className="dropdown" onChange={addLanguage} defaultValue="">
                <option value="" disabled>Add Language</option>
                {LANGUAGES.filter(l => !selectedLanguages.includes(l)).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          <ProfileInput
            value={form.instagram}
            onChange={handleChange("instagram")}
            placeholder="Instagram"
          />
          <ProfileInput
            value={form.facebook}
            onChange={handleChange("facebook")}
            placeholder="Facebook"
          />
          <ProfileInput
            value={form.twitter}
            onChange={handleChange("twitter")}
            placeholder="Twitter"
          />
          <button type="submit">Save Profile</button>
        </form>
        {/* Right: Profile Preview Card */}
        <div className="card create-profile-preview">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            className="profile-avatar"
            style={{ marginBottom: "1.2rem" }}
          />
          <h2>
            {form.name || "Your Name"}
            {form.age && <span className="age">, {form.age}</span>}
          </h2>
          {form.pronouns && <div className="pronoun">{form.pronouns}</div>}
          <p style={{ margin: "0.5rem 0 1rem 0", color: "#636e72" }}>{form.about}</p>
          {/* Interests */}
          <div className="tag-list">
            {selectedInterests.map(interest => (
              <span className="tag" key={interest}>
                {interest}
                <span className="tag-remove" onClick={() => removeInterest(interest)}>&times;</span>
              </span>
            ))}
          </div>
          {/* Languages */}
          <div className="tag-list">
            {selectedLanguages.map(lang => (
              <span className="tag" key={lang}>
                {lang}
                <span className="tag-remove" onClick={() => removeLanguage(lang)}>&times;</span>
              </span>
            ))}
          </div>
          {/* Links */}
          <div style={{ marginTop: "1.2rem", width: "100%" }}>
            <strong>Links:</strong>
            <ul style={{ margin: "0.3rem 0 0 0", padding: 0 }}>
              {form.instagram && <li><a href={form.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
              {form.facebook && <li><a href={form.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
              {form.twitter && <li><a href={form.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></li>}
            </ul>
          </div>
          <div className="create-profile-gallery" style={{ marginTop: "1.2rem" }}>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Gallery1" />
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Gallery2" />
            <img src="https://randomuser.me/api/portraits/women/46.jpg" alt="Gallery3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;