import React from "react";
import "./Profileinput.css";

const ProfileInput = ({ value, onChange, type = "text", placeholder = "", ...props }) => (
    <div className="profile-input-group">
        <input
            className="profile-input-field"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    </div>
);

export default ProfileInput;