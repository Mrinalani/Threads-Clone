import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePreviewImage from '../hooks/usePreviewImage'
import { BsFillImageFill } from 'react-icons/bs'
import useShowToast from '../hooks/useShowToast'

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState("");
    const {handleImageChange, imgUrl, setImageUrl} = usePreviewImage()
    const imageRef = useRef()
    const showToast = useShowToast()

    const handleTextChange = () => {

    }


  return (
    <>
      <Button position={"fixed"} bottom={10} right={10} leftIcon={<AddIcon /> } bg={useColorModeValue("gray.300", "gray.dark")} onClick={onOpen}>
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl >
                <Textarea placeholder='Post content goes here' onChange={handleTextChange} value={postText}/>
                <Text fontSize={"xl"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.800"}>500/500</Text>
                <Input type='file' hidden ref={imageRef} onChange={handleImageChange}/>
                <BsFillImageFill 
                style={{marginLeft:"5px", cursor: "pointer"}}
                size={16}
                onClick={()=> imageRef.current.click()}
                />
            </FormControl>

            {imgUrl && (
                <Flex mt={5} position={"relative"}>
                    <Image src={imgUrl} alt='Selected Img' />
                    <CloseButton onClick={()=>setImageUrl("")} bg={"gray.800"} position={"absolute"} top={2} right={2}/>
                </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
