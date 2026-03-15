import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {WebSocketProvider} from "./config/WebSocketConfig.jsx";

import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import StudyRoomHome from './StudyRoomHome.jsx';
import Dashboard from './Dashboard.jsx';
import ClassRoom from './ClassRoom.jsx';

const router = createBrowserRouter([
    {
        path : "/",
        element : <HomePage/>
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path : "/register",
        element : <RegisterPage/>
    },
    {
        path : "/studyRoom/:roomCode",
        element : <StudyRoomHome />
    },
    {
        path : "/dashboard",
        element : <Dashboard />
    },
    {
        path : "/classroom/:roomCode",
        element : <ClassRoom/>
    }
]);

createRoot(document.getElementById('root')).render(
    <WebSocketProvider>
        <RouterProvider router={router} />
    </WebSocketProvider>
)
