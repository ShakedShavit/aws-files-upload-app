import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginPage = () => {
    const [isSignupForm, setIsSignupForm] = useState(false);

    const switchForm = () => {
        setIsSignupForm(!isSignupForm);
    }
    
    return (
        <div className="login-box">
            <div className="login-options">
                <button disabled={!isSignupForm} onClick={switchForm}>Login</button>
                <button disabled={isSignupForm} onClick={switchForm}>Signup</button>
            </div>

            <LoginForm isSignupForm={isSignupForm} />
        </div>
    )
};

export default LoginPage;