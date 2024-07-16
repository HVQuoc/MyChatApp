import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    VStack, FormControl, FormLabel,
    Input, InputRightElement, Button,
    InputGroup,
    useToast
} from '@chakra-ui/react'

const LoginForm = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setUserData({ ...userData, [name]: value })
    }

    const handleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const submitHandler = async () => {
        setIsLoading(true)
        if (!userData.email || !userData.password) {
            toast({
                title: 'Cannot sign in.',
                description: "Please fill in all the required fields.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setIsLoading(false)
        }

        // try to log in using axios
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const { data } = await axios.post("/api/user/login", { ...userData }, config)

            toast({
                title: 'Log in successfully!',
                description: `You're now log in as ${data?.email}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            setIsLoading(false)
            navigate("/chats")

        } catch (err) {
            toast({
                title: 'Error occurs.',
                description: err?.response.data?.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setIsLoading(false)
        }

    }

    return (
        <VStack spacing='5px'>
            <FormControl isRequired>
                <FormLabel>Email: </FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={handleInputChange}
                    name='email'
                    value={userData.email}
                    type='email'
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password: </FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Password'
                        onChange={handleInputChange}
                        name='password'
                        value={userData.password}
                        type={showPassword ? "text" : "password"}
                    />
                    <InputRightElement width='10%'>
                        <Button size='sm' marginRight="5px" padding={"4px"} onClick={handleShowPassword}>
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='pink'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={isLoading}
            >
                Login
            </Button>
            <Button
                colorScheme='gray'
                width="100%"
                style={{ marginTop: 8 }}
                onClick={() => setUserData({
                    email: "guest@example.com",
                    password: "123456"
                })}
            >
                Get guest user credentials
            </Button>
        </VStack>
    )
}

export default LoginForm
