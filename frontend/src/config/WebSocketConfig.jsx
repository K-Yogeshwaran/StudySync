import {useState, useEffect, useContext , createContext} from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);

    const connect = (roomCode, username) => {
        if(stompClient?.connected)
            return;
        const socket = new SockJS("http://localhost:8080/studySync");
        const client = Stomp.over(socket);

        client.connect({"username" : username,"room_id" : roomCode},() => {
            setStompClient(client);
            setConnected(true);
        });
    };

    const disconnect = () => {
        if(stompClient){
            stompClient.disconnect();
            setConnected(false);
            setStompClient(null);
        }
    };

    return (
        <WebSocketContext.Provider value={{stompClient,connected,connect, disconnect}}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);