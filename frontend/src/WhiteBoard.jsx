import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState } from "react";
import { useWebSocket } from "./config/WebSocketConfig";

function WhiteBoard({ roomCode }) {
    const [editor, setEditor] = useState(null);
    const { stompClient } = useWebSocket();

    // 1. Handle incoming changes from other users
    useEffect(() => {
        if (!editor || !stompClient || !stompClient.connected) return;

        const subscription = stompClient.subscribe(`/topic/whiteboard/${roomCode}`, (payload) => {
            const update = JSON.parse(payload.body);
            
            // Prevent feedback loops: only apply if the message isn't from us
            if (update.clientId !== sessionStorage.getItem("userId")) {
                
            }
            // 'mergeRemoteChanges' applies the delta to the local board
                editor.store.mergeRemoteChanges(() => {
                    editor.store.put(Object.values(update.changes.added));
                    editor.store.put(Object.values(update.changes.updated).map(u => u[1]));
                    editor.store.remove(Object.keys(update.changes.removed));
                });
        });

        return () => subscription.unsubscribe();
    }, [editor, stompClient, roomCode]);

    // 2. Handle local changes and send them to the server
    const handleMount = (editor) => {
        setEditor(editor);

        // Listen to every change made on the board
        editor.store.listen((event) => {
            // We only care about user-initiated changes (source === 'user')
            if (event.source !== 'user') return;

            const message = {
                clientId: sessionStorage.getItem("userId"),
                roomCode: roomCode,
                changes: event.changes
            };

            if (stompClient && stompClient.connected) {
                stompClient.send(`/app/whiteboard/${roomCode}`, {}, JSON.stringify(message));
            }
        });

        // 3. Load past state from Backend
        fetchPastState(editor);
    };

    async function fetchPastState(editor) {
        try {
            const response = await fetch(`http://localhost:8080/whiteboard/history/${roomCode}`);
            const data = await response.json();
            if (data && data.length > 0) {
                // Load all existing shapes into the editor at once
                editor.store.put(data);
            }
        } catch (e) {
            console.error("Failed to load whiteboard history", e);
        }
    }

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <Tldraw onMount={handleMount} />
        </div>
    );
}

export default WhiteBoard;