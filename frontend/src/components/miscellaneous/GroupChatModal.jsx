import {
    FormControl, Input, useDisclosure,
    useToast, Button, Box
} from '@chakra-ui/react'
import {
    Modal, ModalHeader,
    ModalBody, ModalCloseButton,
    ModalFooter, ModalOverlay,
    ModalContent
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchWord, setSearchWord] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { chatUser, chats, setChats } = ChatState()

    const handleSearchUsers = async (query) => {
        setSearchWord(query)
        if (!query) return;

        try {
            setIsLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${query}`, config)
            console.log("Data in search create group modal", data)
            setIsLoading(false)
            setSearchResult(data)
        } catch (err) {
            toast({
                title: "Fail to load the search result",
                status: "error",
                description: err?.message,
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const handleSubmit = async () => {
        console.log("selected users", selectedUsers);
        if (!groupChatName || selectedUsers.length < 2) {
            toast({
                title: "Fill in all the required fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }

            const { data } = await axios.post(
                "/api/chat/group",
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(u => u._id))
                },
                config)
            setChats(prev => [data, ...prev])
            onClose()
            toast({
                title: "New group chat has been created.",
                description: `Name: ${groupChatName}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        } catch (err) {
            toast({
                title: "Fail to create the group chat",
                description: err?.response.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const handleDelete = (userToDel) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDel._id))
    }

    const handleAddUser = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "This user is already selected.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }
        setSelectedUsers(prev => ([...prev, userToAdd]))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="inherit"
                        display="flex"
                        justifyContent="center"
                    >
                        Create group chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='User to find'
                                mb={3}
                                value={searchWord}
                                onChange={(e) => handleSearchUsers(e.target.value)}
                            />
                        </FormControl>

                        <Box
                            display="flex"
                            padding={2}
                        >
                            {selectedUsers.length > 0 && selectedUsers?.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        <Box
                            ml={0}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            {isLoading && (<p>Loading...</p>)}
                            {searchResult?.length > 0 ? (
                                searchResult?.slice(0, 4).map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            ) : (
                                <p>No user found.</p>
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='pink' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModal
