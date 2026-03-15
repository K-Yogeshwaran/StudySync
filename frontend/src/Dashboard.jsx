import CreateRoom from './CreateRoom';
import { useNavigate, useParams } from 'react-router-dom';

import { useState, useEffect } from "react";

import './Dashboard.css';
import JoinRoomComponent from './JoinRoomComponent';

const Dashboard = () => {

    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    const [userData, setUserData] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const openBox = () => setIsOpen(true);
    const closeBox = () => setIsOpen(false);


    const [isModelBoxOpen, setModelBoxOpen] = useState(false);

    const openModelBox = () => setModelBoxOpen(true);
    const closeModelBox = () => setModelBoxOpen(false);


    useEffect(() => {
        fetch("http://localhost:8080/user/" + userId)
            .then(response => response.json())
            .then(data => { setUserData(data); console.log(data) })
            .catch(error => console.log(error));

    }, []);

    function demo() {
        userData.createdRooms.map((item, label) => {
            console.log(item.roomName);
        })
    }


    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dash-nav">
                <div className="nav-left">
                    <div className="logo">
                        <span className="logo-icon">📖</span>
                        <span className="logo-text">StudySync</span>
                    </div>
                    <div className="nav-links">
                        <a href="#" className="active">Dashboard</a>
                        <a href="#">Find Rooms</a>
                        <a href="#">Schedule</a>
                    </div>
                </div>
                <div className="nav-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Search rooms..." />
                    </div>
                    <button className="notif-btn">🔔</button>
                    <div className="user-avatar">👩‍🦰</div>
                </div>

            </nav>

            <main className="dash-content">
                <header className="welcome-section">
                    <h1>Welcome back, {userData.name} 👋</h1>
                    <p>You have 3 study sessions scheduled for today.</p>
                </header>

                <div className="dash-grid">
                    {/* Main Column */}
                    <div className="left-column">
                        {/* Stats Cards */}
                        <div className="stats-row">
                            <div className="stat-card blue">
                                <div className="stat-icon">🕒</div>
                                <div className="stat-info">
                                    <p>Study Time</p>
                                    <h3>12.5h</h3>
                                </div>
                            </div>
                            <div className="stat-card purple">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <p>Sessions</p>
                                    <h3>4</h3>
                                </div>
                            </div>

                            <JoinRoomComponent isOpen={isOpen} onClose={closeBox} />

                            <div
                                className="stat-card green action-card"
                                onClick={openBox}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="stat-icon">🔑</div>
                                <div className="stat-info">
                                    <p>Access Room</p>
                                    <h3>Join Now</h3>
                                </div>
                            </div>

                        </div>
                        <CreateRoom isOpen={isModelBoxOpen} onClose={closeModelBox} />
                        <div className="cta-group">
                            <button className="primary-button" onClick={openModelBox}>
                                <span className="plus-icon">+</span> Create a Study Room
                            </button>
                        </div>
                        <br /><br />


                        {/* Active Rooms */}
                        <section className="active-rooms">
                            <div className="section-header">
                                <h2>Your Active Rooms</h2>
                                <a href="#">View all</a>


                            </div>

                            <div className="rooms-grid">

                                {userData.createdRooms?.map((item, index) => {
                                    return (
                                        <div key={index} className="room-card">
                                            <div className="room-info">
                                                <h3>{item.roomName}</h3>
                                                <p>Description: {item.description}</p>
                                            </div>

                                            <div className="room-meta">👥 {item.participants.length}</div>
                                            <button className="jump-in-btn" onClick={() => navigate("/studyRoom/" + item.roomCode)}>Jump In</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Joined Rooms */}
                        <section className="active-rooms">
                            <div className="section-header">
                                <h2>Your Joined Rooms</h2>
                                <a href="#">View all</a>


                            </div>

                            <div className="rooms-grid">

                                {userData.joinedRooms?.map((item, index) => {
                                    return (
                                        <div key={index} className="room-card">
                                            <div className="room-info">
                                                <h3>{item.roomName}</h3>
                                                <p>Description: {item.description}</p>
                                            </div>

                                            <div className="room-meta">👥 {item.participants.length}</div>
                                            <button className="jump-in-btn" onClick={() => navigate("/studyRoom/" + item.roomCode)}>Jump In</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="right-column">
                        <div className="sessions-card">
                            <h3>Upcoming Sessions</h3>



                            <div className="session-item">
                                <div className="date-box">JAN <span>07</span></div>
                                <div className="session-details">
                                    <h4>Calculus Review</h4>
                                    <p>14:00 - 15:30</p>
                                </div>
                            </div>
                            <div className="session-item">
                                <div className="date-box">JAN <span>08</span></div>
                                <div className="session-details">
                                    <h4>React Workshop</h4>
                                    <p>10:00 - 12:00</p>
                                </div>
                            </div>
                            <button className="schedule-btn">📅 Schedule New</button>
                        </div>

                        <div className="invite-promo-card">
                            <h3>Invite Friends</h3>
                            <p>Study is better with friends. Invite them to join you!</p>
                            <button className="invite-link-btn">Share Invite Link</button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;