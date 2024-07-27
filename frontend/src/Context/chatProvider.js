import {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react'
import { useNavigate } from 'react-router-dom'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [chatUser, setChatUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (!userInfo) {
            navigate("/")
        } else {
            setChatUser(userInfo)
        }
    }, [navigate])

    return (
        <ChatContext.Provider
            value={{chatUser, setChatUser, selectedChat,setSelectedChat, chats, setChats }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider;