import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRoom.css'; // Reusing your existing styles for consistency

const JoinRoomComponent = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [success , setSuccess] = useState("");

    const handleJoinRoom = async (event) => {
        event.preventDefault();
        setError("");

        if (!roomCode.trim()) {
            setError("Please enter a room code");
            return;
        }

        try {
            const userId = sessionStorage.getItem("userId");

            const details = {roomCode , userId};

            console.log("Before sending request...");
            const response = await fetch("http://localhost:8080/studyRoom/join" , {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(details)
            });
            console.log("After sending response...");


            if(response.status == 200){
                console.log("Response is ok");
                const data = await response.json();
                console.log(data);
                setSuccess("Joined succesfully! Redirecting ...");
                setTimeout(() => navigate("/studyRoom/"+data.roomCode) , 2000);
            }
            else{
                const error = await response.text();
                setError(error);
            }
            
        } catch (err) {
            setError("Connection error. Is the server running?");
        }
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                {/* Header */}
                <div className="dialog-header">
                    <h2 className="dialog-title">Join Study Room</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Error Alert */}
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

                {/* Form */}
                <form className="dialog-form" onSubmit={handleJoinRoom}>
                    <div className="dialog-field">
                        <label htmlFor="roomCode">Room Code</label>
                        <input
                            type="text"
                            id="roomCode"
                            placeholder="Enter 6-character code (e.g. AB1234)"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            maxLength={10}
                        />
                    </div>

                    <p className="dialog-help-text" style={{ fontSize: '0.85rem', color: '#666', marginTop: '-10px', marginBottom: '15px' }}>
                        Ask the room creator for the unique invite code.
                    </p>

                    <div className="dialog-footer">
                        <button type="submit" className="submit-btn">
                            Join Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinRoomComponent;