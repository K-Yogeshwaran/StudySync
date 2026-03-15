import React from 'react';
import {useState , useEffect} from "react";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const [error , setError] = useState("");
    const [success , setSuccess] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setSuccess("");
        const userData = {email , password};

        const response = await fetch("http://localhost:8080/user/login", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(userData),
        });


        if(response.ok){
            const data = await response.json();
            console.log("Success : " , data);
            sessionStorage.setItem('userId' , data.id);
            sessionStorage.setItem('username',data.name);
            setSuccess("Login Successfull! Redirecting ...")
            setTimeout(() => {
                navigate("/dashboard");
            } , 2000);
        }
        else if(response.status == 401 || response.status == 404){
            const error = await response.text();
            console.log(error);
            setError(error);
        }
        else{
            console.log(`Error : ${response.statusText}`);
        }
    }

    return (
        <div className="login-container">
            {/* Small Logo for the Login Page */}
            <div className="login-logo">
                <span className="logo-icon">📖</span>
                <span className="logo-text">StudySync</span>
            </div>

            <div className="login-card">
                <h2 className="login-title">Log in to your account</h2>
                <p className="login-subtitle">Welcome back! Please enter your details.</p>

                {error && (
                    <div className='error-alert'>
                        <span className='error-icon'>⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='success-alert'>
                        <span className='success-icon'>✅</span>
                        {success}
                    </div>
                )}

                <form className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" value={password} onChange={event => setPassword(event.target.value)} />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember for 30 days
                        </label>
                        <a href="/forgot" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-submit-btn" onClick={(event) => handleSubmit(event)}>Sign in</button>
                </form>

                <p className="signup-prompt">
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;