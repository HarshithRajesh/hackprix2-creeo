import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Auth = () => {
    const navigate = useNavigate();
    const handleLoginRedirect = () => {
        localStorage.setItem('token', "dummy-token");
        localStorage.setItem('userid', "dummy-userid");
        navigate('/');
    };
    const handleRedirect = () => {
        localStorage.setItem('token', "dummy-token");
        // localStorage.setItem('userid', "dummy-userid");
        navigate('/create-profile');
    };

    return (
        <div className='auth-container'>
            <button className='auth-button' onClick={handleLoginRedirect}>Login</button>
            <button className='auth-button' onClick={handleRedirect}>Register</button>
        </div>
    );
};

export default Auth