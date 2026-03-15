import {useState,useEffect} from "react";

function Participants({roomCode}) {

    const [participants, setParticipants] = useState([]);

    useEffect(() => {

        const fetchParticipants = async () => {
            try{
            const participantsResponse = await fetch("http://localhost:8080/studyRoom/participants/" + roomCode)
            const actualParticipantsData = await participantsResponse.json();
            setParticipants(actualParticipantsData);
            }
            catch(error){
                console.log("Error in fetching participants : "+error);
            }
        }

        fetchParticipants();

        return () => console.log("Clean up function called");
    },[roomCode]);

    return (
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
    )
}

export default Participants