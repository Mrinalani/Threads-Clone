import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({reply, lastReply}) => {
  return (
    <>
      <Flex gap={8} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} name="Mark" size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}
            </Text>
           
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>

{!lastReply? <Divider my={4}/>: null}
    </>
  );
};

export default Comment;
