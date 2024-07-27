import {useState} from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import Message from '../components/Message'
import ChatBox from '../components/ChatBox'

const Chat = () => {
    const { chatUser } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <div style={{ width: "100%" }}>
            {chatUser && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                bg="white"
                w="100%"
                h="91.5vh"
                p="5px 10px"
                borderWidth="5px"
            >
                {chatUser && <Message fetchAgain={fetchAgain} />}
                {chatUser && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default Chat
