import Searchbar from "./Searcbar";
import ChatList from "./ChatList";
import Footer from "./Footer";
import { FaPlus, FaUsers } from "react-icons/fa";


const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-buttons">
                <button className="new-message-button">
                    <FaPlus /> New Message
                </button>
                 <button className="create-channel-button">
                    <FaUsers /> Create Channel
                </button>
            </div>
            <Searchbar/>
            <ChatList/>
            <Footer/>
        </div>
    )
}

export default Sidebar;