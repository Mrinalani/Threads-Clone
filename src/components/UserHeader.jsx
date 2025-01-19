import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  Link,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom)
  const [following, setFollowing] = useState(user.followers.includes(currentUser._id))
  const [updating, setUpdating] = useState(false)
  const showToast = useShowToast()
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        // title: "Account created",
        // status: "Success",
        description: "Profile link copied",
        // duration: 3000,
        // isClosable: true
      });
    });
  };

  const handleUnFollowFollow = async() => {
    try {
      if(!currentUser){
        showToast("Error", `Please Login to follow`, "error")
      }
      if(updating) return;
      setUpdating(true)
      const res = await fetch(`/api/users/follow/${user._id}`,{
        method: "POST",
        headers: {
          "content-Types": "/application/json"
        }
      })

      const data = await res.json();
      if(data.error){
        showToast("Error", data.error, "Error")
        return
      }
      if(following){
        showToast("Success", `UnFollowed ${user.name}`, "Success")
        user.followers.pop();
      }else{
        showToast("Success", `Followed ${user.name}`, "Success")
        user.followers.push(currentUser._id)
      }

      setFollowing(!following)
      console.log(data)
    } catch (error) {
      showToast("Error", error, "Error")
    }finally{
      setUpdating(false)
    }

  }

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}

          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="/https:/bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser._id === user._id &&(
        <Link as={RouterLink} to={'/update'} >
            <Button size={"sm"}>
                 Update profile
            </Button>
        </Link>
      )}

{currentUser._id !== user._id &&(
            <Button size={"sm"} onClick={handleUnFollowFollow} isLoading={updating}>
                 {following ? "Unfollow": "Follow"}
            </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>Instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray:dark"}>
                  <MenuItem value="new-txt" bg={"gray:dark"} onClick={copyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb={3}
          color={"gray.light"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
