import { useParams, useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import SyncedBoard from "./studyroom/SyncedBoard";
import "./ClassRoom.css";
import Participants from "./studyroom/Participants";
import StudyMaterials from "./studyroom/StudyMaterials";
import ChatRoom from "./studyroom/ChatRoom";
import {useWebSocket} from "./config/WebSocketConfig";

function ClassRoom() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    // Track which tab is active. Default to 'chat' or null.
    const [activeTab, setActiveTab] = useState("chat");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = (tab) => {
        if (activeTab === tab && isSidebarOpen) {
            setIsSidebarOpen(false);
        } else {
            setActiveTab(tab);
            setIsSidebarOpen(true);
        }
    };

    // Inside ClassRoom.jsx
    const { connect, stompClient } = useWebSocket();

    useEffect(() => {
        const storedUserName = sessionStorage.getItem("username");
        // Connect if not already connected (Context handles the check)
        connect(roomCode, storedUserName);
    }, [roomCode, connect]);

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            // We send the JOIN message here too so the backend 
            // knows the user is now in the 'Classroom' view
            stompClient.send("/app/chat.addUser/" + roomCode, {}, JSON.stringify({
                senderName: sessionStorage.getItem("username"),
                senderId: sessionStorage.getItem("userId"),
                type: "JOIN",
            }));
        }
    }, [stompClient, roomCode]);

    return (
        <div className="classroom-layout">
            <header className="classroom-header">
                <div className="header-left">
                    <div className="logo-section">
                        <span className="brand">StudySync</span>
                        <div className="divider"></div>
                        <span className="room-id">ID: {roomCode}</span>
                        <span className="live-indicator">LIVE</span>
                    </div>
                </div>

                <div className="header-center">
                    <nav className="tool-nav">
                        <button
                            className={activeTab === 'participants' && isSidebarOpen ? 'nav-item active' : 'nav-item'}
                            onClick={() => toggleSidebar('participants')}
                        >
                            <span className="icon">👥</span> Participants
                        </button>
                        <button
                            className={activeTab === 'materials' && isSidebarOpen ? 'nav-item active' : 'nav-item'}
                            onClick={() => toggleSidebar('materials')}
                        >
                            <span className="icon">📄</span> Materials
                        </button>
                        <button
                            className={activeTab === 'chat' && isSidebarOpen ? 'nav-item active' : 'nav-item'}
                            onClick={() => toggleSidebar('chat')}
                        >
                            <span className="icon">💬</span> Chat
                        </button>
                    </nav>
                </div>

                <div className="header-right">
                    <button className="btn-leave" onClick={() => navigate('/dashboard')}>
                        Exit Room
                    </button>
                </div>
            </header>

            <div className="workspace">
                <main className="canvas-area">
                    <SyncedBoard roomCode={roomCode} />

                    {/* Floating Zoom/Page Controls could go here */}
                    <div className="canvas-footer">
                        <span className="status">Connected to server</span>
                    </div>
                </main>

                {isSidebarOpen && (
                    <aside className="classroom-drawer">
                        <div className="drawer-header">
                            <h3>{activeTab.toUpperCase()}</h3>
                            <button className="close-drawer" onClick={() => setIsSidebarOpen(false)}>×</button>
                        </div>
                        <div className="drawer-content">
                            {activeTab === 'participants' && <Participants roomCode={roomCode} />}
                            {activeTab === 'materials' && <StudyMaterials roomCode={roomCode} />}
                            {activeTab === 'chat' && <ChatRoom roomCode={roomCode} />}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}

export default ClassRoom;