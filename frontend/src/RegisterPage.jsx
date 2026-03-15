import React from 'react';
import {useState , useEffect} from "react";
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");


    const [error , setError] = useState("");
    const [success , setSuccess] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setSuccess("");

        const name = firstName + " " + lastName;
        const userData = {name , email , password};
        console.log(userData);



        const response = await fetch("http://localhost:8080/user/register", {
            method : "POST",
            headers : {
                'Content-Type' : "application/json",
            },
            body : JSON.stringify(userData),
        });

        if(response.ok){
            const data = await response.json();
            console.log(`Success : ${data}`);

            setSuccess("Registration Successfull !!!");
            setTimeout(() => {
                navigate("/login");
            },2000);

        }
        else if(response.status == 401 || response.status == 500 || response.status == 409){
            const error = response.text();
            setError(error);
        }
        else{
            console.log(`Error : ${response.statusText}`);
        }
        
    }


    return (
        <div className="register-container">
            {/* Brand Identity */}
            <div className="register-logo">
                <span className="logo-icon">📖</span>
                <span className="logo-text">StudySync</span>
            </div>

            <div className="register-card">
                <h2 className="register-title">Create an account</h2>
                <p className="register-subtitle">Join thousands of students studying together.</p>

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

                <form className="register-form">
                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" placeholder="Jane" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" placeholder="Doe" value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="jane@example.com" value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)}/>
                        <span className="helper-text">Must be at least 8 characters.</span>
                    </div>

                    <button type="submit" className="register-submit-btn" onClick={(event) => handleSubmit(event)}>Get Started</button>
                </form>

                <p className="login-prompt">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;