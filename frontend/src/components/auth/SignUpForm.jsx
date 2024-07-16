import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  VStack, Input, FormControl,
  FormLabel, InputGroup, Button,
  InputRightElement, Box,
  useToast
} from '@chakra-ui/react'

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: ""
  })
  const [pic, setPic] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    setSignUpData({ ...signUpData, [name]: value })
  }

  const postDetails = (pics) => {
    setIsLoading(true);
    if (pic === undefined) {
      toast({
        title: 'Add credential.',
        description: "Please select an image.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      setIsLoading(false)
      return;
    }

    console.log("selected pics", pics);

    if (pics?.type === "image/jpg" || pics?.type === "image/png" || pics?.type === "image/jpeg") {
      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "my-chat-app")
      data.append("cloud_name", "quochoangcloudy")
      fetch("https://api.cloudinary.com/v1_1/quochoangcloudy/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
        .then(data => {
          setPic(data?.url.toString());
          console.log("link image uploaded", data?.url.toString());
          setIsLoading(false);
        })
        .catch(err => {
          console.log("Error uploading image", err);
          setIsLoading(false)
        })
    } else {
      toast({
        title: 'Add credential.',
        description: "Please select an image.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      setIsLoading(false)
      return;
    }
  }

  const submitHandler = async () => {
    setIsLoading(true)
    if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast({
        title: 'Fill in all the required fields.',
        description: "Please enter all the fill to be enable to submit the form.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      setIsLoading(false)
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: 'Password does not match',
        description: "Please enter the confirm password correctly.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      setIsLoading(false)
      return;
    }

    // otherwise submit the form to the server
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const { data } = await axios.post(
        "api/user",
        { ...signUpData },
        config
      )

      toast({
        title: 'Register successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      setIsLoading(false)
      navigate("/chats")

    } catch (err) {
      console.log("err when submit signup form", err);
      toast({
        title: 'Error occur.',
        description: err?.response.data.message,
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
        <FormLabel>Name: </FormLabel>
        <Input
          placeholder='Enter your name'
          onChange={handleInputChange}
          name='name'
          value={signUpData.name}
          type='text'
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email: </FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={handleInputChange}
          name='email'
          value={signUpData.email}
          type='email'
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password: </FormLabel>
        <InputGroup>
          <Input
            placeholder='Enter your password'
            onChange={handleInputChange}
            name='password'
            value={signUpData.password}
            type={showPassword ? "text" : "password"}
          />
          <InputRightElement width='10%'>
            <Button size='sm' marginRight="5px" padding={"4px"} onClick={() => { setShowPassword(prev => !prev) }}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm password: </FormLabel>
        <InputGroup>
          <Input
            placeholder='Type password again'
            onChange={handleInputChange}
            name='confirmPassword'
            value={signUpData.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
          />
          <InputRightElement width='10%'>
            <Button size='sm' marginRight="5px" padding={"4px"} onClick={() => { setShowConfirmPassword(prev => !prev) }}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your picture: </FormLabel>
        <Input
          type="file"
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
        {pic && (
          <Box
            id='upload-image'
            marginTop="10px"
          >
            <img src={pic} alt="profile image upload" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
          </Box>
        )}
      </FormControl>
      <Button
        colorScheme='pink'
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={isLoading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default SignUpForm
