import { FormEvent, useState } from "react"

import '../../../../styles/CreateModal.css'


interface CreateChannelProps {
    isOpen: boolean
    onClose: () => void
    onCreateChannel: (channelName: string) => void
}

export function ChannelModal({ isOpen, onClose, onCreateChannel }: CreateChannelProps)  {

    const [channelName, setChannelName] = useState("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (channelName.trim()) {
          onCreateChannel(channelName.trim())
          setChannelName('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="modalBackdrop" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Channel</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={channelName}
                        onChange={e => setChannelName(e.target.value)}
                        placeholder="Enter channel name"
                        className="input"
                        required
                    />
                    <div className="buttonContainer">
                        <button type="submit" className="createButton">Create Channel</button>
                        <button type="button" onClick={onClose} className='cancelButton'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}