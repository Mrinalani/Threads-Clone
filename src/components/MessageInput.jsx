import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import {IoSendSharp} from "react-icons/io5"
import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import useShowToast from '../hooks/useShowToast'

const MessageInput = ({setMessages}) => {
  const [messageText, setMessageText] = useState()
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const showToast = useShowToast();
  const setConnversations = useSetRecoilState(conversationsAtom)

    const handeleSendMessage = async(e) => {
      e.preventDefault()
      if(!messageText) return;
      try {
        const res = await fetch("/api/messages",{
          method: "Post",
          headers: {
            "content-Type": "application/json" 
          },
          body: JSON.stringify({message: messageText, recipientId: selectedConversation.userId})
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
        console.log(data);
      } catch (error) {
        showToast("Error", error, "error")

      }
      
    }
  return (
    <form onSubmit={handeleSendMessage}>
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
  )
}

export default MessageInput
