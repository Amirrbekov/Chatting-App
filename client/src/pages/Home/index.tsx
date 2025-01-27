import Sidebar from "./components/sidebar";

import '../../styles/Home.css'
import ChatArea from "./components/ChatArea";
import useAuthStore from "../../zustand/useAuthStore";
import { useEffect } from "react";
import { getSocket } from "../../lib/socket";

const Home = () => {
    const { user } = useAuthStore();

    const socket = getSocket();

    useEffect(() => {
        
    })

    
    return (
        <div className="home-container">
            <Sidebar/>
            <ChatArea/>
        </div>
    )
}

export default Home;