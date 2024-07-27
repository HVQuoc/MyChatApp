import { Text, useDisclosure } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    IconButton,
    Button,
} from '@chakra-ui/react'
import { ViewIcon } from "@chakra-ui/icons"

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="inherit"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"                        
                    >
                        <Image 
                            borderRadius="full"
                            boxSize="150px"
                            src={user?.picture}
                            alt="user profile picture"
                        />
                        <Text marginTop="10px">Email: {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='pink' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
