import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast"
import { useRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { GiConversation } from "react-icons/gi"

const ChatPage = () => {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const showToast = useShowToast()
  const [conversations, setConnversations] = useRecoilState(conversationsAtom);
  const [selectedConversion, SetSelectedConversion] = useRecoilState(selectedConversationAtom)
  useEffect(() => {
    const getConversations = async() => {
      try {
        const res = await fetch("/api/messages/conversations")

        const data = await res.json();
        console.log(data)
        if(data.error){
          showToast("Error", data.error, "error")
          return;
        }
        setConnversations(data)
      } catch (error) {
        showToast("Error", error.message, "error")
      }finally{
        setLoadingConversations(false);
      }
    }
    getConversations()
  },[showToast, setConnversations])
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        base: "100%",
        md: "80%",
        lg: "720px",
      }}
      p={4}
    >
      <Flex gap={4} flexDirection={{base:"column", md: "row"}} maxW={{sm:"400px", md: "full"}} mx={"auto"}>
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{sm:"250px", md:"full"}} mx={"auto"}>
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")} >Your conversations</Text>
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for a user" />
              <Button size={"sm"}><SearchIcon /></Button>
            </Flex>
          </form>
          {loadingConversations && (
            [0,1,2,3,4].map((_, i)=>(
              <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                <SkeletonCircle h={"10px"} w={"80px"}/>
                <SkeletonCircle h={"8px"} w={"90%"}/>
                </Flex>
              </Flex>
            ))
          )}
          {!loadingConversations && (
             conversations.map((conversation) => (
                < Conversation key={conversation._id} conversation={conversation} />
             ))
          )}
          
        </Flex>

        {!selectedConversion._id && (
            <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
            >
              <GiConversation size={100}/>
              <Text>Select a conversation to start messaging</Text>
            </Flex>
        )}
        {selectedConversion._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
