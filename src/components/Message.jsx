import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={"330px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus esse
            eius
          </Text>
          <Avatar src="" w={"7"} h={"7"} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src="" w={"7"} h={"7"} />
          <Text maxW={"330px"} bg={"gray.400"} color={"black"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus esse
            eius quisquam
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
