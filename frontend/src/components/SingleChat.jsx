import React from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSenderName, getSender } from './config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { chatUser, selectedChat, setSelectedChat } = ChatState()

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
                                {/* <UpdateGroupChatModal /> */}
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
