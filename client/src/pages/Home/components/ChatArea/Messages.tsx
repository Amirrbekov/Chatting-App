

const Messages = () => {
    return (
        <div className="messages">
            <div className="message received">
                <p>Hey, how are you?</p>
                <span className="timestamp">10:00 AM</span>
            </div>
            <div className="message sent">
                <p>I'm good, thanks! How about you?</p>
                <span className="timestamp">10:05 AM</span>
            </div>
            <div className="message received">
                <p>Do you want to grab lunch later?</p>
                <span className="timestamp">10:10 AM</span>
            </div>
            <div className="message sent">
                <p>Sure, let's meet at 12:30 PM.</p>
                <span className="timestamp">10:15 AM</span>
            </div>
        </div>
    )
}

export default Messages;