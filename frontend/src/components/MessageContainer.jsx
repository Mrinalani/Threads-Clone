import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";


const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([])
  const currentUser = useRecoilValue(userAtom)
  const {socket} = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom)
  const messageEndRef = useRef(null)

  useEffect(()=>{
    socket?.on("newMessages", (message) => {
      console.log("socket", message)
      if(selectedConversation._id === message.conversationId){
        setMessages((prevMessages) => [...prevMessages, message])
      }

      if(!document.hasFocus()) {
        const sound = new Audio(messageSound)
        sound.play()
      }
      setConversations((prevConv) => {
        const updatedConversations = prevConv.map(conversation => {
          if(conversation._id === message.conversationId){
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender
              }
            }
          }
          return conversation
        }) 
        return updatedConversations
      })
    })
    return () => socket.off("newMessages")
    }, [socket])

    useEffect(()=>{
      const lastMessageIsFromOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id;
      if(lastMessageIsFromOtherUser){
        socket.emit("markMessageAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId
        })
      }
      socket.on("messageSeen", ({conversationId}) => {
        if(selectedConversation._id === conversationId){
          setMessages(prev => {
            const updatedMessages = prev.map(message => {
              if(!message.seen){
                return {
                  ...message,
                  seen: true
                }
              }
              return message
            })
            return updatedMessages
          })
        }
      })
    },[socket, currentUser._id, messages, selectedConversation])

    useEffect(()=>{
   messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages, selectedConversation, setConversations]) 

   useEffect(() => {
      const getMessages = async() => {
        setLoadingMessages(true);
        setMessages([])
        try {
          if(selectedConversation.mock) return
          const res = await fetch(`/api/messages/${selectedConversation.userId}`)
  
          const data = await res.json();
          if(data.error){
            showToast("Error", data.error, "error")
            return;
          }
          setMessages(data)
          console.log("data of selected user",data)
        } catch (error) {
          showToast("Error", error.message, "error")
        }finally {
          setLoadingMessages(false)
        }
      }
      getMessages()
    },[showToast, selectedConversation.userId, selectedConversation.mock])
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
           {selectedConversation.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />
      <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
      {loadingMessages && (
        [...Array(5)].map((_, i)=>(
           <Flex 
           key={i}
           gap={2}
           alignItems={"center"}
           p={1}
           borderRadius={"md"}
           alignSelf={i%2 === 0 ? "flex-start": "flex-end"}
           >
              {i%2 ===0 && <SkeletonCircle size={7}/>}
              <Flex flexDir={"column"} gap={2}>
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i%2 !==0 && <SkeletonCircle size={7}/>}
           </Flex>
        ))
      )}
        {!loadingMessages && (
          messages?.map((message) =>(
            <Flex key={message._id} direction={"column"}
            ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
            >
             <Message key = {message._id} message={message} ownMessage={currentUser._id === message.sender}/>
             </Flex>
          ))
        )}      
      </Flex>
      <MessageInput setMessages = {setMessages} messages={messages}/>
    </Flex>
  );
};

export default MessageContainer;
