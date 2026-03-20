import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StudyRoomHome.css';
import SyncedBoard from './studyroom/SyncedBoard';

import { useWebSocket } from "./config/WebSocketConfig";
import Participants from './studyroom/Participants';


const StudyRoomHome = () => {

    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);


    const [viewMode, setViewMode] = useState("dashboard")
    const { roomCode } = useParams();

    const [roomData, setRoomData] = useState(null);
    const [createrData, setCreaterData] = useState(null);
    const [participants, setParticipants] = useState([]);

    const [materials, setMaterials] = useState([]);
    const [file, setFile] = useState(null);

    const { connect, stompClient, disconnect } = useWebSocket();

    useEffect(() => {
        const storedUserName = sessionStorage.getItem("username");

        connect(roomCode, storedUserName);
    }, [roomCode, connect]);

    useEffect(() => {
        // Only subscribe if the client is connected
        if (stompClient && stompClient.connected) {

            const chatSub = stompClient.subscribe("/rooms/" + roomCode, (payload) => {
                const newMessage = JSON.parse(payload.body);
                setMessages((prev) => [...prev, newMessage]);
            });

            const presenceSub = stompClient.subscribe("/topic/" + roomCode + "/presence", (payload) => {
                const onlineUsers = JSON.parse(payload.body);
                setParticipants(onlineUsers.map(name => ({ name, status: "online" })));
            });

            // Send the JOIN message
            stompClient.send("/app/chat.addUser/" + roomCode, {}, JSON.stringify({
                senderName: sessionStorage.getItem("username"),
                senderId: sessionStorage.getItem("userId"),
                type: "JOIN",
            }));

            // Cleanup: Unsubscribe when the component unmounts
            return () => {
                chatSub.unsubscribe();
                presenceSub.unsubscribe();
            };
        }
    }, [stompClient, roomCode]);

    useEffect(() => {
        const fetchAllData = async () => {

            const roomResponse = await fetch("http://localhost:8080/studyRoom/" + roomCode)
            const actualRoomData = await roomResponse.json();
            setRoomData(actualRoomData);


            const participantsResponse = await fetch("http://localhost:8080/studyRoom/participants/" + roomCode)
            const actualParticipantsData = await participantsResponse.json();
            setParticipants(actualParticipantsData);



            const userDataResponse = await fetch("http://localhost:8080/user/" + actualRoomData.createrId)
            const actualUserData = await userDataResponse.json();
            setCreaterData(actualUserData);

            const chatHistoryResponse = await fetch("http://localhost:8080/chat/history/" + roomCode)
            const actualChatHistory = await chatHistoryResponse.json();
            console.log(actualChatHistory);
            setMessages(actualChatHistory);

            loadStudyMaterials();
        }
        fetchAllData();

    }, [roomCode]);


    const [myMessage, setMyMessage] = useState("");

    function sendMessage() {

        if (!myMessage.trim() || !stompClient || !stompClient.connected)
            return;

        const senderId = sessionStorage.getItem("userId");
        const senderName = sessionStorage.getItem("username");
        const content = myMessage;

        const messageBody = { senderId, senderName, content, roomCode };

        stompClient.send("/app/chat", {}, JSON.stringify(messageBody));
        setMyMessage("");

        console.log("Messages List :- ");
        console.log(messages);

    }

    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    async function loadStudyMaterials() {
        const studyMaterials = await fetch("http://localhost:8080/studyMaterials/" + roomCode)
        const actualStudyMaterials = await studyMaterials.json();
        setMaterials(actualStudyMaterials);
        console.log("Study Materials : " + materials);
    }

    async function handleUpload() {
        console.log("Handle upload called");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", createrData.name);
        formData.append("roomCode", roomCode);
        console.log("Form data created");
        try {
            console.log("Going to send request");
            const response = await fetch("http://localhost:8080/studyMaterials/upload/" + roomCode, {
                method: "POST",
                body: formData
            });
            console.log("Response got");
            const result = await response.text();
            loadStudyMaterials();
            console.log("Success : " + result);
        }
        catch (error) {
            console.log("Error : " + error);
        }
    }

    if (!roomData) return <div className="loading">Loading room...</div>;


    return (
        <div className="room-layout">
            {/* Sidebar: Participants (Left) */}
            <aside className="room-sidebar">
                <h3 className="sidebar-title">Online Now ({participants.length})</h3>
                <ul className="participant-list">
                    {participants.map((user, index) => (
                        <li key={index} className="participant-item">
                            <span className="status-dot online"></span>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </aside>
            {/* <Participants roomCode={roomCode}/> */}


            {/* Main Content Area (Center) */}
            <main className="room-main">
                <header className="room-header">
                    <div className="view_controls">
                        <button
                            className={viewMode === "dashboard" ? "active" : ""}
                            onClick={() => setViewMode("dashboard")}
                        >
                            🏠 Home
                        </button>
                        <button
                            className={viewMode === "whiteboard" ? "active" : ""}
                            onClick={() => setViewMode("whiteboard")}
                        >
                            🎨 Board
                        </button>
                    </div>
                    <div className="header-info">
                        <h1 className="room-title">{roomData.roomName}</h1>
                        <span className="topic-badge">{roomData.topic}</span>
                    </div>
                    <div className="room-actions">
                        <span className="room-code-display">Code: <strong>{roomCode}</strong></span>
                        <button
                            className="start-class-btn"
                            onClick={() => navigate(`/classroom/${roomCode}`)}
                        >
                            🎓 Start Class
                        </button>
                        <button className="leave-btn">Leave Room</button>
                    </div>
                </header>

                {/* SWITCHER LOGIC */}
                {viewMode === "dashboard" ? (
                    <div className="dashboard-view">
                        <section className="room-details-card">
                            <h3>About this Room</h3>
                            <p>{roomData.description}</p>
                            <small>Created by: {createrData?.name || "Loading ..."}</small>
                        </section>

                        <section className="room-materials-middle">
                            <div className="section-header">
                                <h3>Study Materials ({materials.length})</h3>
                                <div className="upload-controls">
                                    <label className="custom-file-upload">
                                        <input type="file" onChange={handleChange} />
                                        {file ? `✅ ${file.name.substring(0, 15)}...` : "Choose File"}
                                    </label>
                                    <button className="upload-btn" onClick={handleUpload} disabled={!file}>
                                        Upload
                                    </button>
                                </div>
                            </div>

                            <div className="materials-grid">
                                {materials.map((item, index) => (
                                    <div key={index} className="material-card">
                                        <span className="file-icon">📄</span>
                                        <div className="file-info">
                                            <p className="file-name">{item.fileName}</p>
                                            <small>By {item.uploadedBy}</small>
                                        </div>
                                        <a
                                            href={`http://localhost:8080/studyMaterials/download/${item.fileId}`}
                                            className="download-btn-icon"
                                            download
                                        >
                                            📥
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="whiteboard-area" onClick={() => setViewMode("whiteboard")}>
                            <div className="whiteboard-placeholder">
                                <span className="icon">🖌️</span>
                                <p>Click to open Full Whiteboard</p>
                            </div>
                        </section>
                    </div>
                ) : (
                    /* PASSING PROPS TO YOUR NEW COMPONENT */
                    <div className="full-board-view">
                        <SyncedBoard roomCode={roomCode} />
                    </div>
                )}
            </main>

            {/* Chat Section (Right) - NEW UI PORTION */}
            <aside className="room-chat">
                <div className="chat-header">
                    <h3>Live Chat</h3>
                </div>
                <div className="chat-messages">
                    <div className="message system">Welcome to the study room!</div>
                    {messages.map((item, index) => (
                        <div key={index} className={`message-container ${item.senderId == sessionStorage.getItem("userId") ? 'own' : 'other'}`}>
                            <span className="chat-sender">{item.senderName}</span>
                            <div className="chat-bubble">
                                {item.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-input-area">
                    <input type="text" placeholder="Type a message..."
                        value={myMessage}
                        onKeyDown={(event) => {
                            if (event.key == "Enter") {
                                sendMessage();
                            }
                        }}
                        onChange={(event) => setMyMessage(event.target.value)} />
                    <button className="send-btn" onClick={sendMessage}>Send</button>
                </div>
            </aside>
        </div>
    );
};

export default StudyRoomHome;