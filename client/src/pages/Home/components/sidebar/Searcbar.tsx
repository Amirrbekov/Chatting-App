import { FaSearch } from "react-icons/fa";


const Searchbar = () => {
    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search chats..." />
        </div>
    )
}

export default Searchbar;