import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Text,
  Tab, Tabs, TabList,
  TabPanels, TabPanel
} from '@chakra-ui/react'
import LoginForm from '../components/auth/LoginForm'
import SignUpForm from '../components/auth/SignUpForm'

const Home = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (userInfo) {
      navigate("/chats")
    }
  }, [navigate])

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='darkcyan'
        w='100%'
        borderRadius='xl'
        borderWidth='1px'
        margin="10px"
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Roboto"}
          color='black'
          textAlign='center'
        >
          My Chat App
        </Text>
      </Box>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        borderRadius='xl'
        borderWidth='1px'
      >
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><LoginForm /></TabPanel>
            <TabPanel><SignUpForm /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
