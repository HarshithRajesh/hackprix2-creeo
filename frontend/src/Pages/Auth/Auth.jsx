import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Auth = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/');
    };

    return (
        <div className='auth-container'>
            <button className='auth-button' onClick={handleRedirect}>Login</button>
            <button className='auth-button' onClick={handleRedirect}>Register</button>
        </div>
    );
};

export default Auth