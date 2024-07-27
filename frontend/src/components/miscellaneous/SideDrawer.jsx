import axios from 'axios'
import { useState, useEffect } from 'react'
import {
    Avatar,
    Button,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuList,
    MenuItem,
    Drawer,
    DrawerContent,
    DrawerBody,
    DrawerHeader,
    Tooltip,
    useToast
}
    from '@chakra-ui/react'
import { Box, Text } from "@chakra-ui/layout";
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider'
import ProfileModal from './ProfileModal'

const SideDrawer = () => {
    const [searchInput, setSearchInput] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const [searchInitiated, setSearchInitiated] = useState(false);
    const { chatUser: user, setSelectedChat, chats, setChats } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const navigate = useNavigate()

    const handleSearch = async () => {
        setSearchInitiated(true);
        if (!searchInput) {
            toast({
                title: "Please enter username or email to search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            return;
        }

        // call back-end
        try {
            setIsLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`/api/user?search=${searchInput}`, config)
            setSearchResult(data)
            setIsLoading(false)

        } catch (err) {
            toast({
                title: "Error occurs",
                status: "error",
                description: "Fail to load the search result.",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json"
                }
            }

            const { data } = await axios.post(`/api/chat`, { userId }, config)

            // append the chat to the chats array if it is a new created one
            if (!chats.find(c => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (err) {
            toast({
                title: "Fetching the chat failed.",
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    label="Search user to chat"
                    hasArrow
                    placement='bottom-end'
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }}>Search User</Text>
                    </Button>
                </Tooltip>

                <div>
                    <Text fontSize="2xl" fontFamily="inherit">
                        MyChat App
                    </Text>
                </div>

                <div>
                    <Menu>
                        <MenuButton p="1">
                            <BellIcon fontSize="2xl" m="1" />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search User
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb="2">
                            <Input
                                placeholder='Search by username or email'
                                mr={2}
                                value={searchInput}
                                p={2}
                                fontSize={14}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Search</Button>
                        </Box>

                        {isLoading ? (
                            <ChatLoading />
                        ) : (
                            searchInitiated && (
                                searchResult.length > 0 ? (
                                    searchResult.map(user => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                ) : (
                                    <p>No users found</p>
                                )
                            )
                        )}
                        {loadingChat && (<p>Loading chat...</p>)}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
