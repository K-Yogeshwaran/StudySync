import React from 'react';
import { useState } from 'react';
import './CreateRoom.css';
import { useNavigate } from 'react-router-dom';


const CreateRoom = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();

    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleCreateRoom(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        
        const createrUserId = Number(sessionStorage.getItem('userId'));
        if(!createrUserId){
            setError("User not logged in");
            return;
        }

        const roomDetails = { createrUserId, roomName, description }

        const response = await fetch("http://localhost:8080/studyRoom/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'      
            },
            body: JSON.stringify(roomDetails)
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('roomCode', data.roomCode);
            console.log(data);
            setSuccess("Room created successfully!!!");

            setTimeout(() => {
                navigate("/studyRoom/" + data.roomCode);
            });
        }
        else{
            const error = await response.text();
            console.log(error);
            setError(error);
        }
    }

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                {/* Header with Close Button */}
                <div className="dialog-header">
                    <h2 className="dialog-title">Create New Study Room</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
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
                {/* Form Body */}
                <form className="dialog-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="dialog-field">
                        <label htmlFor="roomName">Room Name</label>
                        <input
                            type="text"
                            id="roomName"
                            placeholder="e.g. Calculus Final Prep"
                            value={roomName}
                            onChange={event => setRoomName(event.target.value)}
                        />
                    </div>

                    <div className="dialog-field">
                        <label htmlFor="roomName">Description</label>
                        <input
                            type="text"
                            id="roomName"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                        />
                    </div>

                    {/* <div className="dialog-field">
                        <label htmlFor="topic">Topic</label>
                        <div className="select-container">
                            <select id="topic" defaultValue="General">
                                <option value="General">General</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                            </select>
                        </div>
                    </div> */}

                    {/* Right-aligned Footer Button */}
                    <div className="dialog-footer">
                        <button type="submit" className="submit-btn" onClick={event => handleCreateRoom(event)}>
                            Create Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoom;