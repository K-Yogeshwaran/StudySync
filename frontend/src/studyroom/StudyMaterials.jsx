import { useState, useEffect } from "react";
import "./StudyMaterials.css";

function StudyMaterials({ roomCode }) {

    const [materials, setMaterials] = useState([]);
    const [file, setFile] = useState(null);
    const [createrData, setCreaterData] = useState(null);
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const roomResponse = await fetch("http://localhost:8080/studyRoom/" + roomCode)
                const actualRoomData = await roomResponse.json();
                setRoomData(actualRoomData);

                const userDataResponse = await fetch("http://localhost:8080/user/" + actualRoomData.createrId)
                const actualUserData = await userDataResponse.json();
                setCreaterData(actualUserData);

                loadStudyMaterials();
            }
            catch (error) {
                console.log("Initialization error : " + error);
            }
        }
        
        if(roomCode){
            loadInitialData();
        }
    }, [roomCode]);

    // Handles selecting a file to upload
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    async function loadStudyMaterials() {
        console.log("Going to call the study material api");
        const studyMaterials = await fetch("http://localhost:8080/studyMaterials/" + roomCode)
        const actualStudyMaterials = await studyMaterials.json();
        setMaterials(actualStudyMaterials);
    }

    async function handleUpload() {
        console.log("Handle upload called");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", createrData.name);
        formData.append("roomCode", roomCode);
        
        try {
            const response = await fetch("http://localhost:8080/studyMaterials/upload/" + roomCode, {
                method: "POST",
                body: formData
            });
            const result = await response.text();   
            loadStudyMaterials(); // Refresh the list after upload
            setFile(null); // Clear the selected file from the UI
            console.log("Success : " + result);
        }
        catch (error) {
            console.log("Error : " + error);
        }
    }

    // FIX 1: Pass the specific item into the drag handler
    function handleDragStart(event, item){
        // We package the ID and Type into the drag event for the Whiteboard to read
        event.dataTransfer.setData("presentationID", item.fileId);
        event.dataTransfer.setData("fileType", item.contentType);
    }

    return (
        <section className="room-materials-middle">
            <div className="section-header">
                <h3>Study Materials ({materials.length})</h3>
                <div className="upload-controls">
                    <label className="custom-file-upload">
                        {/* FIX 2: Changed this from handleDragStart to handleChange */}
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
                    <div key={index} className="material-card" 
                        draggable={item.fileName.endsWith(".pptx")}
                        // FIX 3: Use an arrow function to pass the current 'item'
                        onDragStart={(event) => handleDragStart(event, item)}
                    >
                        <span className="file-icon">📄</span>
                        <div className="file-info">
                            <p className="file-name">{item.fileName}</p>
                            <small>By {item.uploadedBy}</small>
                        </div>
                        <a
                            href={`http://localhost:8080/studyMaterials/download/${item.fileId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="download-btn-icon"
                            download
                        >
                            📥
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default StudyMaterials;