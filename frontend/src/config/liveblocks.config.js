
import {createClient} from "@liveblocks/client";
import {createRoomContext} from "@liveblocks/react";

const client = createClient({
    publicApiKey : "pk_dev_UD01n4s9pAWrwgr-LO4fMWRQ7GiKS_FPCMho17msh5PkaVLzD4y1JXAVnXJTtmav"
});

export const {
    RoomProvider, 
    useRoom,
    useBroadcastEvent,
    useEventListener
} = createRoomContext(client);