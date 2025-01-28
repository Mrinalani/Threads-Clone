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
import React, { useEffect, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, SetSelectedConversion] = useRecoilState(selectedConversationAtom)
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([])
  const currentUser = useRecoilValue(userAtom)
  const {socket} = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom)

  useEffect(()=>{
    socket?.on("newMessages", (message) => {
      console.log("socket", message)
      setMessages((prevMessages) => [...prevMessages, message])
      setConversations((prevConv) => {
        const updatedConversations = prevConv.map(conversation => {
          if(conversation._id === selectedConversation._id){
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
    },[showToast, selectedConversation.userId])
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
             <Message key = {message._id} message={message} ownMessage={currentUser._id === message.sender}
             />
          ))
        )}      
      </Flex>
      <MessageInput setMessages = {setMessages} messages={messages}/>
    </Flex>
  );
};

export default MessageContainer;
