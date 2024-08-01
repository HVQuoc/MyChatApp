import { Box, Avatar, Text } from '@chakra-ui/react'


const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            _hover={{
                background: "#38B2AC",
                color: "white"
            }}
            w="100%"
            display="flex"
            alignItems="center"
            p={2}
            m={2}
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email: </b>{user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem
