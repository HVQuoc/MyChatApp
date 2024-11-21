import { useState, useEffect } from 'react'
import { ChatState } from '../Context/chatProvider'
import {
  useToast, Box,
  Stack, Text,
  Button
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import { getSenderName } from './config/chatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'

const Message = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { chatUser, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${chatUser.token}`
        }
      }

      const { data } = await axios.get("/api/chat", config)
      setChats(data)

      console.log("fetched chats", data);
    } catch (err) {
      toast({
        title: "Loading chats failed.",
        status: "error",
        description: err?.message,
        duration: 5000,
        isClosable: true,
        position: "top-right"
      })
    }
  }

  //console.log("Message renders, selected chat:", selectedChat);
  useEffect(() => {
    setLoggedUser(chatUser)
    fetchChats()
  }, [])

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        fontSize={{ base: "26px", md: "30px" }}
        fontFamily="inherit"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={26} p={0} m={0}>Message</Text>
        <GroupChatModal>
          <Button
            padding={2}
            display="flex"
            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={2}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >

        {/*we should split this stack to a component
            whose parameters are: chats, selectedChat
            so whenever the selectedChat be changed, we re-render it only */}
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "#FFC0CB" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={2}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSenderName(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender?.name}: </b>
                    {chat.latestMessage.content?.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default Message
