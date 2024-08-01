import { useState } from 'react'
import {
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    Text,
    Box,
    FormGroup,
    FormControl,
    Input,
    useToast

} from '@chakra-ui/react'
import { ChatState } from '../../Context/chatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'


const UpdateGroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {

    const [groupChatName, setGroupChatName] = useState("")
    const [renameLoading, setRenameLoading] = useState(false)
    const [searchWord, setSearchWord] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { chatUser, selectedChat, setSelectedChat } = ChatState()
    const toast = useToast()

    const handleRename = async () => {
        console.log("Rename handle clicked!");
        if (!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }

            const { data } = await axios.put(
                "/api/chat/rename",
                {
                    chatId: selectedChat._id,
                    newName: groupChatName
                },
                config
            )

            toast({
                title: "This group has been renamed.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            })

            // console.log("set again")
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
        } catch (err) {
            toast({
                title: "Error occurs!",
                status: "error",
                description: err?.response?.data?.message,
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        } finally {
            setRenameLoading(false)
            setGroupChatName("")
        }
    }

    const handleLeaveGroup = async (userToLeave) => {
        if (userToLeave._id !== chatUser._id) {
            toast({
                title: "You are not allowed to leave the group",
                description: "Your session does not match the current chat user's one.",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
        }
        try {
            setIsLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }
            const { data } = await axios.put(
                "/api/chat/group-remove",
                {
                    chatId: selectedChat._id,
                    userId: userToLeave._id
                },
                config
            )

            toast({
                title: "Successfully leaving the group!",
                description: `Group name '${selectedChat?.chatName}' .`,
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top"
            })

            // uploading state
            userToLeave._id === chatUser._id ? setSelectedChat(null) : setSelectedChat(data)
            setFetchAgain(prev => !prev)
            setIsLoading(false)
        } catch (err) {
            toast({
                title: "Error occurs.",
                description: err?.response?.data?.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
            setIsLoading(false)
        }
    }

    const handleRemoveUser = async (userToRemove) => {
        // console.log("remove user from group chat clicked!");
        if (selectedChat.groupAdmin._id !== chatUser._id) {
            toast({
                title: "Only admin can remove others.",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
            return
        }

        if (selectedChat.groupAdmin._id === chatUser._id &&
            userToRemove._id === chatUser._id
        ) {
            toast({
                title: "Click the 'Leave Group' button to leave this group.",
                description: "You're the admin. After leaving other would be the admin.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            setIsLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }
            const { data } = await axios.put(
                "/api/chat/group-remove",
                {
                    chatId: selectedChat._id,
                    userId: userToRemove._id
                },
                config
            )

            // uploading state
            userToRemove._id === chatUser._id ? setSelectedChat(null) : setSelectedChat(data)

            setFetchAgain(prev => !prev)
            setIsLoading(false)
            toast({
                title: "Remove user",
                description: `User '${userToRemove.name}' has been removed from this group.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top"
            })

        } catch (err) {
            toast({
                title: "Error occurs.",
                description: err?.response?.data?.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
            setIsLoading(false)
        }
    }

    const handleAddUser = async (userToAdd) => {
        console.log("Add user button clicked!");
        if (selectedChat.users.find(u => u._id === userToAdd._id)) {
            toast({
                title: "This user is already in this group.",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            setIsLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${chatUser.token}`
                }
            }
            const { data } = await axios.put(
                "/api/chat/group-add",
                {
                    userId: userToAdd._id,
                    chatId: selectedChat._id
                },
                config
            )

            setSelectedChat(data)
            setIsLoading(false)
            setFetchAgain(prev => !prev)
            toast({
                title: "Successfully!",
                description: `${userToAdd.name} has been added to this group.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top"
            })
        } catch (err) {
            toast({
                title: "Error occurs! Can not add user to this group.",
                status: "error",
                description: err?.response?.data?.message,
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            setIsLoading(false)
        }
    }

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

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontFamily="inherit"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Text fontSize="24px">Update group chat</Text>
                        <Text fontSize="18px">{selectedChat.chatName}</Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Text>Member list:</Text>
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            mr={0}
                        >
                            {selectedChat.users.map((u, i) => (
                                <UserBadgeItem
                                    key={i}
                                    user={u}
                                    handleFunction={() => handleRemoveUser(u)}
                                />
                            ))}
                        </Box>
                        <hr />

                        {/* Adding user to group */}
                        <Text mt={2}>Add user to group:</Text>
                        <FormControl
                            my={2}
                        >
                            <Input
                                placeholder='User to find'
                                mb={1}
                                value={searchWord}
                                onChange={(e) => handleSearchUsers(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            ml={0}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            {isLoading && (<p>Loading...</p>)}
                            {searchResult?.length > 0 && (
                                searchResult?.map((user, index) => (
                                    <UserListItem
                                        key={index}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )}
                        </Box>

                        <hr />
                        {/* Renaming group */}
                        <Text mt={2}>Updating group name:</Text>
                        <FormControl
                            display="flex"
                            my={2}
                        >
                            <Input
                                placeholder='Group chat name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                colorScheme="pink"
                                marginLeft="5px"
                                onClick={handleRename}
                                isLoading={renameLoading}
                            >
                                Update
                            </Button>
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleLeaveGroup(chatUser)}>   
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
