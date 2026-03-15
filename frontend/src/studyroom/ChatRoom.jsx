import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../config/WebSocketConfig"; // Import the hook
import "./ChatRoom.css";

function ChatRoom({ roomCode }) {
    const { stompClient } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [myMessage, setMyMessage] = useState("");
    
    // Ref for auto-scrolling to the bottom
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. Initial Load of History
    useEffect(() => {
        if (roomCode) {
            loadMessages();
        }
    }, [roomCode]);

    // 2. Subscribe to Real-Time Messages
    useEffect(() => {
        if (stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe("/rooms/" + roomCode, (payload) => {
                const newMessage = JSON.parse(payload.body);
                setMessages((prev) => [...prev, newMessage]);
            });

            return () => subscription.unsubscribe();
        }
    }, [stompClient, roomCode]);

    // 3. Auto-scroll whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function loadMessages() {
        try {
            const response = await fetch(`http://localhost:8080/chat/history/${roomCode}`);
            const actualChatHistory = await response.json();
            setMessages(actualChatHistory);
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    }

    function sendMessage() {
        if (!myMessage.trim() || !stompClient || !stompClient.connected){
            console.log("Some error occured");
            return;
        }

        const messageBody = {
            senderId: sessionStorage.getItem("userId"),
            senderName: sessionStorage.getItem("username"), // Fixed: Get string directly
            content: myMessage,
            roomCode: roomCode
        };

        stompClient.send("/app/chat", {}, JSON.stringify(messageBody));
        setMyMessage("");
    }

    return (
        <aside className="room-chat">
            <div className="chat-header">
                <h3>Live Chat</h3>
            </div>
            
            <div className="chat-messages">
                <div className="message system">Welcome to the study room!</div>
                {messages.map((item, index) => {
                    const isOwn = item.senderId == sessionStorage.getItem("userId");
                    return (
                        <div key={index} className={`message-container ${isOwn ? 'own' : 'other'}`}>
                            {!isOwn && <span className="chat-sender">{item.senderName}</span>}
                            <div className="chat-bubble">
                                {item.content}
                            </div>
                        </div>
                    );
                })}
                {/* Invisible element to anchor the scroll */}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={myMessage}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    onChange={(e) => setMyMessage(e.target.value)} 
                />
                <button className="send-btn" onClick={sendMessage}>Send</button>
            </div>
        </aside>
    );
}

export default ChatRoom;