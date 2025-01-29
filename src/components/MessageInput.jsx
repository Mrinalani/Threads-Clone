import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import {IoSendSharp} from "react-icons/io5"
import React, { useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import useShowToast from '../hooks/useShowToast'
import { BsFillImageFill } from 'react-icons/bs'
import usePreviewImg from "../hooks/usePreviewImage"


const MessageInput = ({setMessages, messages}) => {
  const [messageText, setMessageText] = useState()
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const showToast = useShowToast();
  const setConnversations = useSetRecoilState(conversationsAtom)
  const imageRef = useRef(null)
  const {onClose} = useDisclosure()
  const { handleImageChange, imgUrl, setImageUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false)


    const handeleSendMessage = async(e) => {
      e.preventDefault()
      if(!messageText && !imgUrl) return;
      if(isSending) return

      setIsSending(true)
      try {
        const res = await fetch("/api/messages",{
          method: "Post",
          headers: {
            "content-Type": "application/json" 
          },
          body: JSON.stringify({message: messageText, recipientId: selectedConversation.userId, img: imgUrl})
        })
        const data = await res.json()
        if(data.error){
          showToast("Error", data.error, "error")
          return
        }
        setMessages((messages) => [...messages, data])
        setConnversations(prevConv =>{
          const updatedConversation = prevConv.map((conversation)=> {
            if(conversation._id === selectedConversation._id){
              return {
                ...conversation,
                lastMessage: {
                  text: messageText,
                  sender: data.sender
                }
              }
            }
            return conversation;
          })
          return updatedConversation
        })
        setMessageText("")
        setImageUrl("")
        console.log(data);
      } catch (error) {
        showToast("Error", error, "error")

      }finally{
        setIsSending(false)
      }
      
    }

    console.log("message inside message input", messages)
  return (
    <Flex gap={2} alignItems={"center"}>
    <form onSubmit={handeleSendMessage} style={{flex: 95}}>
       <InputGroup>
       <Input
       w={"full"}
       value={messageText}
       placeholder='Type a message...' onChange={(e) => setMessageText(e.target.value)}/>
        <InputRightElement onClick={handeleSendMessage} cursor={"pointer"}>
         <IoSendSharp />
        </InputRightElement>  
       </InputGroup>
    </form>

    <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange}  />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
          setImageUrl("")
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>		
            {!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handeleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>
  )
}

export default MessageInput
