import React from 'react';
import {useState} from "react";

import CreateRoom from "./CreateRoom";
import './HomePage.css';

const HomePage = () => {


    const [isModelBoxOpen , setModelBoxOpen] = useState(false);

    const openModelBox = () => setModelBoxOpen(true);
    const closeModelBox = () => setModelBoxOpen(false);

    return (
        <div className="container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="logo">
                    <span className="logo-icon">📖</span>
                    <span className="logo-text">StudySync</span>
                </div>
                <div className="nav-links">
                    <a href="/login" className="login-link">Log in</a>
                    <a href="/register"><button className="signup-button">Sign up</button></a>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="hero">
                <h1 className="hero-title">
                    Study Better, <span className="highlight">Together.</span>
                </h1>
                <p className="hero-subtitle">
                    Create virtual study rooms, share resources in real-time, and <br />
                    collaborate on an interactive whiteboard.
                </p>

                <CreateRoom isOpen={isModelBoxOpen} onClose={closeModelBox} />

                <div className="cta-group">
                    <button className="primary-button" onClick={openModelBox}>
                        <span className="plus-icon">+</span> Create a Study Room
                    </button>
                    <button className="secondary-button">
                        Explore Rooms
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;