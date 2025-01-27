import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";


const Conversation = ({conversation}) => {
  const currentUser = useRecoilValue(userAtom)
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const [selectedConversion, SetSelectedConversion] = useRecoilState(selectedConversationAtom)
  const colorMode = useColorMode()
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.700"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() => SetSelectedConversion({
        _id: conversation._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
        mock: conversation.mock
      })}
      bg={selectedConversion?._id === conversation._id ? (colorMode === "light" ? "gray.600": "gray.dark"): ""}
    >
      <WrapItem>
        <Avatar size={{
            base: "xs",
            sm: "sm",
          }}
          src={user.profilePic} >
          <AvatarBadge boxSize="1em" bg="green.500"/>
          </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
      <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
    {user.username}
    <Image src="/verified.png" w={4} h={4} ml={1} />
  </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"}>
          {currentUser._id === lastMessage.sender ? <BsCheck2All size={16} /> : ""}
            {lastMessage.text?.length > 18 ? lastMessage.text.substring(0, 18) + "...": lastMessage.text}
        </Text>

      </Stack>
    </Flex>
  );
};

export default Conversation
