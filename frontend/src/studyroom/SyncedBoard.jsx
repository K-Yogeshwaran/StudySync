import { Tldraw, createTLStore, defaultShapeUtils, AssetRecordType, createShapeId } from "tldraw";
import "tldraw/tldraw.css";
import { RoomProvider, useRoom, useBroadcastEvent, useEventListener } from "../config/liveblocks.config";
import { useState, useEffect } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

// ---------------------------------------------------------
// 1. THE WRAPPER (Fixed API Timing)
// ---------------------------------------------------------
function SyncedBoard({ roomCode }) {
    const [isHost, setIsHost] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const roomResponse = await fetch("http://localhost:8080/studyRoom/" + roomCode);
                const actualRoomData = await roomResponse.json();
                console.log("\nFrom SyncedBoard component. The room data is: \n", actualRoomData);

                const userDataResponse = await fetch("http://localhost:8080/user/" + actualRoomData.createrId);
                const actualUserData = await userDataResponse.json();
                console.log("\nCreator data of this room: \n", actualUserData);

                const currentUserId = sessionStorage.getItem("userId");
                
                if (String(actualUserData.id) === String(currentUserId)) {
                    setIsHost(true);
                } else {
                    setIsHost(false);
                }

            } catch (error) {
                console.error("Error fetching room data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchRoomData();
    }, [roomCode]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Verifying Study Room Details...
            </div>
        );
    }

    return (
        <RoomProvider id={roomCode} initialPresence={{}}>
            <div style={{ width: "100vw", height: "100vh" }}>
                <WhiteBoard isHost={isHost} />
            </div>
        </RoomProvider>
    );
}

// ---------------------------------------------------------
// 2. THE TRANSLATOR HOOK
// ---------------------------------------------------------
function useYjsStore({ room }) {
    const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));
    const [storeWithStatus, setStoreWithStatus] = useState({ status: 'loading' });

    useEffect(() => {
        let unmounted = false;
        const yDoc = new Y.Doc();
        const yMap = yDoc.getMap('tldraw-data');
        const yProvider = new LiveblocksYjsProvider(room, yDoc);

        yProvider.on('synced', () => {
            if (unmounted) return;

            const initialRecords = [];
            yMap.forEach((record) => initialRecords.push(record));
            if (initialRecords.length > 0) {
                store.mergeRemoteChanges(() => { store.put(initialRecords); });
            }

            yMap.observe((event) => {
                store.mergeRemoteChanges(() => {
                    const toPut = [];
                    const toRemove = [];

                    event.changes.keys.forEach((change, key) => {
                        if (change.action === 'add' || change.action === 'update') {
                            toPut.push(yMap.get(key));
                        } else if (change.action === 'delete') {
                            toRemove.push(key);
                        }
                    });

                    if (toPut.length > 0) store.put(toPut);
                    if (toRemove.length > 0) store.remove(toRemove);
                });
            });

            const removeStoreListener = store.listen(
                ({ changes }) => {
                    yDoc.transact(() => {
                        Object.values(changes.added).forEach((record) => { yMap.set(record.id, record); });
                        Object.values(changes.updated).forEach(([_, record]) => { yMap.set(record.id, record); });
                        Object.values(changes.removed).forEach((record) => { yMap.delete(record.id); });
                    });
                },
                { source: 'user', scope: 'document' }
            );

            setStoreWithStatus({ status: 'synced-remote', store });

            return () => removeStoreListener();
        });

        return () => {
            unmounted = true;
            yProvider.destroy();
            yDoc.destroy();
        };
    }, [room, store]);

    return storeWithStatus;
}

// ---------------------------------------------------------
// 3. THE BOARD (Now with Drag & Drop PPTX Support!)
// ---------------------------------------------------------
function WhiteBoard({ isHost = false }) {
    const room = useRoom();
    const { status, store } = useYjsStore({ room });
    const [editor, setEditor] = useState(null);
    const broadcast = useBroadcastEvent();
    const [isFollowing, setIsFollowing] = useState(false);
    
    // UI state to show a loading spinner while fetching slides
    const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);

    useEventListener(({ event }) => {
        if (event.type === "CAMERA_SYNC" && editor && isFollowing) {
            editor.setCamera(
                { x: event.camera.x, y: event.camera.y }, 
                event.camera.z,
                { duration: 50 }
            );
        }
    });

    // --- THE NEW DROP HANDLER ---
    const handleDrop = async (e) => {
        e.preventDefault();
        
        const presentationID = e.dataTransfer.getData("presentationID");
        const fileType = e.dataTransfer.getData("fileType");
        
       /*  // Ensure it's a presentation drop and that our editor is ready
        if (!presentationID || !editor || !fileType.includes("presentation")) return; */

        try {
            setIsGeneratingSlides(true); // Show a loading indicator

            // Fetch the image URLs from the Spring Boot backend
            const response = await fetch(`http://localhost:8080/studyMaterials/presentation/${presentationID}/slides`);
            if (!response.ok) throw new Error("Failed to fetch slides");
            const slideUrls = await response.json();

            // Calculate starting coordinates based on the user's current view
            const currentCamera = editor.getCamera();
            let currentY = currentCamera.y + 50; 
            const startX = currentCamera.x + 50;
            
            const slideWidth = 800;  
            const slideHeight = 450; 
            const gap = 50;          

            const assetsToCreate = [];
            const shapesToCreate = [];

            // Loop through URLs to create tldraw assets and shapes
            slideUrls.forEach((url, index) => {
                const assetId = AssetRecordType.createId();
                const shapeId = createShapeId();

                assetsToCreate.push({
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    meta : {},
                    props: {
                        w: slideWidth,
                        h: slideHeight,
                        name: `slide-${index}.png`,
                        isAnimated: false,
                        mimeType: 'image/png',
                        src: url, 
                    },
                });

                shapesToCreate.push({
                    id: shapeId,
                    type: 'image',
                    x: startX,
                    y: currentY, 
                    meta : {},
                    props: {
                        assetId: assetId,
                        w: slideWidth,
                        h: slideHeight,
                    },
                });

                currentY += (slideHeight + gap); 
            });

            // Batch create everything on the canvas
            editor.createAssets(assetsToCreate);
            editor.createShapes(shapesToCreate);

        } catch (error) {
            console.error("Error loading presentation to canvas:", error);
            alert("Could not load presentation onto the board.");
        } finally {
            setIsGeneratingSlides(false); // Hide the loading indicator
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow a drop on this div
    };

    if (status === 'loading') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading study room ...</div>;
    }

    return (
        <div 
            style={{ position: "relative", width: "100%", height: "100%" }}
            onDropCapture={handleDrop}
            onDragOverCapture={handleDragOver}
        >   
            {/* Show a friendly overlay while the slides are fetching/generating */}
            {isGeneratingSlides && (
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    zIndex: 2000, display: "flex", justifyContent: "center", alignItems: "center",
                    fontSize: "20px", fontWeight: "bold"
                }}>
                    Pasting Slides to Canvas...
                </div>
            )}

            {!isHost && (
                <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    style={{
                        position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
                        zIndex: 1000, padding: "10px 20px", borderRadius: "8px", border: "none",
                        backgroundColor: isFollowing ? "#ef4444" : "#3b82f6", color: "white",
                        fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                    }}
                >
                    {isFollowing ? "Stop Following" : "Follow Host"}
                </button>
            )}

            <Tldraw
                store={store}
                onMount={(tldrawEditor) => {
                    setEditor(tldrawEditor);

                    let lastBroadcastTime = 0;

                    tldrawEditor.store.listen(
                        ({ changes }) => {
                            if (!isHost) return;

                            const cameraUpdated = Object.values(changes.updated).find(
                                (c) => c[1].typeName === 'camera'
                            );

                            if (cameraUpdated) {
                                const now = Date.now();
                                
                                if (now - lastBroadcastTime > 50) {
                                    const newCamera = cameraUpdated[1];
                                    broadcast({
                                        type: "CAMERA_SYNC",
                                        camera: { x: newCamera.x, y: newCamera.y, z: newCamera.z }
                                    });
                                    lastBroadcastTime = now;
                                }
                            }
                        },
                        { source: 'user', scope: 'session' }
                    );
                }}
            />
        </div>
    );
}

export default SyncedBoard;