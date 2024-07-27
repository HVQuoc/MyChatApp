import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
      display="inline"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="pink"
      cursor="pointer"
    >
      {user.name}
      <CloseIcon p={1} onClick={handleFunction}/>
    </Box>
  )
}

export default UserBadgeItem
