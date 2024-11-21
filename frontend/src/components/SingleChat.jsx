import { useState, useEffect } from 'react'
import axios from 'axios'
import { ChatState } from '../Context/chatProvider'
import { Box, IconButton, Text, Button, Spinner, FormControl, Textarea, useToast, Input } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSenderName, getSender } from './config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputMessage, setInputMessage] = useState("")
    const { chatUser, selectedChat, setSelectedChat } = ChatState()
    const toast = useToast()

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setIsLoading(true)
                const config = {
                    headers: {
                        Authorization: `Bearer ${chatUser.token}`
                    }
                }

                const { data } = await axios.get(
                    `/api/message/${selectedChat._id}`,
                    config
                )

                setMessages(data)
                setIsLoading(false)
        } catch (err) {
            toast({
                title: "Fail to load the messages.",
                status: "error",
                description: err?.response?.data?.message,
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const sendMessage = async (e) => {
        console.log(e);
        if (!inputMessage) return
        if (e.key === "Enter" || e.type === "click") {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${chatUser.token}`
                    }
                }

                setInputMessage("")

                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: inputMessage,
                        chatId: selectedChat._id
                    },
                    config
                )

                
                console.log("Single Chat", data);
                setMessages(prev => [...prev, data])

            } catch (err) {
                toast({
                    title: "Error occurs",
                    status: "error",
                    description: err?.message,
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
            }
        }
    }

    const typingHandler = (e) => {
        setInputMessage(e.target.value)
    }

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    return (
        <>
            {selectedChat ? (
                <>
                    {/* // Chat header */}
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="inherit"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />

                        {/** Display the name of the chat */}
                        {selectedChat.isGroupChat ? (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                >
                                    <Button>Setting</Button>
                                </UpdateGroupChatModal>
                            </>
                        ) : (
                            <>
                                {getSenderName(chatUser, selectedChat.users)}
                                <ProfileModal user={getSender(chatUser, selectedChat.users)} />
                            </>
                        )}
                    </Text>

                    {/* // Chat content */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        p={3}
                        m={2}
                        mb={0}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {isLoading && (
                            <Spinner
                                size="xl"
                                alignSelf="center"
                                w={20}
                                h={20}
                                margin="auto"
                            />
                        )}
                        {!isLoading && (
                            <div className="message">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            marginTop={3}
                            display="flex"
                            gap={2}
                        >
                            <Input
                                bg="#E0E0E0"
                                variant="filled"
                                onChange={typingHandler}
                                value={inputMessage}
                                paddingLeft="8px"
                            />
                            <Button
                                onClick={sendMessage}
                            >
                                Send
                            </Button>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Text
                        fontSize="3xl"
                        fontFamily="inherit"
                    >
                        Click to a panel in the message to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
